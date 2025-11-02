import { Component, input, output, signal, computed } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { StarRatingComponent } from '../star-rating/star-rating';
import { Review } from '../../models/review';

@Component({
  selector: 'app-review-list',
  imports: [MatIcon, MatButton, StarRatingComponent],
  template: `
    <div class="space-y-6">
      <!-- Review Summary -->
      @if (reviews().length > 0) {
        <div class="bg-gray-50 rounded-lg p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">
                Customer Reviews
              </h3>
              <div class="flex items-center gap-2">
                <app-star-rating [rating]="averageRating()" [clickable]="false" />
                <span class="text-gray-600">
                  {{ averageRating().toFixed(1) }} out of 5
                </span>
                <span class="text-gray-500">({{ reviews().length }} reviews)</span>
              </div>
            </div>
            <!-- Filter/Sort -->
            <div class="flex items-center gap-2">
              <select
                [value]="sortBy()"
                (change)="onSortChange($event)"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>
        </div>
      }

      <!-- Reviews List -->
      @if (sortedReviews().length === 0) {
        <div class="text-center py-12">
          <mat-icon class="text-6xl text-gray-300 mb-4">rate_review</mat-icon>
          <p class="text-gray-500">No reviews yet. Be the first to review!</p>
        </div>
      } @else {
        <div class="space-y-6">
          @for (review of sortedReviews(); track review._id || review.id) {
            <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="font-semibold text-gray-900">
                      {{ review.user.name }}
                    </div>
                    @if (review.isVerifiedPurchase) {
                      <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Verified Purchase
                      </span>
                    }
                  </div>
                  <div class="flex items-center gap-2 mb-2">
                    <app-star-rating [rating]="review.rating" [clickable]="false" />
                    <span class="text-sm text-gray-500">
                      {{ formatDate(review.createdAt) }}
                    </span>
                  </div>
                  @if (review.title) {
                    <h4 class="font-medium text-gray-900 mb-2">{{ review.title }}</h4>
                  }
                </div>
              </div>
              
              <p class="text-gray-700 mb-4 whitespace-pre-wrap">{{ review.comment }}</p>
              
              <!-- Review Images -->
              @if (review.images && review.images.length > 0) {
                <div class="flex gap-2 mb-4">
                  @for (image of review.images; track image) {
                    <img
                      [src]="image"
                      alt="Review image"
                      class="w-20 h-20 object-cover rounded-lg cursor-pointer"
                      (click)="viewImage(image)"
                    >
                  }
                </div>
              }
              
              <!-- Helpful Button -->
              <div class="flex items-center gap-4">
                <button
                  matButton="text"
                  (click)="markHelpful(review)"
                  [disabled]="review._id ? helpfulVotes().has(review._id) : false"
                  class="!text-sm"
                >
                  <mat-icon class="!text-base">thumb_up</mat-icon>
                  Helpful ({{ review.isHelpful }})
                </button>
                
                @if (review.response) {
                  <div class="ml-auto text-sm text-gray-500">
                    Response from seller
                  </div>
                }
              </div>
              
              <!-- Seller Response -->
              @if (review.response) {
                <div class="mt-4 pl-4 border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                  <p class="text-sm font-medium text-gray-900 mb-1">Seller Response</p>
                  <p class="text-sm text-gray-700">{{ review.response.text }}</p>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ReviewList {
  reviews = input<Review[]>([]);
  markHelpfulEvent = output<string>();

  sortBy = signal<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
  helpfulVotes = signal<Set<string>>(new Set());

  averageRating = computed(() => {
    const revs = this.reviews();
    if (revs.length === 0) return 0;
    const sum = revs.reduce((acc, r) => acc + r.rating, 0);
    return sum / revs.length;
  });

  sortedReviews = computed(() => {
    const revs = [...this.reviews()];
    const sort = this.sortBy();

    switch (sort) {
      case 'newest':
        return revs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return revs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'highest':
        return revs.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return revs.sort((a, b) => a.rating - b.rating);
      case 'helpful':
        return revs.sort((a, b) => b.isHelpful - a.isHelpful);
      default:
        return revs;
    }
  });

  onSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortBy.set(target.value as any);
  }

  markHelpful(review: Review) {
    const reviewId = review._id || review.id;
    if (reviewId && !this.helpfulVotes().has(reviewId)) {
      this.markHelpfulEvent.emit(reviewId);
      this.helpfulVotes.update(set => new Set(set).add(reviewId));
    }
  }

  viewImage(image: string) {
    // Simple image viewer - could be enhanced with a modal
    window.open(image, '_blank');
  }

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(d);
  }
}

