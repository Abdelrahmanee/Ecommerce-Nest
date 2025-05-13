import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsPositive, 
  IsMongoId, 
  IsBoolean, 
  IsEnum, 
  IsArray, 
  Min, 
  Max, 
  ValidateIf, 
  IsDateString,
  Matches
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';

export class CreateCouponDto {
  @ApiProperty({ 
    description: 'Unique identifier', 
    required: false 
  })
  @IsOptional()
  @IsMongoId()
  _id?: Types.ObjectId;

  @ApiProperty({ 
    description: 'Unique coupon code', 
    example: 'SUMMER2025' 
  })
  @IsString()
  @Matches(/^[A-Z0-9_-]{3,20}$/, { 
    message: 'Code must be 3-20 uppercase letters, numbers, underscore or hyphen'
  })
  @Transform(({ value }) => value?.toUpperCase().trim())
  code: string;

  @ApiProperty({ 
    description: 'Coupon name', 
    example: 'Summer Sale 2025' 
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Coupon description', 
    example: '15% off on all summer items', 
    required: false 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Discount amount (percentage or fixed value)', 
    example: 15 
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @ValidateIf(o => o.discountType === 'percentage')
  @Max(100, { 
    message: 'Percentage discount cannot exceed 100%' 
  })
  discount: number;

  @ApiProperty({ 
    description: 'Type of discount', 
    enum: ['percentage', 'fixed'], 
    example: 'percentage' 
  })
  @IsEnum(['percentage', 'fixed'])
  discountType: string;

  @ApiProperty({ 
    description: 'Expiration date of the coupon', 
    example: '2025-12-31', 
    required: false 
  })
  @IsDateString({}, { message: 'expireDate must be a valid date string in the format YYYY-MM-DD', })
  @IsOptional()
  expiresAt?: Date;

  @ApiProperty({ 
    description: 'Whether the coupon is active', 
    example: true, 
    required: false, 
    default: true 
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ 
    description: 'Maximum number of times this coupon can be used', 
    example: 100, 
    required: false 
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  usageLimit?: number;

  @ApiProperty({ 
    description: 'Whether coupon can be used only once per user', 
    example: true, 
    required: false, 
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isSingleUsePerUser?: boolean;

  @ApiProperty({ 
    description: 'Minimum purchase amount required to use this coupon', 
    example: 50, 
    required: false 
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  minimumPurchase?: number;

  @ApiProperty({ 
    description: 'Maximum discount amount allowed', 
    example: 50, 
    required: false 
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ValidateIf(o => o.discountType === 'percentage')
  maximumDiscountAmount?: number;

  @ApiProperty({ 
    description: 'Product IDs this coupon applies to', 
    type: [String], 
    required: false 
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => value?.map((id: string) => new Types.ObjectId(id)))
  // @IsMongoId({ each: true })
  applicableProducts?: Types.ObjectId[];

  @ApiProperty({ 
    description: 'Category IDs this coupon applies to', 
    type: [String], 
    required: false 
  })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => value?.map((id: string) => new Types.ObjectId(id)))
  // @IsMongoId({ each: true })
  applicableCategories?: Types.ObjectId[];

  @ApiProperty({ 
    description: 'User IDs this coupon is restricted to', 
    type: [String], 
    required: false 
  })
   @IsArray()
   @IsOptional()
   @Transform(({ value }) => value?.map((id: string) => new Types.ObjectId(id)))
  //  @IsMongoId({ each: true })
  restrictedToUsers?: Types.ObjectId[]
}
