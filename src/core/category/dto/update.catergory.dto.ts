import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create.catergory.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
