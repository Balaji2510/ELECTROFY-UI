import { Injectable } from '@angular/core';
import { ApiService, ApiResponse } from './api.service';
import { Observable, map } from 'rxjs';
import { Coupon, CouponValidationResponse } from '../models/coupon';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  constructor(private apiService: ApiService) {}

  /**
   * Validate a coupon code
   */
  validateCoupon(code: string, orderAmount: number): Observable<CouponValidationResponse> {
    return this.apiService.post<CouponValidationResponse>('/coupons/validate', {
      code,
      orderAmount
    }).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Invalid coupon code');
      })
    );
  }
}

