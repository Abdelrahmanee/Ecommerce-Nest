import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from 'src/core/product/product.schema';
import { User } from '../user/user.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  user: string;

  @Prop({
    type: String,
    required: false,
  })
  sessionId: string;

  @Prop({
    type: String,
    required: false,
    enum: ['pending', 'processing', 'shipping', 'delivered', 'canceled'],
    default: 'pending',
  })
  orderStatus: string;

  @Prop({
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: Product.name,
        },
        productName: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        priceAfterDiscount: {
          type: Number,
          required: false,
        },
        quantity: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          default: '',
        },
      },
    ],
  })
  orderItems: Array<{productId: string ;productName: string;price: number;priceAfterDiscount?: number;quantity: number;color: string;}>;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  })
  couponId: string;

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  taxPrice: number;

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  shippingPrice: number;

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  totalOrderPrice: number;

  @Prop({
    type: String,
    required: false,
    default: 'card',
    enum: ['cash', 'card'],
  })
  paymentMethodType: string;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isPaid: boolean;
  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isDefault: boolean;

  @Prop({
    type: Date,
    required: false,
  })
  paidAt: Date;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isDelivered: boolean;

  @Prop({
    type: Date,
    required: false,
  })
  deliveredAt: Date;

  @Prop({
    type: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      address1: {
        type: String,
        required: true,
      },
      address2: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
    },
    required: true,
  })
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    country: string;
    phoneNumber: string;
  };
}

export const OrderSchema = SchemaFactory.createForClass(Order);