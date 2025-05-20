import { BadRequestException, Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { WishlistRepository } from "src/common/repositories/wishlist.repository";



@Injectable()
export class WishlistService {

    constructor(private readonly wishlistRepository: WishlistRepository) { }

    async getOrCreateWishlist(userId: string) {

        const userWishList = await this.wishlistRepository.findOne({ userId }, {},
            {
                populate: {
                    path: 'products',
                    select: 'name price images description quantity category brand',
                    model: 'Product',
                    options:{lean : true}

                }, lean: false
            })
        if (userWishList) return userWishList
        return this.wishlistRepository.create({ userId })
    }

    async addItemToWsihlist(userId: string, productId: string) {
        const userWishList = await this.getOrCreateWishlist(userId)
        const isItemExist = userWishList.products.find(product => product._id.toString() == productId)
        if (isItemExist) throw new BadRequestException("Item already exists in wishlist")

        userWishList.products.push(new Types.ObjectId(productId))
        return userWishList.save()
    }

    async removeItemFromWishlist(userId: string, productId: string) {
        const userWishList = await this.getOrCreateWishlist(userId)
        const isItemExist = userWishList.products.find(product => product._id.toString() == productId)
        if (!isItemExist) throw new BadRequestException("Item does not exists in wishlist")

        userWishList.products = userWishList.products.filter(product => product._id.toString() != productId)
        return userWishList.save()
    }
    async getUserWishlist(userId: string) {
        const userWishList = await this.getOrCreateWishlist(userId)
        return userWishList
    }
    async clearWishlistItems(userId: string) {
        const userWishList = await this.getOrCreateWishlist(userId)
        userWishList.products = []
        return userWishList.save()
    }

    // private mapToResponseDto(wishlist: any): WishlistResponseDto {
    //     return {
    //       id: wishlist._id.toString(),
    //       userId: typeof wishlist.userId === 'object' ? 
    //         { 
    //           id: wishlist.userId._id.toString(),
    //           username: wishlist.userId.username,
    //           email: wishlist.userId.email,
    //           profileImage: wishlist.userId.profileImage
    //         } : 
    //         wishlist.userId.toString(),
    //       products: wishlist.products.map(product => 
    //         typeof product === 'object' ? 
    //           {
    //             id: product._id.toString(),
    //             name: product.name,
    //             price: product.price,
    //             description: product.description,
    //             images: product.images,
    //             stock: product.stock,
    //             categories: product.categories
    //           } : 
    //           product.toString()
    //       ),
    //       productCount: wishlist.products.length,
    //       createdAt: wishlist.createdAt,
    //       updatedAt: wishlist.updatedAt
    //     };
    //   }
    // }




    /**Admin(only)*/
    async findAllWishLists(options: { page?: number; limit?: number; sort?: string; filter?: Record<string, any> }) {
        const { page = 1, limit = 10, filter = {} } = options;

        const result = await this.wishlistRepository.findAll(filter, undefined,
            {
                page,
                limit,
                populate: [
                    { 
                        path: 'products', 
                         model: 'Product',
                        select: 'name price quantity images category brand',
                        options: { lean: true }
                    },
                    { 
                        path: 'userId', 
                        select: 'name email',
                        options: { lean: true } 
                    }
                ],
                lean: true
            }
        );
        return {
            data: result.data,
            total: result.total,
            page,
            limit,
            totalPages: Math.ceil(result.total / limit)
        };
    }




}