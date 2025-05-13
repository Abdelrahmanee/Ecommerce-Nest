import { IsMongoId, IsOptional, IsString } from "class-validator";


export class RemoveItemDto {
    @IsMongoId()
    @IsString()
    productId: string;
  
    @IsString()
    @IsOptional()
    color?: string;
  
    @IsString()
    @IsOptional()
    size?: string;
  }
  