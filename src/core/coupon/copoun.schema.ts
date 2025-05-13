import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from '../product/product.schema';
import { Category } from '../category/category.schema';
import { User } from '../user/user.schema';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true , _id : true  })
export class Coupon {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  })
  _id: mongoose.Types.ObjectId;
  @Prop({
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  })
  code: string;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    default: '',
  })
  description: string;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  discount: number;

  @Prop({
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  })
  discountType: string;

  @Prop({
    type: Date,
  })
  expiresAt: Date;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: Number,
    default: 0,
  })
  usageCount: number;

  @Prop({
    type: Number,
  })
  usageLimit: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  isSingleUsePerUser: boolean;

  @Prop({
    type: Number,
  })
  minimumPurchase: number;

  @Prop({
    type: Number,
  })
  maximumDiscountAmount: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  })
  applicableProducts: mongoose.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  })
  applicableCategories: mongoose.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  restrictedToUsers: mongoose.Types.ObjectId[];

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

CouponSchema.index({ code: 1 });

CouponSchema.index({ isActive: 1, expiresAt: 1 });