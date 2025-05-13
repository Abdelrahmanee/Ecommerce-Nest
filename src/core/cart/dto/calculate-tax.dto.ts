import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { AddressDto } from "./apply-address.dto";

export class CalculateTaxDto {
    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto;
  }