import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  imports: [MatIcon, CommonModule],
  template: `
    <div class="flex items-center gap-1">
      @for (star of getStars(); track $index) {
        <mat-icon 
          [class]="getStarClass($index)"
          [class.text-yellow-500]="$index < Math.floor(rating())"
          [class.text-gray-300]="$index >= Math.ceil(rating())"
          class="text-sm md:text-base cursor-pointer transition-colors"
          (click)="onStarClick($index + 1)"
        >
          {{ getStarIcon($index) }}
        </mat-icon>
      }
      @if (showNumber()) {
        <span class="text-sm text-gray-600 ml-1">{{ rating().toFixed(1) }}</span>
      }
    </div>
  `,
  styles: ``
})
export class StarRatingComponent {
  rating = input<number>(0);
  maxRating = input<number>(5);
  showNumber = input<boolean>(true);
  clickable = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');
  
  ratingChange = output<number>();
  
  Math = Math;

  getStars(): number[] {
    return Array(this.maxRating()).fill(0);
  }

  getStarIcon(index: number): string {
    const rating = this.rating();
    if (index < Math.floor(rating)) {
      return 'star';
    } else if (index < rating) {
      return 'star_half';
    } else {
      return 'star_border';
    }
  }

  getStarClass(index: number): string {
    const rating = this.rating();
    const baseClass = this.size() === 'sm' ? 'text-sm' : this.size() === 'lg' ? 'text-lg' : 'text-base';
    
    if (index < Math.floor(rating)) {
      return `${baseClass} text-yellow-500`;
    } else if (index < rating) {
      return `${baseClass} text-yellow-500`;
    } else {
      return `${baseClass} text-gray-300`;
    }
  }

  onStarClick(value: number) {
    if (this.clickable()) {
      this.ratingChange.emit(value);
    }
  }
}

