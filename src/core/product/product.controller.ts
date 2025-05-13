import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Req, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/common/guard/Auth.guard';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { UserRoles } from 'src/common/constants/user.roles';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiAcceptedResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller({ path: 'products', version: '1' })
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @ApiOperation({ summary: 'Add New Product' })
  @ApiBody({ type: CreateProductDto })
  @HttpCode(HttpStatus.CREATED)
  @Roles([UserRoles.ADMIN])
  @Post()
  async addNewProduct(@Body() createProductDto: CreateProductDto, @Req() request: Request) {
    const userContext = {
      userId: request.user._id,
      userName: request.user.name,
      request
    };

    const addedProduct = await this.productService.addNewProduct(createProductDto, userContext);
    return ApiResponse.success(addedProduct, "Product Added Successfully");
  }

  @ApiOperation({ summary: 'Get All Products' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean, description: 'Include inactive products' })
  @ApiQuery({ name: 'populate', required: false, type: [String], description: 'Fields to populate (e.g. categoryRef,brandRef)' })
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  @Get('')
  // async getAllProducts(
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 10,
  //   @Query('includeInactive') includeInactive: boolean = false,
  //   @Query('populate') populate: string = '',
  // ) {
  //   const populateArray = populate ? populate.split(',') : [];
  //   const { data, total } = await this.productService.getAllProducts({
  //     page,
  //     limit,
  //     includeInactive,
  //     populate: populateArray
  //   });

  //   return ApiResponse.paginate(data, page, limit, total, "All Products");
  // }

  @ApiOperation({ summary: 'Get Product Info' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiQuery({ name: 'populate', required: false, type: String, description: 'Fields to populate (e.g. categoryRef,brandRef)' })
  @Roles([UserRoles.ADMIN, UserRoles.USER])
  @Get(':id')
  async getSpecificProduct(
    @Param('id') id: string,
    @Query('populate') populate: string = '',
  ) {
    const populateArray = populate ? populate.split(',') : [];
    const product = await this.productService.getSpecificProduct(id, { populate: populateArray });
    return ApiResponse.success(product, "Product Info");
  }

  @ApiOperation({ summary: 'Update Specific Product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @Roles([UserRoles.ADMIN])
  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() request: Request
  ) {
    const userContext = {
      userId: request.user._id,
      userName: request.user.name,
      request
    };

    const product = await this.productService.updateSpecificProduct(id, updateProductDto, userContext);
    return ApiResponse.success(product, "Product Updated Successfully");
  }

  @ApiOperation({ summary: 'Soft Delete Product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @HttpCode(HttpStatus.OK)
  @Roles([UserRoles.ADMIN])
  @Delete(':id')
  async deleteProduct(
    @Param('id') id: string,
    @Req() request: Request
  ) {
    const userContext = {
      userId: request.user._id,
      userName: request.user.name,
      request
    };

    const message = await this.productService.deleteSpecificProduct(id, userContext, false);
    console.log(message)
    return ApiResponse.success(message, "Product deleted successfully")
  }

  @ApiOperation({ summary: 'Hard Delete Product (Permanent)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @HttpCode(HttpStatus.OK)
  @Roles([UserRoles.ADMIN])
  @Delete(':id/permanent')
  async permanentlyDeleteProduct(
    @Param('id') id: string,
    @Req() request: Request
  ) {
    const userContext = {
      userId: request.user._id,
      userName: request.user.name,
      request
    };
    await this.productService.deleteSpecificProduct(id, userContext, true);
    return ApiResponse.success(null, "Product permanently deleted");
  }

  @ApiOperation({ summary: 'Restore Deleted Product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @Roles([UserRoles.ADMIN])
  @Patch(':id/restore')
  async restoreProduct(
    @Param('id') id: string,
    @Req() request: Request
  ) {
    const userContext = {
      userId: request.user._id,
      userName: request.user.name,
      request
    };

    const restoredProduct = await this.productService.restoreProduct(id, userContext);
    return ApiResponse.success(restoredProduct, "Product restored successfully");
  }

  @ApiOperation({ summary: 'Get Product Audit History' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @Roles([UserRoles.ADMIN])
  @Get(':id/audit-history')
  async getProductAuditHistory(@Param('id') id: string) {
    const auditLogs = await this.productService.getProductAuditHistory(id);
    return ApiResponse.success(auditLogs, "Product audit history");
  }
}