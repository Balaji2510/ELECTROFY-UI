import { Injectable } from '@angular/core';
import { ApiService, ApiResponse } from './api.service';
import { Observable, map } from 'rxjs';
import { Review } from '../models/review';

export interface ReviewFilters {
  product?: string;
  rating?: number;
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private apiService: ApiService) {}

  /**
   * Get reviews for a product
   */
  getProductReviews(productId: string, filters?: ReviewFilters): Observable<Review[]> {
    const params: any = { product: productId };
    
    if (filters?.rating) {
      params.rating = filters.rating;
    }
    if (filters?.sortBy) {
      params.sortBy = filters.sortBy;
    }

    return this.apiService.get<Review[]>('/reviews', params).pipe(
      map((response) => {
        if (response.success && response.data) {
          return Array.isArray(response.data) ? response.data : [];
        }
        return [];
      })
    );
  }

  /**
   * Create a new review
   */
  createReview(review: {
    product: string;
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
    order?: string;
  }): Observable<Review> {
    return this.apiService.post<Review>('/reviews', review).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Failed to create review');
      })
    );
  }

  /**
   * Mark review as helpful
   */
  markHelpful(reviewId: string): Observable<void> {
    return this.apiService.post<void>(`/reviews/${reviewId}/helpful`, {}).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.error || 'Failed to mark review as helpful');
        }
      })
    );
  }
}

