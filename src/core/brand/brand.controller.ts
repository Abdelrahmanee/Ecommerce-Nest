import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { AuthGuard } from 'src/common/guard/Auth.guard';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { UserRoles } from 'src/common/constants/user.roles';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { UpdateBrandDto } from './dto/update.brand.dto';
import { CreateBrandDto } from './dto/create.brand.dto';

@UseGuards(AuthGuard)
@Controller({ path: "brands", version: '1' })

export class BrandController {
  constructor(private readonly brandService: BrandService) { }
  @Post()
  @ApiOperation({ summary: 'Create Brand' })

  @Roles([UserRoles.ADMIN])
  async createBrand(@Body() createBrandDto: CreateBrandDto) {
    const brand = await this.brandService.createBrand(createBrandDto)
    console.log(brand);

    return ApiResponse.success(brand, "Brand Created successfully")
  }

  @ApiOperation({ summary: 'Get all paginated Brands' })
  @Get()
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  async getAllBrands(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const { data, total } = await this.brandService.getAllBrands({ page, limit })
    return ApiResponse.paginate(data, page || 1, limit || 10, total, "All Brands")
  }

  @ApiOperation({ summary: 'Get Specific Brand' })
  @Get(':id')
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  async getBrand(@Param('id') id: string) {
    console.log(id);
    const brand = await this.brandService.getSpecificBrand(id)
    return ApiResponse.success(brand, "Brand Info")
  }

  @ApiOperation({ summary: 'Update Specific Brand' })
  @Put(':id')
  @Roles([UserRoles.ADMIN])
  async updateBrand(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandService.updateSpecificBrand(id, updateBrandDto)
    return ApiResponse.success(brand, "Brand Info")
  }


  @ApiOperation({ summary: 'Delete Specific Brand' })
  @Delete(':id')
  @Roles([UserRoles.ADMIN])
  async deleteBrand(@Param('id') id: string) {
    await this.brandService.deleteSpecificBrand(id)
    return ApiResponse.success({}, "Brand deleted successfully")
  }


}
