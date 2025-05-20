import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsArray, IsDate, ValidateNested } from 'class-validator';


@Schema({
  collection: 'wishlists',
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Wishlist extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.toString())
  userId : string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Product' }],
    default: [],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Types.ObjectId)
  @Transform(({ value }) => value.map(id => id.toString()))
  products: Types.ObjectId[];
  @Prop({
    type: Date,
    default: Date.now,
    immutable: true,
  })
  @IsDate()
  createdAt: Date;
  @Prop({
    type: Date,
    default: Date.now,
  })
  @IsDate()
  updatedAt: Date;
}

export type WishlistDocument = Wishlist & Document;
export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

WishlistSchema.index({ userId: 1 }, { unique: true });
WishlistSchema.index({ createdAt: -1 });

WishlistSchema.virtual('productCount').get(function() {
  return this.products.length;
});

WishlistSchema.pre('save', function(next) {
  if (this.products && this.products.length) {
    this.products = [...new Set(this.products.map(p => p.toString()))].map(
      id => new Types.ObjectId(id)
    );
  }
  next();
});