import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, DefaultValuePipe, Query, ParseIntPipe, Patch, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { ShippingAddressDto } from './dto/shipping-address.dto';
import { AuthGuard } from 'src/common/guard/Auth.guard';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { UserRoles } from 'src/common/constants/user.roles';
import { Request } from 'express';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';

@ApiTags('Shipping Addresses')
@Controller({ path: 'addresses', version: '1' })
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    @Post()
    @Roles([UserRoles.USER])
    @ApiOperation({ summary: 'Create new shipping address' })
    async createAddress(@Body() address: ShippingAddressDto, @Req() req: Request) {
        console.log(req.user._id)
        const newAddress = await this.addressService.createNewAddress(address, req.user._id);
        return ApiResponse.success(newAddress, "Added new address successfully");
    }


    @Get()
    @Roles([UserRoles.USER])
    @ApiOperation({ summary: 'Get all user addresses with pagination' })
    async getAllAddresses(
        @Req() req: Request,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
    ) {
        const allAddresses = await this.addressService.getAllUserAddresses(req.user._id, page, limit);
        return ApiResponse.success(allAddresses, "User addresses retrieved successfully");
    }

    @Get(':addressId')
    @Roles([UserRoles.USER])
    @ApiOperation({ summary: 'Get address by ID' })
    async getAddress(@Param('addressId') addressId: string, @Req() req: Request) {
        const address = await this.addressService.getAddressById(req.user._id, addressId);
        if(!address) throw new NotFoundException("Address Not Found")
        return ApiResponse.success(address, "Address Info");
    }

    @Put(':addressId')
    @Roles([UserRoles.USER])
    @ApiOperation({ summary: 'Update address' })
    async updateAddress(
        @Param('addressId') addressId: string,
        @Body() address: UpdateShippingAddressDto,
        @Req() req: Request
    ) {
        const updatedAddress = await this.addressService.updateAddressById(addressId, address , req.user._id);
        return ApiResponse.success(updatedAddress, "Updated Address");

    }

    @Delete(':addressId')
    @Roles([UserRoles.USER])
    @ApiOperation({ summary: 'Delete address' })
    async deleteAddress(@Param('addressId') addressId: string , @Req() req: Request) {
        const address = await this.addressService.deleteAddressById(addressId , req.user._id);
        return ApiResponse.success(address, "Address Deleted Successfully");

    }

    @Patch(':addressId/default')
    @Roles([UserRoles.USER])
    @ApiOperation({ summary: 'Set address as default' })
    async setDefaultAddress(@Param('addressId') addressId: string, @Req() req: Request) {
        const address = await this.addressService.setDefaultAddress(addressId, req.user._id);
        return ApiResponse.success(address, "Choose Default Address");
    }
}