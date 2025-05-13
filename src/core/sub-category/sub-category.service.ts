import { SubCategoryRepository } from 'src/common/repositories/sub-category.repository';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SubCatgoryDto } from './dto/create.subCatergory.dto';
import { UpdateSubCategoryDto } from './dto/update.subCatergory.dto';
import { CategoryRepository } from 'src/common/repositories/category.repository';

@Injectable()
export class SubCategoryService {
    constructor(private readonly subCategoryRepository: SubCategoryRepository, private readonly categoryRepository: CategoryRepository) { }
    async createSubCategory(subCategoryDto: SubCatgoryDto) {
        const isSubCategoryExist = await this.subCategoryRepository.exists({ name: subCategoryDto.name })
        if (isSubCategoryExist) throw new ConflictException(`Subcatgory With Name '${subCategoryDto.name}' Is Exist`)

        const isCategoryExist = await this.categoryRepository.findById(subCategoryDto.category, { name: 1 });
        if (!isCategoryExist) throw new ConflictException(`Catgory With Name '${isCategoryExist.name}' Is Not Exist`)

        const addSubCategory = (await this.subCategoryRepository.create(subCategoryDto)).populate('category', 'name')
        return addSubCategory
    }
    async getAllSubCategories({ page, limit }: { page: number, limit: number }) {
        const { data, total } = await this.subCategoryRepository.findAll({}, {}, { page, limit })
        const populatedSubCategory = await this.subCategoryRepository.model.populate(data, { path: 'category', select: 'name', options: { lean: true } });
        return { data: populatedSubCategory, total }
    }
    async getSpecificSubCategory(id: string) {
        const subCategory = await this.subCategoryRepository.findById(id);
        if (!subCategory) throw new NotFoundException('Subcategory not found');
        const populatedSubCategory = await this.subCategoryRepository.model.populate(subCategory, { path: 'category', select: 'name', options: { lean: true } });
        return populatedSubCategory
    }
    async updateSpecificSubCategory(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
        const { name, category } = updateSubCategoryDto;

        const exist = await this.subCategoryRepository.exists({ name, _id: { $ne: id } });
        if (exist)  throw new ConflictException(`SubCategory with name '${name}' already exists.`);
        if (category) {
            const isCategoryExist = await this.categoryRepository.findById(category, { name: 1 });
            if (!isCategoryExist) throw new ConflictException(`Category with ID '${category}' does not exist.`);
        }
        const subCategory = await this.subCategoryRepository.updateById(id, updateSubCategoryDto, { new: true });
        if (!subCategory) throw new NotFoundException("Subcategory not found.");
        
        const populatedSubCategory = await this.subCategoryRepository.model.populate(subCategory, {
            path: 'category', select: 'name', options: { lean: true },
        });

        return populatedSubCategory;
    }

    async deleteSpecificSubCategory(id: string) {
        const subCategory = await this.subCategoryRepository.deleteById(id)
        if (!subCategory) throw new NotFoundException("Subcatgory Not Found")
        return
    }
}
