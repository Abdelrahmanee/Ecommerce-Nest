import { Body, Controller, Get, Patch, Put, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiOperation } from "@nestjs/swagger";
import { Roles } from "src/common/decoretors/roles.decoretor";
import { UserRoles } from "src/common/constants/user.roles";
import { ApiResponse } from "src/common/dto/api-response.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "src/common/guard/Auth.guard";
import { Request } from "express";
import { ForgetPasswordDto } from "./dto/forget-password.dto";


//User Me
@UseGuards(AuthGuard)
@Controller({ path: 'userMe', version: '1' })
export class UserMeController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @ApiOperation({ summary: "Get My Info" })
    @Roles([UserRoles.ADMIN, UserRoles.USER])
    async getMyInfo(@Req() req: Request) {
        const info = await this.userService.getMyInfo(req.user)
        console.log(info);
        return ApiResponse.success(info);
    }

    @Put()
    @ApiOperation({ summary: "Update Info" })
    @Roles([UserRoles.ADMIN, UserRoles.USER])
    async updateMyInfo(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
        const info = await this.userService.updateMyInfo(req.user, updateUserDto)
        console.log(info);
        return ApiResponse.success(info);
    }

    @Patch()
    @ApiOperation({ summary: "In-Active Account" })
    @Roles([UserRoles.USER])
    async unActiveAccount(@Req() req: Request) {
        const info = await this.userService.unActiveAccount(req.user)
        return ApiResponse.success(info);
    }
    @Patch('forget-password')
    @ApiOperation({ summary: "Forget Password" })
    @Roles([UserRoles.USER])
    async forgetPassword(@Req() req: Request, @Body() forgetPasswordDto: ForgetPasswordDto) {
        const {access_token , message} = await this.userService.forgetPassword(req.user, forgetPasswordDto)
        return ApiResponse.success({access_token} , message);
    }
}