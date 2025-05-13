import { IsMongoId, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateItemQuantityDto {
    @IsMongoId()
    @IsString()
    productId: string;
  
    @IsNumber()
    // @Min(0)
    quantity: number;
  
    @IsString()
    @IsOptional()
    color?: string;
  
    @IsString()
    @IsOptional()
    size?: string;
  }