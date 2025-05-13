import { User, UserDocument } from './../../core/user/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from './generic.repoitory';

@Injectable()
export class UserRepository extends GenericRepository<UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }
  
  async toggleActive(id: string): Promise<UserDocument | null> {
    try {
      const doc = await this.userModel.findById(id);
      if (!doc) {
        throw new Error('Document not found');
      }

      doc.active = !doc.active;
      const updatedDoc = await doc.save();
      return updatedDoc;
    } catch (error) {
      throw this.handleError('Error toggling active field', error);
    }
  }
}

