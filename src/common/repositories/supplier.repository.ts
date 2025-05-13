import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from './generic.repoitory';
import { Supplier, SupplierDocument } from 'src/core/suppliers/suppliers.schema';

@Injectable()
export class SuppliersRepository extends GenericRepository<SupplierDocument> {
  constructor(@InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>) {
    super(supplierModel);
  }
}