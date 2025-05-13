import { IsMongoId, IsNumber, IsObject, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class AddItemDto {
    @IsMongoId()
    @IsString()
    productId: string;
  
    @IsNumber()
    @IsPositive()
    @Min(1)
    quantity: number;
  
    @IsString()
    @IsOptional()
    color?: string;
  
    @IsString()
    @IsOptional()
    size?: string;
  
    @IsObject()
    @IsOptional()
    customizations?: Record<string, any>;
  }
  