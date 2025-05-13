import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class SignUpDto {
    // Name
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' }) // Better than @MinLength(0)
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(30, { message: 'Name must be at most 30 characters' })
    name: string;

    // Email
    @IsEmail({}, { message: 'Email is not valid' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    // Password
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' }) // Recommended for security
    @MaxLength(20, { message: 'Password must be at most 20 characters' })
    password: string;
    
}