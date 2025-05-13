import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/common/guard/Auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { UserRoles } from 'src/common/constants/user.roles';
import { Request } from 'express';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemQuantityDto } from './dto/update-quntity.dto';
import { RemoveItemDto } from './dto/remove-item.dto';

@ApiTags('Carts')
@UseGuards(AuthGuard)
@Controller({ path: 'carts', version: '1' })
export class CartController {
  constructor(private readonly cartService: CartService) {
  }

  @Get()
  @ApiOperation({ summary: 'Create / Get Cart' })
  @ApiBearerAuth()
  @Roles([UserRoles.USER])
  async getCart(@Req() request: Request) {
    const userId = request.user._id
    const cart = this.cartService.getOrCreateCart(userId);
    ApiResponse.success(cart, "Available Coupons");
  }
  @Post("add-item")
  @ApiOperation({ summary: 'Create Coupon' })
  @ApiBearerAuth()
  @Roles([UserRoles.USER])
  async addItem(@Req() request: Request , @Body() item: AddItemDto) {
    const userId = request.user._id
    const cart = this.cartService.addItem(userId , item);
    ApiResponse.success(cart, "Item Added Successfully");
  }
  // ______________________________________________________
  @Patch("update-item-quantity")
  @ApiOperation({ summary: 'Update Item Quantity' })
  @ApiBearerAuth()
  @Roles([UserRoles.USER])
  async updateItemQuantity(@Req() request: Request , @Body() item: UpdateItemQuantityDto) {
    const userId = request.user._id
    const cart = this.cartService.updateItemQuantity(userId, item ,  item.color ,item.size );
    ApiResponse.success(cart, "Item Added Successfully");
  }
  // ______________________________________________________
  @Delete("remove-item")
  @ApiOperation({ summary: 'Remove Item' })
  @ApiBearerAuth()
  @Roles([UserRoles.USER])
  async removeItem(@Req() request: Request , @Body() item: RemoveItemDto) {
    const userId = request.user._id
    const cart = await this.cartService.removeItem(userId, item.productId ,  item.color ,item.size );
    ApiResponse.success(cart, "Item Removed Successfully");
  }
  // ______________________________________________________
  @Delete("clear")
  @ApiOperation({ summary: 'Clear Cart' })
  @ApiBearerAuth()
  @Roles([UserRoles.USER])
  async clearCart(@Req() request: Request) {
    const userId = request.user._id
    const cart = this.cartService.clearCart(userId );
    ApiResponse.success(cart, "Cart is Cleared");
  }

}
