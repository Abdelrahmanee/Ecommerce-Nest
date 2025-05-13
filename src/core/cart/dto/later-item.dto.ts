import { IsMongoId, IsOptional, IsString } from "class-validator";

export class SaveForLaterDto {
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