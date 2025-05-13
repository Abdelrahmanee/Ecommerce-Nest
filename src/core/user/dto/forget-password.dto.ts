import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class ForgetPasswordDto {
    @IsString({ message: 'Old password must be a string' })
    @IsNotEmpty({ message: 'Old password is required' })
    @MinLength(3, { message: 'Old password must be at least 3 characters' })
    @MaxLength(20, { message: 'Old password must be at most 20 characters' })
    oldPassword: string;

    @IsString({ message: 'New password must be a string' })
    @IsNotEmpty({ message: 'New password is required' })
    @MinLength(3, { message: 'New password must be at least 3 characters' })
    @MaxLength(20, { message: 'New password must be at most 20 characters' })
    newPassword: string;
}
