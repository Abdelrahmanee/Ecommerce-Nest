import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { Wishlist, WishlistSchema } from './wishlist.schema';
import { WishlistRepository } from 'src/common/repositories/wishlist.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Wishlist.name, schema: WishlistSchema }])],
  controllers: [WishlistController],
  providers: [WishlistService , WishlistRepository],
  exports: [WishlistService],
})
export class WishlistModule {}
