import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from 'src/common/repositories/cart.repository';
import { ProductRepository } from 'src/common/repositories/product.repository';
import { CouponService } from '../coupon/coupon.service';
import { CartService } from '../cart/cart.service';
import { OrderRepository } from 'src/common/repositories/order.repository';
import { ObjectId } from 'mongoose';
import { OrderItemDto } from './dto/order-item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { ShippingAddressDto } from './dto/shipping-address.dto';

@Injectable()
export class OrderService {

    constructor(
        private readonly cartRepository: CartRepository,
        private readonly productRepository: ProductRepository,
        private readonly couponService: CouponService,
        private readonly cartService: CartService,
        private readonly orderRepository: OrderRepository,
        
      ) { }

      async createCashOrder(userId: string , couponCode: string , shippingAddress  : ShippingAddressDto) {
        const cart = await this.cartService.getUserCart(userId)
        if (!cart) throw new NotFoundException('Cart not found');
        if (cart.cartItems.length === 0) throw new BadRequestException('Cart is empty');
        const createOrderDto: CreateOrderDto = {
            orderItems: cart.cartItems.map(item => ({
                productId: item.productId.toString(),
                quantity: item.quantity,
                productName: item.productName,
                price: item.price,
                priceAfterDiscount: item.priceAfterDiscount,
                color: item.color
            })),
            shippingAddress: shippingAddress,
            paymentMethodType: 'cash'
        };
        if (couponCode) {
            const validCoupon = await this.couponService.validateCoupon({ code: couponCode }, userId);
            createOrderDto.couponId = validCoupon._id.toString();
        }
        const order = await this.createOrder(userId, createOrderDto);
        await Promise.all([
            ...createOrderDto.orderItems.map(item => 
                this.productRepository.updateById(
                    item.productId,
                    { 
                        $inc: { 
                            quantity: -item.quantity,
                            sold: item.quantity 
                        }
                    }
                )
            ),
            this.cartService.clearCart(userId)
        ]);

        return order
      }

      async createOrder( userId: string, createOrderDto: CreateOrderDto) {
        const orderItems = createOrderDto.orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          productName: item.productName,
          price: item.price,
          priceAfterDiscount: item.priceAfterDiscount || null,
          color: item.color || '',
        }));
        
        const totalOrderPrice = orderItems.reduce((total, item) => {
          const itemPrice = item.priceAfterDiscount || item.price;
          return total + (itemPrice * item.quantity);
        }, 0);
    
        const order = await this.orderRepository.create({
          user: userId,
          orderItems,
          paymentMethodType: createOrderDto.paymentMethodType || 'cash',
          orderStatus: 'pending',
          shippingAddress: createOrderDto.shippingAddress,
          couponId: createOrderDto.couponId,
          totalOrderPrice: totalOrderPrice,
          isPaid: createOrderDto.paymentMethodType === 'cash',
          paidAt: createOrderDto.paymentMethodType === 'cash' ? new Date() : null,
        });
        
        return await order.save();
      }
}
