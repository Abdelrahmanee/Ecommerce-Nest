import {
    IsEmail,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class ResetPasswordDto {
    @MinLength(0, { message: 'The Email Must be Required' })
    @IsString({ message: 'Email must be a string' })
    @IsEmail({}, { message: 'Email is not valid' })
    email: string;

    @MinLength(6, { message: 'The Verification Code length Must be 6 characters' })
    @MaxLength(6, { message: 'The Verification Code length Must be 6 characters' })
    @IsString({ message: 'Verification Code must be a String' })
    verificationCode: string;
    
    @IsString({ message: 'Password must be a string' })
    @MinLength(3, { message: 'password must be at least 3 characters' })
    @MaxLength(20, { message: 'password must be at most 20 characters' })
    newPassword: string;
}
