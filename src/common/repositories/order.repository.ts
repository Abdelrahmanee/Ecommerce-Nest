import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from './generic.repoitory';
import { Order, OrderDocument } from 'src/core/order/order.schema';

@Injectable()
export class OrderRepository extends GenericRepository<OrderDocument> {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {
    super(orderModel);
  }

}