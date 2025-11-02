import { Injectable } from '@angular/core';
import { ApiService, ApiResponse } from './api.service';
import { Observable, map } from 'rxjs';

export interface WishlistItem {
  product: any;
  variant?: any;
  addedAt: string;
}

export interface Wishlist {
  _id?: string;
  name?: string;
  items: WishlistItem[];
  isDefault?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  constructor(private apiService: ApiService) {}

  /**
   * Get wishlists
   */
  getWishlists(): Observable<Wishlist[]> {
    return this.apiService.get<Wishlist[]>('/wishlists').pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return [];
      })
    );
  }

  /**
   * Get default wishlist
   */
  getDefaultWishlist(): Observable<Wishlist | null> {
    return this.apiService.get<Wishlist>('/wishlists/default').pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return null;
      })
    );
  }

  /**
   * Add item to wishlist
   */
  addToWishlist(productId: string, wishlistId?: string, variantId?: string): Observable<Wishlist> {
    const endpoint = wishlistId ? `/wishlists/${wishlistId}/items` : '/wishlists/default/items';
    return this.apiService.post<Wishlist>(endpoint, {
      productId,
      variantId,
    }).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Failed to add to wishlist');
      })
    );
  }

  /**
   * Remove item from wishlist
   */
  removeFromWishlist(wishlistId: string, itemId: string): Observable<Wishlist> {
    return this.apiService.delete<Wishlist>(`/wishlists/${wishlistId}/items/${itemId}`).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Failed to remove from wishlist');
      })
    );
  }

  /**
   * Clear wishlist
   */
  clearWishlist(wishlistId: string): Observable<void> {
    return this.apiService.delete<void>(`/wishlists/${wishlistId}`).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.error || 'Failed to clear wishlist');
        }
      })
    );
  }
}

