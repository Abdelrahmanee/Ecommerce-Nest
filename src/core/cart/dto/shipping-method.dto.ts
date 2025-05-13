import { IsEnum, ValidateNested } from "class-validator";
import { AddressDto } from "./apply-address.dto";
import { Type } from "class-transformer";

export class ShippingMethodDto {
    @IsEnum(['standard', 'express', 'nextDay', 'free'])
    shippingMethod: string;
  
    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto;
  }
  