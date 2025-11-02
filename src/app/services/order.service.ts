import { Injectable } from '@angular/core';
import { ApiService, ApiResponse } from './api.service';
import { Observable, map } from 'rxjs';
import { Order } from '../models/order';

export interface CreateOrderData {
  shippingAddress: string;
  paymentMethod: string;
  couponCode?: string;
  notes?: string;
}

export interface OrderFilters {
  status?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private apiService: ApiService) {}

  /**
   * Get user's orders
   */
  getOrders(filters?: OrderFilters): Observable<Order[]> {
    const params: any = {};
    
    if (filters?.status) {
      params.status = filters.status;
    }
    if (filters?.page) {
      params.page = filters.page;
    }
    if (filters?.limit) {
      params.limit = filters.limit;
    }

    return this.apiService.get<Order[]>('/orders', params).pipe(
      map((response) => {
        if (response.success && response.data) {
          return Array.isArray(response.data) ? response.data : [];
        }
        return [];
      })
    );
  }

  /**
   * Get order by ID
   */
  getOrderById(orderId: string): Observable<Order | null> {
    return this.apiService.get<Order>(`/orders/${orderId}`).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return null;
      })
    );
  }

  /**
   * Create a new order
   */
  createOrder(orderData: CreateOrderData): Observable<Order> {
    return this.apiService.post<Order>('/orders', orderData).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Failed to create order');
      })
    );
  }

  /**
   * Cancel an order
   */
  cancelOrder(orderId: string, reason?: string): Observable<Order> {
    return this.apiService.post<Order>(`/orders/${orderId}/cancel`, { reason }).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Failed to cancel order');
      })
    );
  }
}

