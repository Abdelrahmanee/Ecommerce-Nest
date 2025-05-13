import { UpdateCategoryDto } from './dto/update.catergory.dto';
import { CategoryRepository } from '../../common/repositories/category.repository';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create.catergory.dto';
import { SubCategoryRepository } from 'src/common/repositories/sub-category.repository';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository, private readonly subCategoryRepository: SubCategoryRepository) { }
    async createCategory(categoryDto: CreateCategoryDto) {
        const exist = await this.categoryRepository.exists({ name: categoryDto.name })
        if (exist) throw new ConflictException(`Catgory With Name '${categoryDto.name}' Is Exist`)
        const addCategory = (await this.categoryRepository.create(categoryDto)).toObject();
        return addCategory
    }
    async getAllCategories({ page, limit }: { page: number, limit: number }) {
        const addCategory = await this.categoryRepository.findAll({}, {}, { page, limit })
        return addCategory
    }
    async getSpecificCategory(id: string) {
        const category = await this.categoryRepository.findById(id)
        if (!category) throw new NotFoundException("Category Not Found")
        return category
    }
    async updateSpecificCategory(id: string, updateCategoryDto: UpdateCategoryDto) {

        const exist = await this.categoryRepository.exists({ name: updateCategoryDto.name })
        if (exist) throw new ConflictException(`Catgory With Name '${updateCategoryDto.name}' Is Exist`)
        const category = await this.categoryRepository.updateById(id, updateCategoryDto, { new: true })
        if (!category) throw new NotFoundException("Category Not Found")
        return category
    }
    async deleteSpecificCategoryWithAllSubCategories(id: string) {
        const session = await this.categoryRepository.startSession();
        session.startTransaction();
        try {
            const category = await this.categoryRepository.deleteById(id, { session })
            console.log(category)
            if (!category) throw new NotFoundException("Category Not Found")
            const subCategories = await this.subCategoryRepository.findAll({ category: id }, { _id: 1 }, { session })
            console.log(subCategories)
            await Promise.all(
                subCategories.data.map(async (item: { _id }) => {
                    console.log("first", item)
                    await this.subCategoryRepository.deleteById(item._id, { session })
                })
            )

            await session.commitTransaction();
            session.endSession();

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
        return;

    }
}

