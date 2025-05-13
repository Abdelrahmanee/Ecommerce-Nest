import {
    IsEmail,
    IsString,
    MinLength,
} from 'class-validator';

export class SendVerifivationCode {
    @MinLength(0, { message: 'The Email Must be Required' })
    @IsString({ message: 'Email must be a string' })
    @IsEmail({}, { message: 'Email is not valid' })
    email: string;
}
