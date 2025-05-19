import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, IsBoolean } from 'class-validator';
import { IsEgyptianOrSaudiPhone } from 'src/common/customValiadtors/phone.validator';

export class ShippingAddressDto {
  @ApiProperty({ description: 'First name of recipient' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name of recipient' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Primary address line' })
  @IsString()
  @IsNotEmpty()
  address1: string;

  @ApiPropertyOptional({ description: 'Secondary address line' })
  @IsString()
  @IsOptional()
  address2?: string;

  @ApiProperty({ description: 'City name' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'State/Province name' })
  @IsString()
  @IsNotEmpty()
  state: string;


  @ApiProperty({ description: 'Country name' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString({ message: 'phoneNumber must be a string' })
  @IsEgyptianOrSaudiPhone({ message: 'phoneNumber must be a valid Egyptian or Saudi phone number' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'Make the address deafult when make an order' })
  @IsBoolean()
  @IsOptional()
  isDefault: boolean

  @ApiProperty({ description: 'Address ID (auto-generated)' })
  _id: string
}