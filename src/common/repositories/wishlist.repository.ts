import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from './generic.repoitory';
import { Wishlist, WishlistDocument } from 'src/core/wishlist/wishlist.schema';

@Injectable()
export class WishlistRepository extends GenericRepository<WishlistDocument> {
  constructor(@InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>) {
    super(wishlistModel);
  }

}