import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from './generic.repoitory';
import { Coupon, CouponDocument } from 'src/core/coupon/copoun.schema';

@Injectable()
export class CouponRepository extends GenericRepository<CouponDocument> {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<CouponDocument>) {
    super(couponModel);
  }
  async countDocuments(options ?): Promise<number> {
    return this.couponModel.countDocuments(options).exec();
  }

}