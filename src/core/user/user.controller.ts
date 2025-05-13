import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decoretors/roles.decoretor';
import { UserRoles } from 'src/common/constants/user.roles';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/Auth.guard';

@UseGuards(AuthGuard)
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) { }

  //Admin
  @Post()
  @ApiOperation({ summary: 'Create user' })
  @Roles([UserRoles.ADMIN])
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto)
    return ApiResponse.success(user, 'User created successfully');
  }

  @Get()
  @Roles([UserRoles.ADMIN])
  @ApiOperation({ summary: 'Get all users with pagination' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNumber = (!page || isNaN(+page)) ? 1 : +page;
    const limitNumber = (!limit || isNaN(+limit)) ? 10 : +limit;

    const { data, total } = await this.userService.findAll({ 
      page: pageNumber, 
      limit: limitNumber 
    });
    return ApiResponse.paginate(data, pageNumber, limitNumber, total);
  }


  @Patch()
  @ApiOperation({ summary: "User Info By Email" })
  @Roles([UserRoles.ADMIN])
  async findOneByEmail(@Body('email') email: string) {
    const user = await this.userService.findOneByEmail(email);
    return ApiResponse.success(user)

  }
  @Get(':id')
  @ApiOperation({ summary: "User Info By User Id" })
  @Roles([UserRoles.ADMIN])
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return ApiResponse.success(user)

  }

  @Put(':id')
  @Roles([UserRoles.ADMIN])
  @ApiOperation({ summary: "Update User" })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return ApiResponse.success(updatedUser)
  }
  @Patch(':id')
  @Roles([UserRoles.ADMIN])
  @ApiOperation({ summary: "Update User Activation" })
  async ActivationHandler(@Param('id') id: string) {
    const updatedUser = await this.userService.HandleAccountActivation(id);
    return ApiResponse.success(updatedUser)
  }

  @Delete(':id')
  @Roles([UserRoles.ADMIN])
  @ApiOperation({ summary: "Delete User" })
  async remove(@Param('id') id: string) {
    const deleteUser = await this.userService.remove(id);
    return ApiResponse.success(deleteUser)
  }

 
}
