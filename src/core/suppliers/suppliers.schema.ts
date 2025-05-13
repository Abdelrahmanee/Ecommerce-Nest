import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema({ timestamps: true })
export class Supplier {
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name must be at least 3 characters'],
    max: [100, 'Name must be at most 100 characters'],
  })
  name: string;
  @Prop({
    type: String,
  })
  website: string;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
