import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({
    type: String,
    required: true,
    min: [2, 'Name must be at least 2 characters'],
    max: [30, 'Name must be at most 30 characters'],
    unique: true
  })
  name: string;
  @Prop({
    type: String,
  })
  image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
