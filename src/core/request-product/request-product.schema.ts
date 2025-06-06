import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';

export type RequestProductDocument = HydratedDocument<RequestProduct>;

@Schema({ timestamps: true })
export class RequestProduct {
    @Prop({
        type: String,
        required: true,
    })
    titleNeed: string;

    @Prop({
        type: String,
        min: [5, 'Details must be at least 5 characters'],
        required: true,
    })
    details: string;
    @Prop({
        type: Number,
        min: [1, 'Qauntity must be at least 1 product'],
        required: true,
    })
    quantity: number;
    @Prop({
        type: String,
    })
    category: string;
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
    })
    createdBy : string
}

export const RequestProductSchema =SchemaFactory.createForClass(RequestProduct);
