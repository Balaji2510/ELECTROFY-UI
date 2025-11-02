import { Injectable } from '@angular/core';
import { ApiService, ApiResponse } from './api.service';
import { Observable, map } from 'rxjs';

export interface CartItem {
  _id?: string;
  product: any;
  variant?: any;
  quantity: number;
  price: number;
}

export interface Cart {
  _id?: string;
  items: CartItem[];
  user?: string;
  sessionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private apiService: ApiService) {}

  /**
   * Get cart
   */
  getCart(): Observable<Cart> {
    return this.apiService.get<Cart>('/cart').pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return { items: [] } as Cart;
      })
    );
  }

  /**
   * Add item to cart
   */
  addToCart(productId: string, quantity: number = 1, variantId?: string): Observable<Cart> {
    return this.apiService.post<Cart>('/cart/items', {
      productId,
      quantity,
      variantId,
    }).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Failed to add to cart');
      })
    );
  }

  /**
   * Update cart item quantity
   */
  updateCartItem(itemId: string, quantity: number): Observable<Cart> {
    return this.apiService.put<Cart>(`/cart/items/${itemId}`, { quantity }).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Failed to update cart item');
      })
    );
  }

  /**
   * Remove item from cart
   */
  removeCartItem(itemId: string): Observable<Cart> {
    return this.apiService.delete<Cart>(`/cart/items/${itemId}`).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Failed to remove cart item');
      })
    );
  }

  /**
   * Clear cart
   */
  clearCart(): Observable<void> {
    return this.apiService.delete<void>('/cart').pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.error || 'Failed to clear cart');
        }
      })
    );
  }

  /**
   * Merge guest cart with user cart (after login)
   */
  mergeCart(): Observable<Cart> {
    return this.apiService.post<Cart>('/cart/merge', {}).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Failed to merge cart');
      })
    );
  }
}

