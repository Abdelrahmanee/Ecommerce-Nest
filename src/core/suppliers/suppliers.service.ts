import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SuppliersRepository } from 'src/common/repositories/supplier.repository';
import { CreateSuppliersDto } from './dto/create-suppliers.dto';
import { UpdateSuppliersDto } from './dto/update-suppliers.dto';

@Injectable()
export class SuppliersService {

     constructor(private readonly supplierRepository: SuppliersRepository) { }
        async createSupplier(createSuppliersDto: CreateSuppliersDto) {
            const exist = await this.supplierRepository.exists({ name: createSuppliersDto.name })
            if (exist) throw new ConflictException(`Supplier With Name '${createSuppliersDto.name}' Is Exist`)
            const addSupplier = (await this.supplierRepository.create(createSuppliersDto)).toObject();
            return addSupplier
        }
        async getAllSuppliers({ page, limit }: { page: number, limit: number }) {
            const allSuppliers = await this.supplierRepository.findAll({}, {}, { page, limit })
            return allSuppliers
        }
        async getSpecificSupplier(id: string) {
            const supplier = await this.supplierRepository.findById(id)
            if (!supplier) throw new NotFoundException("Supplier Not Found")
            return supplier
        }
        async updateSpecificSupplier(id: string, updateSuppliersDto: UpdateSuppliersDto) {
            const exist = await this.supplierRepository.exists({ name: updateSuppliersDto.name })
            if (exist) throw new ConflictException(`Supplier With Name '${updateSuppliersDto.name}' Is Exist`)
            const supplier = await this.supplierRepository.updateById(id, updateSuppliersDto, { new: true })
            if (!supplier) throw new NotFoundException("Supplier Not Found")
            return supplier
        }
        async deleteSpecificSupplier(id: string) {
            const supplier = await this.supplierRepository.deleteById(id)
            if (!supplier) throw new NotFoundException("Supplier Not Found")
            return
        }
}
