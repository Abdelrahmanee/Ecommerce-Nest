
import { Controller, Post, Req, UseGuards, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/common/guard/Auth.guard';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { UserRoles } from 'src/common/constants/user.roles';
import { ShippingAddressDto } from './dto/shipping-address.dto';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
    
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @Roles([UserRoles.USER])
  @ApiCreatedResponse({ description: 'The order has been successfully created.' })
  async createOrder(@Body('shippingAddress') shippingAddress: ShippingAddressDto, @Req() req: Request ,@Body('couponCode') couponCode?: string) {
    const userId = req.user._id;
    return this.orderService.createCashOrder( userId , couponCode,  shippingAddress ) ;
  }
  
}