import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CartRepository } from 'src/common/repositories/cart.repository';
import { ProductRepository } from 'src/common/repositories/product.repository';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './cart.schema';
import { Types } from 'mongoose';
import { CouponService } from '../coupon/coupon.service';
import { AddItemDto } from './dto/add-item.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { CreateCouponDto } from '../coupon/dto/create-coupon.dto';
import { UpdateItemQuantityDto } from './dto/update-quntity.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
    private readonly couponService: CouponService,
  ) { }

  async createCart(userId: string): Promise<Cart> {
    return this.cartRepository.create({
      user: new Types.ObjectId(userId),
      cartItems: [],
      totalPrice: 0,
      totalPriceAfterDiscount: 0,
      appliedCoupons: [],
      itemCount: 0,
      status: 'active',
      lastActivity: new Date(),
    }, false); // return mongoose document (lean: false)
  }

  async getOrCreateCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne(
      { user: new Types.ObjectId(userId), status: 'active' },
      undefined,
      { lean: false }
    );
    if (!cart) return this.createCart(userId);
    return cart;
  }

  async getUserCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne(
      { user: new Types.ObjectId(userId), status: 'active' },
      undefined,
      {
        populate: {
          path: 'cartItems.productId',
          select: 'name images price priceAfterDiscount stock description slug',
        },
        lean: false, // Important if you want to modify the cart
      }
    );
    if (!cart) {
      return this.createCart(userId);
    }
    return cart;
  }

  async addItem(userId: string, addItemDto: AddItemDto): Promise<Cart> {
    const { productId, quantity, color, size, customizations } = addItemDto;

    const cart = await this.getOrCreateCart(userId);
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const itemIndex = cart.cartItems.findIndex(
      item => item.productId.toString() === productId && item?.color === color && item?.size === size
    );

    if (itemIndex > -1) {
      const newQuantity = cart.cartItems[itemIndex].quantity + quantity;

      if (product.quantity < newQuantity) {
        throw new BadRequestException(
          `Cannot add ${quantity} more items. Only ${product.quantity - cart.cartItems[itemIndex].quantity} additional items available.`
        );
      }

      cart.cartItems[itemIndex].quantity = newQuantity;
      const price = cart.cartItems[itemIndex].priceAfterDiscount || cart.cartItems[itemIndex].price;
      cart.cartItems[itemIndex].itemTotal = price * newQuantity;
    } else {

      if (product.quantity < quantity) {
        throw new BadRequestException(`Not enough stock available. Only ${product.quantity} items remaining.`);
      }

      const price = product.priceAfterDiscount || product.price;
      cart.cartItems.push({
        productId: new Types.ObjectId(productId),
        quantity,
        color: color || '',
        size: size || '',
        price: product.price,
        priceAfterDiscount: product.priceAfterDiscount,
        itemTotal: price * quantity,
        productName: product.title,
        productImage: product.images?.length ? product.images[0] : '',
        inStock: true,
        addedAt: new Date(),
        customizations: customizations || {},
      });
    }

    await this.recalculateCart(cart);

    return this.cartRepository.updateById(
      cart._id.toString(),
      cart,
      { new: true, lean: false }
    );
  }
  async updateItemQuantity(userId: string, itemDetails: UpdateItemQuantityDto, color = '', size = ''): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const { quantity, productId } = itemDetails
    const itemIndex = cart.cartItems.findIndex(
      item => item.productId.toString() === productId && item.color === color && item.size === size
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (product.quantity < quantity) {
      throw new BadRequestException(`Not enough stock available. Only ${product.quantity} items remaining.`);
    }

    if (quantity <= 0) {
      cart.cartItems.splice(itemIndex, 1);
    } else {
      cart.cartItems[itemIndex].quantity = quantity;
      const price = cart.cartItems[itemIndex].priceAfterDiscount || cart.cartItems[itemIndex].price;
      cart.cartItems[itemIndex].itemTotal = price * quantity;
    }

    await this.recalculateCart(cart);

    return this.cartRepository.updateById(
      cart._id.toString(),
      cart,
      { new: true, lean: false }
    );
  }

  async removeItem(userId: string, productId: string, color = '', size = ''): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const itemIndex = cart.cartItems.findIndex(
      item => item.productId.toString() === productId && item.color === color && item.size === size
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    cart.cartItems.splice(itemIndex, 1);

    await this.recalculateCart(cart);

    return this.cartRepository.updateById(
      cart._id.toString(),
      cart,
      { new: true, lean: false }
    );
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    cart.cartItems = [];
    cart.appliedCoupons = [];
    cart.totalPrice = 0;
    cart.totalPriceAfterDiscount = 0;
    cart.shippingCost = 0;
    cart.tax = 0;
    cart.itemCount = 0;
    cart.lastActivity = new Date();

    return this.cartRepository.updateById(
      cart._id.toString(),
      cart,
      { new: true, lean: false }
    );
  }

  // Cart Utilaties

  async applyCoupon(userId: string, applyCouponDto: CreateCouponDto): Promise<Cart> {
    const { code } = applyCouponDto;
    const cart = await this.getOrCreateCart(userId);

    if (cart.cartItems.length === 0) {
      throw new BadRequestException('Cannot apply coupon to an empty cart');
    }

    const coupon = await this.couponService.validateCoupon({ code }, userId);

    const couponExists = cart.appliedCoupons.some(
      c => c.couponId.toString() === coupon._id.toString()
    );

    if (couponExists) {
      throw new BadRequestException('This coupon is already applied to your cart');
    }

    cart.appliedCoupons.push({
      name: coupon.code,
      couponId: coupon._id,
      discountAmount: coupon.discount,
      discountType: coupon.discountType,
      appliedAt: new Date(),
      expiresAt: coupon.expiresAt,
    });

    await this.recalculateCart(cart);

    return this.cartRepository.updateById(
      cart._id.toString(),
      cart,
      { new: true, lean: false }
    );
  }

  async removeCoupon(userId: string, couponId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const couponIndex = cart.appliedCoupons.findIndex(
      c => c.couponId.toString() === couponId
    );

    if (couponIndex === -1) {
      throw new NotFoundException('Coupon not found in cart');
    }

    cart.appliedCoupons.splice(couponIndex, 1);

    await this.recalculateCart(cart);

    return this.cartRepository.updateById(
      cart._id.toString(),
      cart,
      { new: true, lean: false }
    );
  }

  async markAsAbandoned(cartId: string): Promise<Cart> {
    const cart = await this.cartRepository.findById(
      cartId,
      undefined,
      { lean: false }
    );

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    cart.status = 'abandoned';

    return cart.save();
  }

  async convertToOrder(cartId: string): Promise<Cart> {
    const cart = await this.cartRepository.findById(
      cartId,
      undefined,
      { lean: false }
    );

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    for (const item of cart.cartItems) {
      const product = await this.productRepository.findById(item.productId.toString());

      if (!product || product.quantity < item.quantity) {
        throw new BadRequestException(`Product ${product?.title || item.productId} is out of stock or has insufficient quantity`);
      }
    }

    cart.status = 'converted';

    return cart.save();
  }

  private async recalculateCart(cart: Cart): Promise<void> {
    cart.totalPrice = cart.cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    cart.itemCount = cart.cartItems.reduce(
      (count, item) => count + item.quantity,
      0
    );

    if (cart.appliedCoupons.length > 0) {
      let discountAmount = 0;
      for (const coupon of cart.appliedCoupons) {
        if (coupon.discountType === 'percentage') {
          discountAmount += cart.totalPrice * (coupon.discountAmount / 100);
        } else {
          discountAmount += coupon.discountAmount;
        }
      }

      discountAmount = Math.min(discountAmount, cart.totalPrice);

      cart.totalPriceAfterDiscount = parseFloat((cart.totalPrice - discountAmount).toFixed(2));
    } else {
      cart.totalPriceAfterDiscount = cart.totalPrice;
    }

    cart.lastActivity = new Date();
  }
}
