import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsMongoId, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from "class-validator";

export class UpdateCouponDto {
    @ApiProperty({ 
      description: 'Coupon name', 
      example: 'Summer Sale 2025', 
      required: false 
    })
    @IsString()
    @IsOptional()
    name?: string;
  
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
      example: 15, 
      required: false 
    })
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(100, { 
      message: 'Percentage discount cannot exceed 100%' 
    })
    @IsOptional()
    discount?: number;
  
    @ApiProperty({ 
      description: 'Type of discount', 
      enum: ['percentage', 'fixed'], 
      example: 'percentage', 
      required: false 
    })
    @IsEnum(['percentage', 'fixed'])
    @IsOptional()
    discountType?: string;
  
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
      required: false 
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
      required: false 
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
    maximumDiscountAmount?: number;
  
    @ApiProperty({ 
      description: 'Product IDs this coupon applies to', 
      type: [String], 
      required: false 
    })
    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    applicableProducts?: string[];
  
    @ApiProperty({ 
      description: 'Category IDs this coupon applies to', 
      type: [String], 
      required: false 
    })
    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    applicableCategories?: string[];
  
    @ApiProperty({ 
      description: 'User IDs this coupon is restricted to', 
      type: [String], 
      required: false 
    })
    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    restrictedToUsers?: string[];
  }
  