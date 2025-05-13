import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategory, SubCategorySchema } from './sub-category.schema';
import { SubCategoryRepository } from 'src/common/repositories/sub-category.repository';
import { SubCategoryController } from './sub-category.controller';
import { CategoryRepository } from 'src/common/repositories/category.repository';
import { Category, CategorySchema } from 'src/core/category/category.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: SubCategory.name, schema: SubCategorySchema } , { name: Category.name, schema: CategorySchema }])],

  controllers: [SubCategoryController],
  providers: [SubCategoryService , SubCategoryRepository , CategoryRepository],
})
export class SubCategoryModule { }
