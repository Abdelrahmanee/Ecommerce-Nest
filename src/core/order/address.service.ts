import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './../../common/repositories/order.repository';
import { ShippingAddressDto } from './dto/shipping-address.dto';
import { UserRepository } from 'src/common/repositories/user.repository';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';


@Injectable()
export class AddressService {

    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly userRepository: UserRepository,
        private readonly userService: UserService,

    ) { }

    async createNewAddress(address: ShippingAddressDto, userId: string) {
        console.log(userId)
        const user = await this.userService.getMyInfoById(userId);
        console.log(user)
        if (!user) throw new NotFoundException('User not found');
        if (!user?.shippingAddress) user.shippingAddress = [];

        if (!Array.isArray(user.shippingAddress)) user.shippingAddress = [];

        const newAddress = {
            ...address,
            isDefault: user.shippingAddress.length === 0
        };

        if (newAddress.isDefault) {
            user.shippingAddress.forEach((addr) => (addr.isDefault = false));
        }

        user.shippingAddress.push(newAddress);
        await user.save();

        return user.shippingAddress.at(-1);
    }
    async getAllUserAddresses(userId: string, page: number = 1, limit: number = 10) {
        const userAddresses = await this.userService.getMyInfoById(userId);
        if (!userAddresses) throw new NotFoundException('User not found');
        if (!userAddresses.shippingAddress) return { data: [], total: 0, page, limit };

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = userAddresses.shippingAddress.length;

        const paginatedAddresses = userAddresses.shippingAddress.slice(startIndex, endIndex);

        return { data: paginatedAddresses, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getAddressById(userId: string, addressId: string) {
        const userAddresses = await this.userRepository.findById(userId);
        if (!userAddresses) throw new NotFoundException('User not found');

        const address = userAddresses.shippingAddress.find(
            (address) => address._id.toString() === addressId
        );
        if (!address) throw new NotFoundException('Address not found');

        return address;
    }

    async deleteAddressById(addressId: string, userId: string) {
        const userAddresses = await this.userRepository.findById(userId, { shippingAddress: 1 }, { lean: false });
        if (!userAddresses) throw new NotFoundException("User Addresses Not Found")
        const addressIndex = userAddresses.shippingAddress.findIndex(addr => addr._id.toString() === addressId);
        if (addressIndex === -1) throw new NotFoundException('Address not found');

        userAddresses.shippingAddress.splice(addressIndex, 1)
        await userAddresses.save()
        return
    }



    async updateAddressById(addressId: string, address: UpdateShippingAddressDto, userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        const existingAddress = user.shippingAddress.find(addr => addr._id.toString() === addressId);
        if (!existingAddress) throw new NotFoundException('Address not found');

        const updatedAddress = {
            ...existingAddress,
            ...Object.entries(address).reduce((acc, [key, value]) => {
                if (value !== undefined) acc[key] = value;
                return acc;
            }, {}),
            _id: addressId
        };

        const result = await this.userRepository.update(
            { _id: userId, 'shippingAddress._id': addressId },
            { $set: { 'shippingAddress.$': updatedAddress } },
            { new: true }
        );

        return result.shippingAddress.find(addr => addr._id.toString() === addressId);
    }
    async setDefaultAddress(addressId: string, userId: string) {
        const userAddresses = await this.userRepository.findById(userId, {}, { lean: false });
        if (!userAddresses) throw new NotFoundException('User not found');

        const addressIndex = userAddresses.shippingAddress.findIndex(addr => addr._id.toString() === addressId);
        if (addressIndex === -1) throw new NotFoundException('Address not found');

        if (userAddresses.shippingAddress[addressIndex].isDefault)
            throw new BadRequestException("Address Already Set As Default")
        userAddresses.shippingAddress.forEach(addr => addr.isDefault = false);

        userAddresses.shippingAddress[addressIndex].isDefault = true;
        await userAddresses.save();

        return userAddresses.shippingAddress[addressIndex];
    }
}