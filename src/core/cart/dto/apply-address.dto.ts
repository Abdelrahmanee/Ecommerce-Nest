import { IsOptional, IsString } from "class-validator";


export class AddressDto {
    @IsString()
    street: string;

    @IsString()
    city: string;

    @IsString()
    state: string;

    @IsString()
    zipCode: string;

    @IsString()
    country: string;

    @IsString()
    @IsOptional()
    apartment?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;
}