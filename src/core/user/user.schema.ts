import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRoles } from 'src/common/constants/user.roles';
import { ShippingAddress } from 'src/common/interfaces/shipping-address.interface';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name must be at least 3 characters'],
    max: [30, 'Name must be at most 30 characters'],
  })
  name: string;
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;
  @Prop({
    type: String,
    required: true,
    min: [3, 'password must be at least 3 characters'],
    max: [20, 'password must be at most 20 characters'],
  })
  password: string;
  @Prop({
    type: String,
    required: true,
    enum: UserRoles,
    default : UserRoles.USER
  })
  role: string;
  @Prop({
    type: String,
  })
  avatar: string;
  @Prop({
    type: Number,
  })
  age: number;
  @Prop({
    type: String,
  })
  phoneNumber: string;
  @Prop({
    type: [{
      firstName: String,
      lastName: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      country: String,
      phoneNumber: String,
      isDefault: {
        type: Boolean,
        default: false
      }
    }],
    _id:true,
    default: [],
  })
  shippingAddress: ShippingAddress[] ;
  @Prop({
    type: Boolean,
    enum: [false, true],
  })
  active: boolean;
  @Prop({
    type: String,
  })
  verificationCode: string;
  @Prop({
    type: Date,
  })
  expiry: Date;
  @Prop({
    type: Date,
  })
  lastResetPassword: Date;
  @Prop({
    type: String,
    enum: ['male', 'female'],
  })
  gender: string;
}



export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});