import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from 'src/core/brand/brand.schema';
import { Category } from 'src/core/category/category.schema';
import { SubCategory } from 'src/core/sub-category/sub-category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false }) 
export class AuditLog {
  @Prop({ type: String, required: true })
  action: string; 

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  userName: string;

  @Prop({ type: Object })
  changedFields?: Record<string, any>;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;

  @Prop({ type: String })
  ipAddress?: string;

  @Prop({ type: String })
  userAgent?: string;
}

const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Product {
  @Prop({
    type: String,
    required: true,
    min: [3, 'Title must be at least 3 characters'],
    index: true,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
    min: [20, 'Description must be at least 20 characters'],
  })
  description: string;

  @Prop({
    type: Number,
    required: true,
    default: 1,
    min: [1, 'Description must be at least 1 product'],
  })
  quantity: number;

  @Prop({ type: String, required: true })
  imageCover: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Number, default: 0 })
  sold: number;

  @Prop({
    type: Number,
    required: true,
    min: [1, 'Price must be at least 1 L.E'],
    max: [20000, 'Price cannot exceed 20000 L.E'],
  })
  price: number;

  @Prop({ type: Number, default: 0, max: [20000, 'Price cannot exceed 20000 L.E'] })
  priceAfterDiscount: number;

  @Prop({ type: [String], default: [] })
  colors: string[];

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: String })
  subCategory: string;

  @Prop({ type: String })
  brand: string;

  @Prop({
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
  })
  ratingsAverage: number;

  @Prop({ type: Number, default: 0 })
  ratingsQuantity: number;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ type: [AuditLogSchema], default: [] })
  auditLogs: AuditLog[];

  @Prop({ type: Number, default: 0 })
  __v: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  lastUpdatedBy: mongoose.Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);


// Add virtual fields for referenced data
ProductSchema.virtual('categoryRef', {
  ref: 'Category',
  localField: 'category',
  foreignField: 'name',
  justOne: true,
});

ProductSchema.virtual('subCategoryRef', {
  ref: 'SubCategory',
  localField: 'subCategory',
  foreignField: 'name',
  justOne: true,
});

ProductSchema.virtual('brandRef', {
  ref: 'Brand',
  localField: 'brand',
  foreignField: 'name',
  justOne: true,
});

// Add virtual for creator user reference
ProductSchema.virtual('createdByUser', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true,
});

// Add virtual for last updater user reference
ProductSchema.virtual('lastUpdatedByUser', {
  ref: 'User',
  localField: 'lastUpdatedBy',
  foreignField: '_id',
  justOne: true,
});

// Add index for better query performance
ProductSchema.index({ title: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: 1 });