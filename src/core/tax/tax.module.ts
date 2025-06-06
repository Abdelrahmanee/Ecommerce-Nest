import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tax, TaxSchema } from './tax.schema';
import { TaxRepository } from 'src/common/repositories/tax.repository';

@Module({
  imports : [MongooseModule.forFeature([{name : Tax.name , schema : TaxSchema}])],
  controllers: [TaxController],
  providers: [TaxService , TaxRepository],
})
export class TaxModule {}
