import { IsString, IsNumber, IsArray, IsOptional, IsNotEmpty, Min, Max, Length, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100, { message: 'Title must be between 3 and 100 characters' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(20, 1000, { message: 'Description must be between 20 and 1000 characters' })
  description: string;

  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @IsString()
  @IsNotEmpty()
  imageCover: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsNumber()
  @IsOptional()
  sold?: number;

  @IsNumber()
  @Min(1, { message: 'Price must be at least 1 L.E' })
  @Max(20000, { message: 'Price cannot exceed 20000 L.E' })
  price: number;

  @IsNumber()
  @IsOptional()
  @Max(20000, { message: 'Price after discount cannot exceed 20000 L.E' })
  priceAfterDiscount?: number;

  @IsArray()
  @IsOptional()
  colors?: string[];

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  subCategory?: string;

  @IsString()
  @IsOptional()
  brand?: string;
  
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}