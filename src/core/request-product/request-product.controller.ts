import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { AuthGuard } from 'src/common/guard/Auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { UserRoles } from 'src/common/constants/user.roles';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { UserPayload } from 'src/common/types/express';
import { Request } from 'express';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller({path : 'request-product' , version : '1'})
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}

   @Post()
    @ApiOperation({ summary: 'Request Product Service' })
    @Roles([UserRoles.USER])
    async requestProduct(@Body() createRequestProductDto: CreateRequestProductDto ,  @Req() req: Request) {
      console.log(req);
      
      const requestProduct = await this.requestProductService.requestProduct(createRequestProductDto , req.user )
      console.log(requestProduct);
  
      return ApiResponse.success( "Request Product Created successfully")
    }
  
    @ApiOperation({ summary: 'Get all paginated RequestedProduct' })
    @Get()
    @Roles([UserRoles.ADMIN])
    async getAllBrands(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10
    ) {
      const { data, total } = await this.requestProductService.getAllrequestedProducts({ page, limit })
      return ApiResponse.paginate(data, page || 1, limit || 10, total, "All Requested Products")
    }
  
    // @ApiOperation({ summary: 'Get Specific Requested Product' })
    // @Get(':id')
    // @Roles([UserRoles.ADMIN, UserRoles.USER])
    // async getRequestedProduct(@Param('id') id: string ,  req : Request ) {
    //   console.log(id);
    //   const brand = await this.requestProductService.getSpecificRequestedProduct(id , req.user) 
    //   return ApiResponse.success(brand, "RequestedProduct Info")
    // }
  
    @ApiOperation({ summary: 'Update Specific Requested Product' })
    @Put(':id')
    @Roles([UserRoles.ADMIN])
    async updateRequestedProduct(@Param('id') id: string, @Body() updateBrandDto: UpdateRequestProductDto) {
      const brand = await this.requestProductService.updateSpecificRequestedProduct(id, updateBrandDto)
      return ApiResponse.success(brand, "RequestedProduct Info")
    }
  
  
    @ApiOperation({ summary: 'Delete Specific Requested Product' })
    @Delete(':id')
    @Roles([UserRoles.ADMIN])
    async deleteRequestedProduct(@Param('id') id: string) {
      await this.requestProductService.deleteSpecificRequestedProduct(id)
      return ApiResponse.success({}, "RequestedProduct deleted successfully")
    }
  
}
