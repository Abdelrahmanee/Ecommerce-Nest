import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateBrandDto {
    @IsString({ message: 'name must be a string' })
    @MinLength(2, { message: 'name must be at least 2 characters' })
    @MaxLength(30, { message: 'name must be at most 30 characters' })
    @IsNotEmpty({ message: "name is required" })
    name: string;

    @IsString({ message: 'image must be a string' })
    @IsUrl({}, { message: 'image must be a valid URL' })
    @IsOptional()
    image: string;
}
