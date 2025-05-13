export class CouponStatsDto {
    id: string;
    code: string;
    name: string;
    usageCount: number;
    usageLimit?: number;
    isActive: boolean;
    totalDiscountAmount: number;
    averageOrderValue: number;
    conversionRate: number;
  }