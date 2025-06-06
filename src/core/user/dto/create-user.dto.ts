import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsUrl,
    Length,
    MaxLength,
    MinLength,
  } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { UserRoles } from 'src/common/constants/user.roles';
import { IsEgyptianOrSaudiPhone } from 'src/common/customValiadtors/phone.validator';

  export class CreateUserDto {
    // Name
    @IsString({ message: i18nValidationMessage('dto.IS_STRING') }) 
    @MinLength(3, { message: i18nValidationMessage('dto.MinLength') }) 
    @MaxLength(30, { message: i18nValidationMessage('dto.MaxLength') }) 
    name: string;
    // Email
    @IsString({ message: 'Email must be a string' })
    @MinLength(0, { message: 'The Email Must be Required' })
    @IsEmail({}, { message: 'Email is not valid' })
    email: string;
    // Password
    @IsString({ message: 'Password must be a string' })
    @MinLength(3, { message: 'password must be at least 3 characters' })
    @MaxLength(20, { message: 'password must be at most 20 characters' })
    password: string;
    // Role
    @IsEnum(UserRoles, { message: 'role must be user or admin' })
    @IsOptional()
    
    role: UserRoles;
    // Avatar
    @IsString({ message: 'avatar must be a string' })
    @IsUrl({}, { message: 'avatar must be a valid URL' })
    @IsOptional()
    avatar: string;
    //   Age
    @IsNumber({}, { message: 'age must be a number' })
    @IsOptional()
    age: number;
    // PhoneNumber
    @IsString({ message: 'phoneNumber must be a string' })
    @IsEgyptianOrSaudiPhone({ message: 'phoneNumber must be a valid Egyptian or Saudi phone number' })
    @IsOptional()
    phoneNumber: string;
    // Address
    @IsString({ message: 'address must be a string' })
    @IsOptional()
    address: string;
    // Active
    @IsBoolean({ message: 'active must be a boolean' })
    @IsEnum([true, false], { message: 'active must be true or false' })
    @IsOptional()
    active: boolean;
    // VerificationCode
    @IsString({ message: 'verificationCode must be a string' })
    @IsOptional()
    @Length(6, 6, { message: 'verificationCode must be 6 characters' })
    verificationCode: string;
    // Gender
    @IsEnum(['male', 'female'], { message: 'gender must be male or female' })
    @IsOptional()
    gender: string;
  }
  