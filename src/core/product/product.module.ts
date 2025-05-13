import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { Category, CategorySchema } from '../category/category.schema';
import { SubCategory, SubCategorySchema } from '../sub-category/sub-category.schema';
import { Brand, BrandSchema } from '../brand/brand.schema';
import { ProductRepository } from 'src/common/repositories/product.repository';
import { BrandRepository } from 'src/common/repositories/brand.repository';
import { SubCategoryRepository } from 'src/common/repositories/sub-category.repository';
import { CategoryRepository } from 'src/common/repositories/category.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: SubCategory.name, schema: SubCategorySchema },
      { name: Brand.name, schema: BrandSchema },
    ])
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    BrandRepository,
    SubCategoryRepository,
    CategoryRepository,
  ],
  exports: [
    ProductRepository,
    BrandRepository,
    SubCategoryRepository,
    CategoryRepository,
  ], // ✅ Export repositories if others need them
})
export class ProductModule {}
