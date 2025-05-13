import { TaxRepository } from '../../common/repositories/tax.repository';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';

@Injectable()
export class TaxService {

    constructor(private readonly taxRepository: TaxRepository) { }
    async createTax(createtaxDto: CreateTaxDto) {
        const existingTax = await this.taxRepository.findOne({ name: createtaxDto.name });
        if (existingTax) {
            throw new ConflictException('Tax with this name already exists');
        }
        const addtax = await this.taxRepository.create(createtaxDto);
        return addtax;
    }
    async getAllTaxes({ page, limit }: { page: number, limit: number }) {
        const allTaxes = await this.taxRepository.findAll({}, {}, { page, limit })
        return allTaxes
    }
    async getSpecificTax(id: string) {
        const tax = await this.taxRepository.findById(id)
        if (!tax) throw new NotFoundException("Tax Not Found")
        return tax
    }
    async updateSpecificTax(id: string, updateTaxDto: UpdateTaxDto) {
        const tax = await this.taxRepository.updateById(id, updateTaxDto, { new: true })
        if (!tax) throw new NotFoundException("Tax Not Found")
        return tax
    }
    async deleteSpecificTax(id: string) {
        const tax = await this.taxRepository.deleteById(id)
        if (!tax) throw new NotFoundException("Tax Not Found")
        return
    }
}
