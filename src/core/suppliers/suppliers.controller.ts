import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { UserRoles } from 'src/common/constants/user.roles';
import { UpdateSuppliersDto } from './dto/update-suppliers.dto';
import { CreateSuppliersDto } from './dto/create-suppliers.dto';
import { AuthGuard } from 'src/common/guard/Auth.guard';

@UseGuards(AuthGuard)
@Controller({path : 'suppliers' , version : '1'})
export class SuppliersController {
constructor(private readonly supplierService: SuppliersService) { }
  @Post()
  @ApiOperation({ summary: 'Create Supplier' })

  @Roles([UserRoles.ADMIN])
  async createSupplier(@Body() createSuppliersDto: CreateSuppliersDto) {
    const supplier = await this.supplierService.createSupplier(createSuppliersDto)
    console.log(supplier);

    return ApiResponse.success(supplier, "Supplier Created successfully")
  }

  @ApiOperation({ summary: 'Get all paginated Suppliers' })
  @Get()
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  async getAllSuppliers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const { data, total } = await this.supplierService.getAllSuppliers({ page, limit })
    return ApiResponse.paginate(data, page || 1, limit || 10, total, "All Suppliers")
  }

  @ApiOperation({ summary: 'Get Specific Supplier' })
  @Get(':id')
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  async getSupplier(@Param('id') id: string) {
    console.log(id);
    const supplier = await this.supplierService.getSpecificSupplier(id)
    return ApiResponse.success(supplier, "Supplier Info")
  }

  @ApiOperation({ summary: 'Update Specific Supplier' })
  @Put(':id')
  @Roles([UserRoles.ADMIN])
  async updateSupplier(@Param('id') id: string, @Body() updateSuppliersDto: UpdateSuppliersDto) {
    const supplier = await this.supplierService.updateSpecificSupplier(id, updateSuppliersDto)
    return ApiResponse.success(supplier, "Supplier Info")
  }


  @ApiOperation({ summary: 'Delete Specific Supplier' })
  @Delete(':id')
  @Roles([UserRoles.ADMIN])
  async deleteSupplier(@Param('id') id: string) {
    await this.supplierService.deleteSpecificSupplier(id)
    return ApiResponse.success({}, "Supplier deleted successfully")
  }
}
