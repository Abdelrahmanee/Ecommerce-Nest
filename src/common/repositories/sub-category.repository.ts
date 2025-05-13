import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from './generic.repoitory';
import { SubCategory, SubCategoryDocument } from 'src/core/sub-category/sub-category.schema';

@Injectable()
export class SubCategoryRepository extends GenericRepository<SubCategoryDocument> {
  constructor(@InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategoryDocument>) {
    super(subCategoryModel);
  }

}