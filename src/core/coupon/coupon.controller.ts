import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { UserRoles } from 'src/common/constants/user.roles';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { AuthGuard } from 'src/common/guard/Auth.guard';
import { CouponCodeDto } from './dto/coupon-code.dto';
import { User } from '../user/user.schema';
import { Request } from 'express';


@ApiTags('Coupons')
@UseGuards(AuthGuard) 
@Controller({ path: 'coupons', version: '1' })
export class CouponController {
  constructor(private readonly couponService: CouponService) { }

  @Post()
  @ApiOperation({ summary: 'Create Coupon' })
  @ApiBearerAuth()
  @Roles([UserRoles.ADMIN])
  async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    const coupon = await this.couponService.createCoupon(createCouponDto);
    return ApiResponse.success(coupon, "Coupon created successfully");
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate Coupon Code' })
  @Post('validate-coupon')
  @Roles([UserRoles.USER])
  @ApiBody({ type: CouponCodeDto })
  async validateCoupon(@Body() applyCouponDto: CouponCodeDto, @Req() req: Request) {
    console.log("couppon")
    
    try {
      const userId = req.user._id;
      console.log(userId)
      console.log(applyCouponDto)
      const coupon = await this.couponService.validateCoupon(applyCouponDto, userId);

      const cart = await this.couponService.getUserCart(userId);
      const discountAmount = this.couponService.calculateDiscountAmount(coupon, cart.totalPrice);

      return ApiResponse.success({
        coupon,
        discountAmount,
        newTotal: cart.totalPrice - discountAmount
      }, "Valid coupon");
    } catch (error) {
      throw new BadRequestException(error.message || 'Invalid coupon');
    }
  }


  @ApiOperation({ summary: 'Get All Paginated Coupons' })
  @Get()
  @ApiBearerAuth()

  @Roles([UserRoles.ADMIN])
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAllCoupons(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const { data, total } = await this.couponService.getAllCoupons({ page, limit });
    return ApiResponse.paginate(data, page || 1, limit || 10, total, "All Coupons");
  }

  @ApiOperation({ summary: 'Get Coupons By Status' })
  @Get('status/:isActive')
  @ApiBearerAuth()
  @ApiParam({ name: 'isActive', enum: ['active', 'inactive'], type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Roles([UserRoles.ADMIN])
  async getCouponsByStatus(
    @Param('isActive') isActive: boolean,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const { data, total } = await this.couponService.getCouponsByStatus(isActive, { page, limit });
    const message = isActive ? "Active Coupons" : "InActive Coupons";
    return ApiResponse.paginate(data, page || 1, limit || 10, total, message);
  }

  @ApiOperation({ summary: 'Get Coupons Available For Current User' })
  @Get('user/available')
  @Roles([UserRoles.USER, UserRoles.ADMIN])
  @ApiBearerAuth()

  async getUserAvailableCoupons(@Req() request: Request) {
    const userId = request.user._id;
    const coupons = await this.couponService.getUserApplicableCoupons(userId);
    return ApiResponse.success(coupons, "Available Coupons");
  }
  @ApiOperation({ summary: 'Get Coupon By Code' })
  @Get('code')
  @ApiBearerAuth()
  @Roles([UserRoles.ADMIN])
  @ApiBody({ type: CouponCodeDto })
  async getCouponByCode(@Body('code') code: CouponCodeDto) {
    try {
      console.log(code)
      const coupon = await this.couponService.findByCode(code);

      return ApiResponse.success(coupon, "Coupon Info");
    } catch (error) {
      throw new BadRequestException('Invalid coupon code');
    }
  }

  @ApiOperation({ summary: 'Get Usage Statistics For All Coupons' })
  @Get('stats/usage')
  @ApiBearerAuth()
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date in YYYY-MM-DD format' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date in YYYY-MM-DD format' })
  @Roles([UserRoles.ADMIN])
  async getCouponUsageStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    try {
      const start = startDate ? new Date(startDate + 'T00:00:00Z') : undefined;
      const end = endDate ? new Date(endDate + 'T23:59:59Z') : undefined;
      if (startDate && isNaN(start.getTime())) {
        throw new BadRequestException('Invalid start date format. Use YYYY-MM-DD');
      }
      if (endDate && isNaN(end.getTime())) {
        throw new BadRequestException('Invalid end date format. Use YYYY-MM-DD');
      }
      const stats = await this.couponService.getCouponUsageStatistics(start, end);
      return ApiResponse.success(stats, "Coupon Usage Statistics");
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error processing date range');
    }
  }

  @ApiOperation({ summary: 'Get Detailed Statistics For All Coupons' })
  @Get('stats/detailed')
  @ApiBearerAuth()
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date in YYYY-MM-DD format' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date in YYYY-MM-DD format' })
  @Roles([UserRoles.ADMIN])
  async getAllCouponsDetailedStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    try {
      const start = startDate ? new Date(startDate + 'T00:00:00Z') : undefined;
      const end = endDate ? new Date(endDate + 'T23:59:59Z') : undefined;

      if (startDate && isNaN(start.getTime())) {
        throw new BadRequestException('Invalid start date format. Use YYYY-MM-DD');
      }
      if (endDate && isNaN(end.getTime())) {
        throw new BadRequestException('Invalid end date format. Use YYYY-MM-DD');
      }

      const stats = await this.couponService.getAllCouponsDetailedStats(start, end);
      return ApiResponse.success(stats, "Detailed Coupon Statistics");
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error processing date range');
    }
  }


  @ApiOperation({ summary: 'Get Usage Statistics For All Coupons' })
  @Get('stats/weekly/usage/:couponId')
  @ApiBearerAuth()
  @ApiParam({ name: 'couponId', type: String })
  @Roles([UserRoles.ADMIN])
  async getWeeklyCouponUsageStats(
    @Param('couponId') couponId: string,
  ) {
    const stats = await this.couponService.getWeeklyCouponUsageStats(couponId);
    return ApiResponse.success(stats, "Coupon Usage Statistics");
  }


  @ApiOperation({ summary: 'Get Specific Coupon' })
  @Get(':id')
  @ApiBearerAuth()

  @Roles([UserRoles.ADMIN])
  @ApiParam({ name: 'id', type: String })
  async getCoupon(@Param('id') id: string) {
    const coupon = await this.couponService.getSpecificCoupon(id);
    return ApiResponse.success(coupon, "Coupon Info");
  }

  @ApiOperation({ summary: 'Update Specific Coupon' })
  @Put(':id')
  @ApiBearerAuth()

  @Roles([UserRoles.ADMIN])
  @ApiParam({ name: 'id', type: String })
  async updateCoupon(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    const coupon = await this.couponService.updateCoupon(id, updateCouponDto);
    return ApiResponse.success(coupon, "Coupon Updated Successfully");
  }

  @ApiOperation({ summary: 'Delete Specific Coupon' })
  @Delete(':id')
  @ApiBearerAuth()

  @Roles([UserRoles.ADMIN])
  @ApiParam({ name: 'id', type: String })
  async deleteCoupon(@Param('id') id: string) {
    await this.couponService.deleteCoupon(id);
    return ApiResponse.success({}, "Coupon deleted successfully");
  }





  @ApiOperation({ summary: 'Deactivate Coupon' })
  @Put(':id/deactivate')
  @ApiBearerAuth()

  @Roles([UserRoles.ADMIN])
  @ApiParam({ name: 'id', type: String })
  async deactivateCoupon(@Param('id') id: string) {
    const coupon = await this.couponService.toggelCouponActivation(id);
    return ApiResponse.success(coupon, "Coupon deactivated successfully");
  }





}