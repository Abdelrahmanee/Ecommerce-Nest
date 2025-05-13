import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserRepository } from 'src/common/repositories/user.repository';
import { UserMeController } from './userMe.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],

  controllers: [UserController , UserMeController],
  providers: [UserService, UserRepository],
})
export class UserModule { }
