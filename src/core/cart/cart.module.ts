import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from './cart.schema';
import { CartRepository } from 'src/common/repositories/cart.repository';
import { ProductRepository } from 'src/common/repositories/product.repository';
import { CouponModule } from '../coupon/coupon.module';
import { Product, ProductSchema } from '../product/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema }
    ]),
    forwardRef(() => CouponModule)
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository, ProductRepository],
  exports: [CartService, CartRepository]
})
export class CartModule { }