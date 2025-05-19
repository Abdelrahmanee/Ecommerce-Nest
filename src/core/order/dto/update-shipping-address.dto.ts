import { PartialType } from '@nestjs/mapped-types';
import { ShippingAddressDto } from './shipping-address.dto';

export class UpdateShippingAddressDto extends PartialType(ShippingAddressDto) {}
