import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BrandRepository } from 'src/common/repositories/brand.repository';
import { UpdateBrandDto } from './dto/update.brand.dto';
import { CreateBrandDto } from './dto/create.brand.dto';

@Injectable()
export class BrandService {
    constructor(private readonly brandRepository: BrandRepository) { }
    async createBrand(createBrandDto: CreateBrandDto) {
        const exist = await this.brandRepository.exists({ name: createBrandDto.name })
        if (exist) throw new ConflictException(`Brand With Name '${createBrandDto.name}' Is Exist`)
        const addBrand = (await this.brandRepository.create(createBrandDto)).toObject();
        return addBrand
    }
    async getAllBrands({ page, limit }: { page: number, limit: number }) {
        const allBrands = await this.brandRepository.findAll({}, {}, { page, limit })
        return allBrands
    }
    async getSpecificBrand(id: string) {
        const brand = await this.brandRepository.findById(id)
        if (!brand) throw new NotFoundException("Brand Not Found")
        return brand
    }
    async updateSpecificBrand(id: string, updateBrandDto: UpdateBrandDto) {
        const exist = await this.brandRepository.exists({ name: updateBrandDto.name })
        if (exist) throw new ConflictException(`Brand With Name '${updateBrandDto.name}' Is Exist`)
        const brand = await this.brandRepository.updateById(id, updateBrandDto, { new: true })
        if (!brand) throw new NotFoundException("Brand Not Found")
        return brand
    }
    async deleteSpecificBrand(id: string) {
        const brand = await this.brandRepository.deleteById(id)
        if (!brand) throw new NotFoundException("Brand Not Found")
        return
    }
}
