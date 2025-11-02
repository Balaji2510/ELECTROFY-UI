export interface Coupon {
  _id?: string;
  id?: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
}

export interface CouponValidationResponse {
  valid: boolean;
  coupon?: Coupon;
  discount?: number;
  error?: string;
}

