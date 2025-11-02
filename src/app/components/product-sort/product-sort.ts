import { Component, input, output, signal, effect } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';

export type SortOption = 
  | 'default'
  | 'price-low-high'
  | 'price-high-low'
  | 'newest'
  | 'oldest'
  | 'rating-high-low'
  | 'name-asc'
  | 'name-desc';

@Component({
  selector: 'app-product-sort',
  imports: [MatFormField, MatLabel, MatSelect, MatOption],
  template: `
    <mat-form-field class="w-full" appearance="outline">
      <mat-label>Sort By</mat-label>
        <mat-select [value]="sortValue()" (selectionChange)="onSortChange($event.value)" appearance="outline" class="w-full">
        <mat-option value="default">Default</mat-option>
        <mat-option value="price-low-high">Price: Low to High</mat-option>
        <mat-option value="price-high-low">Price: High to Low</mat-option>
        <mat-option value="newest">Newest First</mat-option>
        <mat-option value="oldest">Oldest First</mat-option>
        <mat-option value="rating-high-low">Highest Rated</mat-option>
        <mat-option value="name-asc">Name: A to Z</mat-option>
        <mat-option value="name-desc">Name: Z to A</mat-option>
      </mat-select>
    </mat-form-field>
  `
})
export class ProductSort {
  currentSort = input<SortOption>('default');
  sortValue = signal<SortOption>(this.currentSort());
  
  sortChange = output<SortOption>();

  constructor() {
    effect(() => {
      this.sortValue.set(this.currentSort());
    });
  }

  onSortChange(value: SortOption) {
    this.sortValue.set(value);
    this.sortChange.emit(value);
  }
}

