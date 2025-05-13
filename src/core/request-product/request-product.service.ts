import { UserPayload } from 'src/common/types/express';
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { RequestProductRepository } from 'src/common/repositories/request-product.repository';
import { UserRoles } from 'src/common/constants/user.roles';

@Injectable()
export class RequestProductService {


    constructor(private readonly requestProductRepository: RequestProductRepository) { }

    async requestProduct(createRequestProductDto: CreateRequestProductDto, user: UserPayload) {
        console.log(user);
        
        const exist = await this.requestProductRepository.exists({ titleNeed: createRequestProductDto.titleNeed })
        if (exist) throw new ConflictException(`Request Product With title'${createRequestProductDto.titleNeed}' Is Exist`)
        const addRequestProduct = (await this.requestProductRepository.create({...createRequestProductDto , createdBy : user._id})).toObject();
        return addRequestProduct
    }
    async getAllrequestedProducts({ page, limit }: { page: number, limit: number }) {
        const requestProduct = await this.requestProductRepository.findAll({}, {}, { page, limit })
        return requestProduct
    }
    async getSpecificRequestedProduct(id: string, user: UserPayload) {
        const { role } = user
        if (role === UserRoles.USER) {
            const authorized = await this.requestProductRepository.findOne({ user: { _id: user._id } })
            if (!authorized) throw new UnauthorizedException("Not Unauthorized")
            return authorized
        }
        const requestProduct = await this.requestProductRepository.findById(id)
        if (!requestProduct) throw new NotFoundException("Request Product Not Found")

        return requestProduct
    }
    async updateSpecificRequestedProduct(id: string, updateRequestProductDto: UpdateRequestProductDto) {
        const exist = await this.requestProductRepository.exists({ titleNeed: updateRequestProductDto.titleNeed })
        if (exist) throw new ConflictException(`Request Product With title'${updateRequestProductDto.titleNeed}' Is Exist`)
        const requestProduct = await this.requestProductRepository.updateById(id, updateRequestProductDto, { new: true })
        if (!requestProduct) throw new NotFoundException("Request Product Not Found")
        return requestProduct
    }
    async deleteSpecificRequestedProduct(id: string) {
        const requestProduct = await this.requestProductRepository.deleteById(id)
        if (!requestProduct) throw new NotFoundException("Request Product Not Found")
        return
    }
}
