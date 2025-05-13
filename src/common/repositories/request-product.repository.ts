

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from './generic.repoitory';
import { RequestProduct, RequestProductDocument } from 'src/core/request-product/request-product.schema';

@Injectable()
export class RequestProductRepository extends GenericRepository<RequestProductDocument> {
  constructor(@InjectModel(RequestProduct.name) private requestProductModel: Model<RequestProductDocument>) {
    super(requestProductModel);
  }
}