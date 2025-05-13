import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Document, ObjectId, Types } from 'mongoose';
import { ProductRepository } from 'src/common/repositories/product.repository';
import { CategoryRepository } from 'src/common/repositories/category.repository';
import { SubCategoryRepository } from 'src/common/repositories/sub-category.repository';
import { BrandRepository } from 'src/common/repositories/brand.repository';
import { AuditLog } from './product.schema';
import { Request } from 'express';

interface UserContext {
  userId: string;
  userName: string;
  request?: Request;
}

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly brandRepository: BrandRepository,
  ) { }

  async addNewProduct(createProductDto: CreateProductDto, userContext: UserContext) {
    const { category, subCategory, brand, title } = createProductDto;

    // Check for duplicate product
    const productExists = await this.productRepository.exists({ title });
    if (productExists) {
      throw new ConflictException(`Product with title '${title}' already exists`);
    }

    // Validate category
    const categoryDoc = await this.categoryRepository.findOne({ name: category });
    if (!categoryDoc) {
      throw new NotFoundException(`Category '${category}' not found`);
    }

    // Validate subcategory under the category
    const subCategoryDoc = await this.subCategoryRepository.findOne({
      name: subCategory,
      category: categoryDoc._id
    });
    if (!subCategoryDoc) {
      throw new NotFoundException(`SubCategory '${subCategory}' not found in category '${category}'`);
    }

    const brandExists = await this.isExist('name', brand, this.brandRepository);
    if (!brandExists) {
      throw new NotFoundException(`Brand '${brand}' not found`);
    }

    const auditLog: AuditLog = this.createAuditLog('create', userContext, null);
    console.log('Audit log created:', auditLog);

    const userObjectId = new Types.ObjectId(userContext.userId);

    const productData = {
      ...createProductDto,
      category: categoryDoc._id.toString(),
      subCategory: subCategoryDoc._id.toString(),
      createdBy: userObjectId,
      lastUpdatedBy: userObjectId,
      auditLogs: [auditLog],
    };

    console.log('Product data before save:', JSON.stringify(productData, null, 2));

    const addedProduct = await this.productRepository.create(productData);

    if (!addedProduct.auditLogs || addedProduct.auditLogs.length === 0) {
      console.log('Audit logs not saved properly, updating explicitly');
      addedProduct.auditLogs.push(auditLog);
      await addedProduct.save();
    }

    const fullProduct = await this.productRepository.findById(addedProduct._id.toString());
    console.log('Saved full product with audit logs:', JSON.stringify(fullProduct, null, 2));

    return fullProduct;
  }

  // async getAllProducts(options: { page: number; limit: number; includeInactive?: boolean; populate?: string[] }) {
  //   const { page, limit, includeInactive = false, populate = [] } = options;

  //   const filter = includeInactive ? {} : { active: true };

  //   return await this.productRepository.findAll(filter, {}, {
  //     page,
  //     limit,
  //     populate
  //   });
  // }

  async getSpecificProduct(id: string, options: { populate?: string[] } = {}) {
    const { populate = [] } = options;

    const product = await this.productRepository.findById(id, populate);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateSpecificProduct(id: string, updateProductDto: UpdateProductDto, userContext: UserContext) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (updateProductDto.title) {
      const titleExists = await this.productRepository.exists({
        title: updateProductDto.title,
        _id: { $ne: id }
      });

      if (titleExists) {
        throw new ConflictException(`Product with title '${updateProductDto.title}' already exists`);
      }
    }

    if (updateProductDto.category) {
      const categoryExists = await this.isExist('name', updateProductDto.category, this.categoryRepository);
      if (!categoryExists) {
        throw new NotFoundException(`Category '${updateProductDto.category}' not found`);
      }
    }

    if (updateProductDto.subCategory) {
      const subCategoryExists = await this.isExist('name', updateProductDto.subCategory, this.subCategoryRepository);
      if (!subCategoryExists) {
        throw new NotFoundException(`SubCategory '${updateProductDto.subCategory}' not found`);
      }
    }

    if (updateProductDto.brand) {
      const brandExists = await this.isExist('name', updateProductDto.brand, this.brandRepository);
      if (!brandExists) {
        throw new NotFoundException(`Brand '${updateProductDto.brand}' not found`);
      }
    }

    const changedFields = {};

    Object.keys(updateProductDto).forEach(key => {
      if (product[key] !== updateProductDto[key]) {
        changedFields[key] = {
          from: product[key],
          to: updateProductDto[key]
        };
      }
    });

    const auditLog = this.createAuditLog('update', userContext, changedFields);

    const updateData = {
      ...updateProductDto,
      lastUpdatedBy: userContext.userId,
      $push: { auditLogs: auditLog },
      $inc: { __v: 1 }
    };

    const updatedProduct = await this.productRepository.updateById(id, updateData, { new: true });
    return updatedProduct;
  }

  async deleteSpecificProduct(id: string, userContext: UserContext, hardDelete: boolean = false) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (hardDelete) {
      console.log(hardDelete)
      await this.productRepository.deleteById(id);
      return 'Product permanently deleted'
    } else if (!product.active) {
      throw new ConflictException('Product is already deleted');
    } else {
      const auditLog = this.createAuditLog('delete', userContext, null);
      console.log(auditLog)
      const x = await this.productRepository.updateById(id, {
        active: false,
        lastUpdatedBy: userContext.userId,
        $push: { auditLogs: auditLog },
        $inc: { __v: 1 }
      });
      return 'Product deleted successfully';
    }
  }

  async getProductAuditHistory(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product.auditLogs || [];
  }

  async restoreProduct(id: string, userContext: UserContext) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.active) {
      throw new ConflictException('Product is already active');
    }

    const auditLog = this.createAuditLog('restore', userContext, null);

    await this.productRepository.updateById(id, {
      active: true,
      lastUpdatedBy: userContext.userId,
      $push: { auditLogs: auditLog },
      $inc: { __v: 1 }
    }, { new: true });

    return;
  }

  private async isExist(fieldKey: string, fieldValue: string, repository: any): Promise<boolean> {
    const query = {};
    query[fieldKey] = fieldValue;
    return await repository.exists(query);
  }

  private createAuditLog(action: string, userContext: UserContext, changedFields: Record<string, any> | null): AuditLog {
    const { userId, userName, request } = userContext;

    const x = new Types.ObjectId(userId)
    const auditLog: AuditLog = {
      action,
      userId: x,
      userName,
      timestamp: new Date(),
      changedFields: changedFields || undefined
    };

    if (request) {
      auditLog.ipAddress = request.ip;
      auditLog.userAgent = request.headers['user-agent'];
    }

    return auditLog;
  }
}