import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './core/auth/auth.module';
import { EmailService } from './common/services/email.service';
import { CategoryModule } from './core/category/category.module';
import { SubCategoryModule } from './core/sub-category/sub-category.module';
import { BrandModule } from './core/brand/brand.module';
import { CouponModule } from './core/coupon/coupon.module';
import { ReviewModule } from './core/review/review.module';
import { TaxModule } from './core/tax/tax.module';
import { SuppliersModule } from './core/suppliers/suppliers.module';
import { ProductModule } from './core/product/product.module';
import { CartModule } from './core/cart/cart.module';
import { RequestProductModule } from './core/request-product/request-product.module';
import { OrderModule } from './core/order/order.module';
import { UserModule } from './core/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    UserModule,
    AuthModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    CouponModule,
    ReviewModule,
    TaxModule,
    SuppliersModule,
    ProductModule,
    CartModule,
    OrderModule,
    RequestProductModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '86400s' },
    }),
  ],
  controllers: [],
  providers: [EmailService],
  exports:[EmailService]
})
export class AppModule { }
