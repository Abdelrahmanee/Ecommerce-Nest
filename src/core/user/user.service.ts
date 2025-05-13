import { BadRequestException, HttpCode, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserRepository } from 'src/common/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { UserRoles } from 'src/common/constants/user.roles';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { UserPayload } from 'src/common/types/express';
import { JwtService } from '@nestjs/jwt';
import { ForgetPasswordDto } from './dto/forget-password.dto';
//Admin
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService) { }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const isUserExist = await this.userRepository.exists({ email });

    if (isUserExist) throw new HttpException("User already exists", HttpStatus.FOUND);


    const hash = await bcrypt.hash(password, +process.env.ROUNDS);
    createUserDto.password = hash;

    createUserDto.role = createUserDto.role || UserRoles.USER;
    createUserDto.active = true;
    return this.userRepository.create(createUserDto);
  }
  findAll({ page, limit }) {
    return this.userRepository.findAll({}, { password: 0, __v: 0 }, { page, limit })
  }

  async findOne(id: string) {
    const isUserExist = await this.userRepository.exists({ _id: id })
    if (!isUserExist) throw new NotFoundException("User Not Found")
    return this.userRepository.findById(id, { password: 0, __v: 0 })
  }

  async findOneByEmail(email: string) {
    const isUserExist = await this.userRepository.exists({ email })
    if (!isUserExist) throw new NotFoundException("User Not Found")
    return this.userRepository.findOne({ email }, { password: 0, __v: 0 })
  }
  async HandleAccountActivation(id: string) {
    const isUserExist = await this.userRepository.exists({ _id: id })
    if (!isUserExist) throw new NotFoundException("User Not Found")
    return this.userRepository.toggleActive(id)
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const isUserExist = await this.userRepository.exists({ _id: id })
    if (!isUserExist) throw new NotFoundException("User Not Found")
    const options = {
      new: true,
      projection: { password: 0, __v: 0 },
    };
    return this.userRepository.updateById(id, updateUserDto, options)
  }

  async remove(id: string) {
    const isUserExist = await this.userRepository.exists({ _id: id })
    if (!isUserExist) throw new HttpException("User Not Found", HttpStatus.NOT_FOUND)
    return this.userRepository.deleteById(id)
  }

  async getMyInfo(payload: UserPayload) {
    const { _id: id } = payload;
    const isExist = this.userRepository.exists({ _id: id })
    if (!isExist) throw new HttpException("User Not Found", HttpStatus.NOT_FOUND)
    return this.userRepository.findById(id, { __v: 0, password: 0 });
  }
  async updateMyInfo(payload: UserPayload, updateUserDto: UpdateUserDto) {
    const { _id: id } = payload;
    const isExist = this.userRepository.exists({ _id: id })
    if (!isExist) throw new HttpException("User Not Found", HttpStatus.NOT_FOUND)
    const options = {
      new: true,
      projection: { password: 0, __v: 0 },
    };
    return this.userRepository.updateById(id, updateUserDto, options);
  }
  async unActiveAccount(payload: UserPayload) {
    const { _id: id } = payload;
    const isExist = await this.userRepository.findById(id)
    console.log(isExist.active)
    if (!isExist) throw new HttpException("User Not Found", HttpStatus.NOT_FOUND)
    if (!isExist.active) throw new HttpException("Account Is Already In-Active", HttpStatus.BAD_REQUEST)
    const options = {
      new: true,
      projection: { password: 0, __v: 0 },
    };
    return this.userRepository.updateById(id, { active: false }, options);
  }


  async forgetPassword(payload: UserPayload, forgetPasswordDto: ForgetPasswordDto) {
    const { _id: id } = payload;
    const { oldPassword, newPassword } = forgetPasswordDto;

    // 1. Find the user
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException("User Not Found");

    const isMatch: boolean = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new BadRequestException("Incorrect old password");

    const isSamePassword: boolean = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
        throw new BadRequestException("New password cannot be the same as the old password");
    }

    const saltRounds = parseInt(process.env.ROUNDS, 10) || 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const userAfterUpdate = await this.userRepository.updateById(id, { password: hashedPassword });

    const access_token = this.jwtService.sign({
        _id: userAfterUpdate._id,
        name: userAfterUpdate.name,
        email: userAfterUpdate.email,
        role: userAfterUpdate.role,
    });

    return { message: "Password updated successfully", access_token };
}
}
