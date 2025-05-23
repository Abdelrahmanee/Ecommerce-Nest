import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from 'src/common/services/email.service';
import { UserRepository } from 'src/common/repositories/user.repository';
import { User, UserSchema } from '../user/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],

  controllers: [AuthController],
  providers: [AuthService , UserRepository  ,EmailService],
})
export class AuthModule { }
