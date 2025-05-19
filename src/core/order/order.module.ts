import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from '../cart/cart.schema';
import { Product, ProductSchema } from '../product/product.schema';
import { Order, OrderSchema } from './order.schema';
import { CartService } from '../cart/cart.service';
import { CartRepository } from 'src/common/repositories/cart.repository';
import { ProductRepository } from 'src/common/repositories/product.repository';
import { CouponModule } from '../coupon/coupon.module';
import { AddressController } from './address.controller';
import { OrderRepository } from 'src/common/repositories/order.repository';
import { AddressService } from './address.service';
import { User, UserSchema } from '../user/user.schema';
import { UserRepository } from 'src/common/repositories/user.repository';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema }
    ]),
    CouponModule,
    UserModule
  ],
  controllers: [OrderController , AddressController ],
  providers: [
    OrderService,
    AddressService,
    CartService,
    UserService, 
    UserRepository,
    CartRepository, 
    OrderRepository,
    ProductRepository
  ],
  exports: [OrderService , AddressService],
})
export class OrderModule {}
