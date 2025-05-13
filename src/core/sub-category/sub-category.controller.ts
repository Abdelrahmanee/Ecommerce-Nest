import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guard/Auth.guard';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { UserRoles } from 'src/common/constants/user.roles';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { SubCategoryService } from './sub-category.service';
import { SubCatgoryDto } from './dto/create.subCatergory.dto';
import { UpdateSubCategoryDto } from './dto/update.subCatergory.dto';

@UseGuards(AuthGuard)
@Controller({ path: "sub-categories", version: '1' })
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService  ) { }

  @Post()
  @ApiOperation({ summary: 'Create SubCategory' })

  @Roles([UserRoles.ADMIN])
  async createSubCategory(@Body() createSubCategoryDto: SubCatgoryDto) {
    const subCategory = await this.subCategoryService.createSubCategory(createSubCategoryDto)
    return ApiResponse.success(subCategory, "SubCategory Created successfully")
  }

  @ApiOperation({ summary: 'Get all paginated SubCategories' })
  @Get()
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  async getAllSubCategories(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const { data, total } = await this.subCategoryService.getAllSubCategories({ page, limit })
    return ApiResponse.paginate(data, page || 1, limit || 10, total, "All SubCategories")
  }

  @ApiOperation({ summary: 'Get Specific SubCategory' })
  @Get(':id')
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  async getSubCategory(@Param('id') id: string) {
    console.log(id);
    const category = await this.subCategoryService.getSpecificSubCategory(id)
    return ApiResponse.success(category, "SubCategory Info")
  }

  @ApiOperation({ summary: 'Update Specific SubCategory' })
  @Put(':id')
  @Roles([UserRoles.ADMIN])
  async updateSubCategory(@Param('id') id: string, @Body() updateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryService.updateSpecificSubCategory(id, updateSubCategoryDto)
    return ApiResponse.success(subCategory, "SubCategory Info")
  }


  @ApiOperation({ summary: 'Delete Specific SubCategory' })
  @Delete(':id')
  @Roles([UserRoles.ADMIN])
  async deleteSubCategory(@Param('id') id: string) {
    await this.subCategoryService.deleteSpecificSubCategory(id)
    return ApiResponse.success({}, "SubCategory Deleted Successfully")
  }



}
