import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandRepository } from 'src/common/repositories/brand.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './brand.schema';

@Module({
  imports :[MongooseModule.forFeature([{name : Brand.name , schema : BrandSchema}])],
  controllers: [BrandController],
  providers: [BrandService , BrandRepository],
})
export class BrandModule {}
