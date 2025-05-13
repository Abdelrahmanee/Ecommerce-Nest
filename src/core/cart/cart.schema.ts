import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from 'src/core/product/product.schema';
import { User } from '../user/user.schema';
import { Coupon } from '../coupon/copoun.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ _id: false })
export class CartItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Product.name,
  })
  productId: mongoose.Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
    min: 1,
    default: 1,
  })
  quantity: number;

  @Prop({
    type: String,
    default: '',
  })
  color: string;

  @Prop({
    type: String,
    default: '',
  })
  size: string;

  @Prop({
    type: Number,
    required: true,
  })
  price: number;

  @Prop({
    type: Number,
  })
  priceAfterDiscount: number;

  @Prop({
    type: Number,
  })
  itemTotal: number;

  @Prop({
    type: String,
  })
  productName: string;

  @Prop({
    type: String,
  })
  productImage: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  inStock: boolean;

  @Prop({
    type: Date,
    default: Date.now,
  })
  addedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: {},
  })
  customizations: Record<string, any>;
}

const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ _id: false })
export class AppliedCoupon {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Coupon.name,
    required: true,
  })
  couponId: mongoose.Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
  })
  discountAmount: number;

  @Prop({
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  })
  discountType: string;

  @Prop({
    type: Date,
    required: true,
  })
  appliedAt: Date;

  @Prop({
    type: Date,
  })
  expiresAt: Date;
}

const AppliedCouponSchema = SchemaFactory.createForClass(AppliedCoupon);

@Schema({ 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Cart {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  })
  _id: mongoose.Types.ObjectId;
  @Prop({
    type: [CartItemSchema],
    default: [],
  })
  cartItems: CartItem[];

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  totalPrice: number;

  @Prop({
    type: Number,
    default: 0,
  })
  totalPriceAfterDiscount: number;

  @Prop({
    type: Number,
    default: 0,
  })
  shippingCost: number;

  @Prop({
    type: Number,
    default: 0,
  })
  tax: number;

  @Prop({
    type: [AppliedCouponSchema],
    default: [],
  })
  appliedCoupons: AppliedCoupon[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  user: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    default: 'active',
    enum: ['active', 'abandoned', 'converted', 'expired'],
  })
  status: string;

  @Prop({
    type: Date,
  })
  lastActivity: Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  saveForLater: boolean;

  @Prop({
    type: Number,
    default: 0,
  })
  itemCount: number;

  @Prop({
    type: String,
  })
  currency: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: {},
  })
  metadata: Record<string, any>;
}

// Add middleware hooks for cart calculations
const CartSchema = SchemaFactory.createForClass(Cart);

// Calculate totals before saving
CartSchema.pre('save', function(next) {
  // Update item totals
  this.cartItems.forEach(item => {
    const itemPrice = item.priceAfterDiscount || item.price;
    item.itemTotal = itemPrice * item.quantity;
  });

  // Update total price
  this.totalPrice = this.cartItems.reduce((total, item) => 
    total + (item.price * item.quantity), 0);
  
  // Update item count
  this.itemCount = this.cartItems.reduce((count, item) => 
    count + item.quantity, 0);
  
  // Update last activity
  this.lastActivity = new Date();
  
  next();
});

// Add virtual for grand total
CartSchema.virtual('grandTotal').get(function() {
  return this.totalPriceAfterDiscount || this.totalPrice + this.shippingCost + this.tax;
});

// Add method to apply coupon
CartSchema.methods.applyCoupon = function(coupon) {
  // Implementation for applying coupon
};

// Add method to check if a product exists in cart
CartSchema.methods.hasProduct = function(productId) {
  return this.cartItems.some(item => item.productId.toString() === productId.toString());
};

export { CartSchema };