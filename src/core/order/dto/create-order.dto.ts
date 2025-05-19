import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {  OrderItemDto } from './order-item.dto';
import { ShippingAddressDto } from './shipping-address.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Array of cart items to be ordered',
    type: [OrderItemDto]
  })
  @IsNotEmpty()
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @ApiPropertyOptional({
    description: 'Coupon ID if applicable',
    example: '60d21b4667d0d8992e610c86'
  })
  @IsOptional()
  @IsString()
  couponId?: string;

  @ApiPropertyOptional({
    description: 'Payment method type',
    example: 'cash',
    enum: ['cash', 'card'],
    default: 'cash'
  })
  @IsOptional()
  @IsString()
  paymentMethodType?: string;

  @ApiProperty({
    description: 'Shipping address details'
  })
  @IsNotEmpty()
  shippingAddress: ShippingAddressDto;
}