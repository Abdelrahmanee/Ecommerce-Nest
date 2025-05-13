export class CouponResponseDto {
    id: string;
    code: string;
    name: string;
    description: string;
    discount: number;
    discountType: string;
    expiresAt?: Date;
    isActive: boolean;
    usageCount: number;
    usageLimit?: number;
    isSingleUsePerUser: boolean;
    minimumPurchase?: number;
    maximumDiscountAmount?: number;
    applicableProducts?: string[];
    applicableCategories?: string[];
    restrictedToUsers?: string[];
    createdAt: Date;
    updatedAt: Date;
  }