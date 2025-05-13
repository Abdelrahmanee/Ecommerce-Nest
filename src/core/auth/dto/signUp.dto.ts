import {
    IsEmail,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SignUpDto {
    // Name
    // @IsString({ message: i18nValidationMessage('dto.IS_STRING') })
    // @MinLength(3, { message: i18nValidationMessage('dto.MinLength') })
    // @MaxLength(30, { message: i18nValidationMessage('dto.MaxLength') })
    @IsString({ message: 'Name must be a string' })
    @MinLength(0, { message: 'The Name Must be Required' })
    @MaxLength(200, { message: 'Name must be at most 200 characters' })
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


}
