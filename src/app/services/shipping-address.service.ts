import { Injectable } from '@angular/core';
import { ApiService, ApiResponse } from './api.service';
import { Observable, map } from 'rxjs';
import { ShippingAddress } from '../models/shipping-address';

@Injectable({
  providedIn: 'root'
})
export class ShippingAddressService {
  constructor(private apiService: ApiService) {}

  /**
   * Get all shipping addresses for current user
   */
  getAddresses(): Observable<ShippingAddress[]> {
    return this.apiService.get<ShippingAddress[]>('/shipping-addresses').pipe(
      map((response) => {
        if (response.success && response.data) {
          return Array.isArray(response.data) ? response.data : [];
        }
        return [];
      })
    );
  }

  /**
   * Get address by ID
   */
  getAddressById(addressId: string): Observable<ShippingAddress | null> {
    return this.apiService.get<ShippingAddress>(`/shipping-addresses/${addressId}`).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return null;
      })
    );
  }

  /**
   * Create a new shipping address
   */
  createAddress(address: Omit<ShippingAddress, '_id' | 'id'>): Observable<ShippingAddress> {
    return this.apiService.post<ShippingAddress>('/shipping-addresses', address).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Failed to create address');
      })
    );
  }

  /**
   * Update shipping address
   */
  updateAddress(addressId: string, address: Partial<ShippingAddress>): Observable<ShippingAddress> {
    return this.apiService.put<ShippingAddress>(`/shipping-addresses/${addressId}`, address).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Failed to update address');
      })
    );
  }

  /**
   * Delete shipping address
   */
  deleteAddress(addressId: string): Observable<void> {
    return this.apiService.delete<void>(`/shipping-addresses/${addressId}`).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.error || 'Failed to delete address');
        }
      })
    );
  }

  /**
   * Set default address
   */
  setDefaultAddress(addressId: string): Observable<void> {
    return this.apiService.put<void>(`/shipping-addresses/${addressId}/default`, {}).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.error || 'Failed to set default address');
        }
      })
    );
  }
}

