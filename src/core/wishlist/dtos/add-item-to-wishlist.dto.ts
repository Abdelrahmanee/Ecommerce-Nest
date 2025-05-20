import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class AddProductDto {
    @ApiProperty({
      description: 'ID of the product to add',
      example: '60d5ec9af682fbd12a0dcd4e'
    })
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    productId: string;
  

    @ApiPropertyOptional({
      description: 'Priority level for the product (1-5, 5 being highest)',
      example: 3,
      minimum: 1,
      maximum: 5
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    priority?: number;
  
   
    @ApiPropertyOptional({
      description: 'Note for the product',
      example: 'Would like this in blue if possible'
    })
    @IsOptional()
    @IsString()
    note?: string;
  }