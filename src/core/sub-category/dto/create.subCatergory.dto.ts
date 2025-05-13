import { IsMongoId, IsString, MaxLength, MinLength } from 'class-validator';

export class SubCatgoryDto {
  @IsString({ message: 'name must be a string' })
  @MinLength(2, { message: 'name must be at least 2 characters' })
  @MaxLength(30, { message: 'name must be at most 30 characters' })
  name: string;

  @IsString({ message: 'category must be a string' })
  @IsMongoId({ message: 'category must be a valid mongo id' })
  category: string;
}
