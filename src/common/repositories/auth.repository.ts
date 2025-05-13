import { LoginDto } from '../../core/auth/dto/login.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from './generic.repoitory';
import { User, UserDocument } from 'src/core/user/user.schema';

@Injectable()
export class AuthRepository extends GenericRepository<UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }
 
}

