import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from './generic.repoitory';
import { Category, CategoryDocument } from 'src/core/category/category.schema';

@Injectable()
export class CategoryRepository extends GenericRepository<CategoryDocument> {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {
    super(categoryModel);
  }

}