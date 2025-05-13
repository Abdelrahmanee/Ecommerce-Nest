import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from './generic.repoitory';
import { Cart, CartDocument } from 'src/core/cart/cart.schema';

@Injectable()
export class CartRepository extends GenericRepository<CartDocument> {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {
    super(cartModel);
  }

}