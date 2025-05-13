import { CreateCategoryDto } from './dto/create.catergory.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/common/guard/Auth.guard';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { UserRoles } from 'src/common/constants/user.roles';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateCategoryDto } from './dto/update.catergory.dto';

@UseGuards(AuthGuard)
@Controller({ path: "categories", version: '1' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @ApiOperation({ summary: 'Create category' })

  @Roles([UserRoles.ADMIN])
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.createCategory(createCategoryDto)
    console.log(category);

    return ApiResponse.success(category, "Category Created successfully")
  }

  @ApiOperation({ summary: 'Get all paginated categorise' })
  @Get()
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  async getAllCategories(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const { data, total } = await this.categoryService.getAllCategories({ page, limit })
    return ApiResponse.paginate(data, page || 1, limit || 10, total, "all categories")
  }

  @ApiOperation({ summary: 'Get Specific category' })
  @Get(':id')
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  async getCategory(@Param('id') id: string) {
    console.log(id);
    const category = await this.categoryService.getSpecificCategory(id)
    return ApiResponse.success(category, "Category Info")
  }

  @ApiOperation({ summary: 'Update Specific category' })
  @Put(':id')
  @Roles([UserRoles.ADMIN])
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryService.updateSpecificCategory(id, updateCategoryDto)
    return ApiResponse.success(category, "Category Info")
  }


  @ApiOperation({ summary: 'Delete Specific category' })
  @Delete(':id')
  @Roles([UserRoles.ADMIN])
  async deleteCategory(@Param('id') id: string) {
    await this.categoryService.deleteSpecificCategoryWithAllSubCategories(id)
    return ApiResponse.success({}, "Category and associated subcategories deleted successfully")
  }



}
