import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { AddItemDto } from './add-item.dto';

export class UpdateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddItemDto)
  @IsOptional()
  cartItems?: AddItemDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  appliedCouponCodes?: string[];
  
  @IsEnum(['active', 'abandoned', 'converted', 'expired'])
  @IsOptional()
  status?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
