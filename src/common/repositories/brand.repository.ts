import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from './generic.repoitory';
import { Brand, BrandDocument } from 'src/core/brand/brand.schema';

@Injectable()
export class BrandRepository extends GenericRepository<BrandDocument> {
  constructor(@InjectModel(Brand.name) private brandModel: Model<BrandDocument>) {
    super(brandModel);
  }

}