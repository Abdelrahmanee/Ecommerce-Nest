export class CartResponseDto {
    id: string;
    cartItems: any[];
    totalPrice: number;
    totalPriceAfterDiscount: number;
    shippingCost: number;
    tax: number;
    appliedCoupons: any[];
    itemCount: number;
    currency: string;
    status: string;
    lastActivity: Date;
    user: string;
    grandTotal: number;
  }