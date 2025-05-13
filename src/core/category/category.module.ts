import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from 'src/common/repositories/category.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './category.schema';
import { SubCategoryRepository } from 'src/common/repositories/sub-category.repository';
import { SubCategory, SubCategorySchema } from 'src/core/sub-category/sub-category.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema } , { name: SubCategory.name, schema: SubCategorySchema }])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository , SubCategoryRepository],
})
export class CategoryModule { }
