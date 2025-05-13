import { PartialType } from '@nestjs/mapped-types';
import { SubCatgoryDto } from './create.subCatergory.dto';

export class UpdateSubCategoryDto extends PartialType(SubCatgoryDto) {}
