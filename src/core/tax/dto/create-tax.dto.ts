import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaxDto {
  @IsNumber({}, { message: 'taxPrice must be a number' })
  @IsOptional()
  taxPrice: string;
  @IsString()
  name: string;
  @IsNumber({}, { message: 'shippingPrice must be a number' })
  @IsOptional()
  shippingPrice: string;
}
