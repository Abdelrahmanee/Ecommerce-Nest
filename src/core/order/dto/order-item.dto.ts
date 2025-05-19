import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsMongoId, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: '60d21b4667d0d8992e610c86'
  })
  // @IsMongoId()
  
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Nike Air Max 2023'
  })
  @IsString()
  productName: string;

  @ApiProperty({
    description: 'Original price',
    example: 299.99
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({
    description: 'Discounted price',
    example: 249.99
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  priceAfterDiscount?: number;

  @ApiProperty({
    description: 'Quantity ordered',
    example: 2
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Product color',
    example: 'black'
  })
  @IsString()
  @IsOptional()
  color?: string;
}