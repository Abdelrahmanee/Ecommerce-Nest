import { TaxDocument } from 'src/core/tax/tax.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from './generic.repoitory';
import { Tax } from 'src/core/tax/tax.schema';

@Injectable()
export class TaxRepository extends GenericRepository<TaxDocument> {
  constructor(@InjectModel(Tax.name) private taxModel: Model<TaxDocument>) {
    super(taxModel);
  }

}