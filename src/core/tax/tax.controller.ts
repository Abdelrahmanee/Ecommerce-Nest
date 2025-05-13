import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TaxService } from './tax.service';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { UserRoles } from 'src/common/constants/user.roles';
import { CreateTaxDto } from './dto/create-tax.dto';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { AuthGuard } from 'src/common/guard/Auth.guard';
@UseGuards(AuthGuard)
@Controller({path :'taxes' , version :'1'})
export class TaxController {
  constructor(private readonly taxService: TaxService) { }
   @Post()
   @ApiOperation({ summary: 'Create Tax' })
 
   @Roles([UserRoles.ADMIN])
   async createTax(@Body() createTaxDto: CreateTaxDto) {
     const tax = await this.taxService.createTax(createTaxDto)
     console.log(tax);
 
     return ApiResponse.success(tax, "Tax Created successfully")
   }
 
   @ApiOperation({ summary: 'Get all paginated categorise' })
   @Get()
   @Roles([UserRoles.ADMIN, UserRoles.USER])
   async getAllTax(
     @Query('page') page: number = 1,
     @Query('limit') limit: number = 10
   ) {
     const { data, total } = await this.taxService.getAllTaxes({ page, limit })
     return ApiResponse.paginate(data, page || 1, limit || 10, total, "All Tax")
   }
 
   @ApiOperation({ summary: 'Get Specific Tax' })
   @Get(':id')
   @Roles([UserRoles.ADMIN, UserRoles.USER])
   async getTax(@Param('id') id: string) {
     console.log(id);
     const tax = await this.taxService.getSpecificTax(id)
     return ApiResponse.success(tax, "Tax Info")
   }
 
   @ApiOperation({ summary: 'Update Specific Tax' })
   @Put(':id')
   @Roles([UserRoles.ADMIN])
   async updateTax(@Param('id') id: string, @Body() updateTaxDto: UpdateTaxDto) {
     const tax = await this.taxService.updateSpecificTax(id, updateTaxDto)
     return ApiResponse.success(tax, "Tax Info")
   }
 
 
   @ApiOperation({ summary: 'Delete Specific Tax' })
   @Delete(':id')
   @Roles([UserRoles.ADMIN])
   async deleteTax(@Param('id') id: string) {
     await this.taxService.deleteSpecificTax(id)
     return ApiResponse.success({}, "Tax deleted successfully")
   }
 
}
