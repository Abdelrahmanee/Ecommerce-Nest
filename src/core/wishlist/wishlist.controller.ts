import { Controller, Get, Post, Delete, Param, UseGuards, Req, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from 'src/common/guard/Auth.guard';
import { Request } from 'express';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { UserRoles } from 'src/common/constants/user.roles';
import { ApiResponse } from 'src/common/dto/api-response.dto';

@ApiTags('Wishlist')
@Controller({ path: 'wishlist', version: '1' })
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) { }

    @Post('products/:productId')
    @Roles([UserRoles.USER])
    @ApiOperation({ summary: 'Add product to wishlist' })
    async addToWishlist(@Param('productId') productId: string, @Req() req: Request) {
        const wishlist = await this.wishlistService.addItemToWsihlist(req.user._id, productId);
        return ApiResponse.success(wishlist, 'Product added to wishlist');
    }

    @Delete('products/:productId')
    @Roles([UserRoles.USER])
    @ApiOperation({ summary: 'Remove product from wishlist' })
    async removeFromWishlist(@Param('productId') productId: string, @Req() req: Request) {
        const wishlist = await this.wishlistService.removeItemFromWishlist(req.user._id, productId);
        return ApiResponse.success(wishlist, 'Product removed from wishlist');
    }

    @Get('my')
    @Roles([UserRoles.USER])
    @ApiOperation({ summary: 'Get user wishlist' })
    async getMyWishlist(@Req() req: Request) {
        const wishlist = await this.wishlistService.getUserWishlist(req.user._id);
        return ApiResponse.success(wishlist, 'User wishlist');
    }

    @Delete('clear')
    @Roles([UserRoles.USER])
    @ApiOperation({ summary: 'Clear wishlist' })
    async clearWishlist(@Req() req: Request) {
        const wishlist = await this.wishlistService.clearWishlistItems(req.user._id);
        return ApiResponse.success(wishlist, 'Wishlist cleared');
    }

    @Get('admin/all')
    @Roles([UserRoles.ADMIN])
    @ApiOperation({ summary: 'Get all wishlists (Admin only)' })
    async getAllWishlists(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('sort') sort: string = '-createdAt',
        @Query('filter') filter: string = '{}'
    ) {
        const currentPage = Math.max(1, parseInt(page) || 1);
        const itemsPerPage = Math.max(1, parseInt(limit) || 10);
        const parsedFilter = filter ? JSON.parse(filter) : {};

        const wishlists = await this.wishlistService.findAllWishLists({
            page: currentPage,
            limit: itemsPerPage,
            sort,
            filter: parsedFilter
        });

        const totalPages = Math.ceil(wishlists.total / itemsPerPage);

        return ApiResponse.paginate(
            wishlists.data,
            currentPage,
            itemsPerPage,
            wishlists.total,
            'All wishlists retrieved',
        );
    }
}