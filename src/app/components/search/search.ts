import { Component, inject, signal, output, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatIcon,
    MatIconButton,
    MatProgressSpinnerModule,
    RouterLink
  ],
  template: `
    <div class="relative w-full search-container">
      <div class="relative">
        <mat-form-field appearance="outline" class="w-full search-field">
          <input 
            matInput 
            [formControl]="searchControl"
            placeholder="Search products..."
            (focus)="onFocus()"
            (blur)="onBlur()"
            (keydown.enter)="handleEnterKey()"
            (keydown.escape)="handleEscapeKey()"
            (keydown.arrowDown)="handleArrowDown($event)"
            (keydown.arrowUp)="handleArrowUp($event)"
            #searchInput
            class="search-input"
          >
          <mat-icon matPrefix class="search-icon">search</mat-icon>
          @if (isSearching()) {
            <mat-spinner 
              matSuffix 
              diameter="20" 
              class="search-spinner"
            ></mat-spinner>
          } @else if (searchControl.value) {
            <button 
              matIconButton 
              matSuffix
              (click)="clearSearch()"
              aria-label="Clear search"
              class="clear-button"
              type="button"
            >
              <mat-icon>close</mat-icon>
            </button>
          }
        </mat-form-field>
        
        <!-- Search Suggestions Dropdown -->
        @if (showSuggestions() && (suggestions().length > 0 || isSearching() || (searchControl.value && searchControl.value.length > 2))) {
          <div 
            class="search-dropdown"
            (mouseenter)="isMouseInDropdown.set(true)"
            (mouseleave)="isMouseInDropdown.set(false)"
          >
            @if (isSearching()) {
              <div class="search-loading">
                <mat-spinner diameter="24"></mat-spinner>
                <p class="text-sm text-gray-600 mt-2">Searching...</p>
              </div>
            } @else if (suggestions().length > 0) {
              <div class="search-results-header">
                <p class="text-xs font-medium text-gray-600">
                  {{ suggestions().length }} result{{ suggestions().length !== 1 ? 's' : '' }} found
                </p>
              </div>
              <div class="search-results-list">
                @for (suggestion of suggestions(); track suggestion.id; let idx = $index) {
                  <a
                    [routerLink]="['/product', suggestion.id]"
                    class="search-result-item"
                    [class.active]="selectedIndex() === idx"
                    (click)="selectSuggestion(suggestion)"
                    (mouseenter)="selectedIndex.set(idx)"
                  >
                    <div class="search-result-image">
                      <img 
                        [src]="suggestion.imageUrl || '/assets/placeholder.png'" 
                        [alt]="suggestion.name"
                        class="w-full h-full object-cover"
                        loading="lazy"
                        (error)="$event.target.src = '/assets/placeholder.png'"
                      >
                    </div>
                    <div class="search-result-content">
                      <p class="search-result-name">{{ suggestion.name }}</p>
                      <p class="search-result-description">{{ suggestion.description }}</p>
                      <div class="search-result-footer">
                        <p class="search-result-price">&#8377;{{ suggestion.price.toLocaleString('en-IN') }}</p>
                        @if (suggestion.rating > 0) {
                          <div class="search-result-rating">
                            <mat-icon class="star-icon">star</mat-icon>
                            <span class="text-xs">{{ suggestion.rating.toFixed(1) }}</span>
                          </div>
                        }
                      </div>
                    </div>
                  </a>
                }
              </div>
              @if (suggestions().length >= 8) {
                <div class="search-footer" (click)="navigateToSearchResults()">
                  <p class="text-sm font-medium text-primary cursor-pointer">View all results</p>
                </div>
              }
            } @else if (searchControl.value && searchControl.value.length > 2 && !isSearching()) {
              <div class="search-empty">
                <mat-icon class="empty-icon">search_off</mat-icon>
                <p class="text-gray-600 font-medium">No products found</p>
                <p class="text-sm text-gray-500">Try different keywords</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .search-container {
      position: relative;
    }

    .search-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    .search-field ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: #f9fafb;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .search-field ::ng-deep .mat-mdc-text-field-wrapper:hover {
      background-color: #f3f4f6;
    }

    .search-field ::ng-deep .mat-mdc-text-field-wrapper.mdc-text-field--focused {
      background-color: #ffffff;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-field ::ng-deep .mat-mdc-form-field-flex {
      align-items: center;
      height: 44px;
    }

    .search-input {
      font-size: 14px;
      padding: 8px 0;
    }

    .search-icon {
      color: #6b7280;
      margin-right: 8px;
    }

    .search-spinner {
      margin-right: 8px;
    }

    .clear-button {
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .clear-button:hover {
      opacity: 1;
    }

    .search-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border: 1px solid #e5e7eb;
      max-height: 480px;
      overflow: hidden;
      z-index: 1000;
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .search-loading {
      padding: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .search-results-header {
      padding: 12px 16px;
      border-bottom: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }

    .search-results-list {
      max-height: 400px;
      overflow-y: auto;
      padding: 8px 0;
    }

    .search-results-list::-webkit-scrollbar {
      width: 6px;
    }

    .search-results-list::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .search-results-list::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }

    .search-results-list::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .search-result-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
      text-decoration: none;
      color: inherit;
    }

    .search-result-item:hover,
    .search-result-item.active {
      background-color: #f0f9ff;
      border-left-color: #3b82f6;
    }

    .search-result-image {
      width: 56px;
      height: 56px;
      flex-shrink: 0;
      border-radius: 8px;
      overflow: hidden;
      background-color: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .search-result-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .search-result-name {
      font-weight: 600;
      font-size: 14px;
      color: #111827;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    .search-result-description {
      font-size: 12px;
      color: #6b7280;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .search-result-footer {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 4px;
    }

    .search-result-price {
      font-weight: 700;
      font-size: 14px;
      color: #3b82f6;
    }

    .search-result-rating {
      display: flex;
      align-items: center;
      gap: 2px;
      color: #f59e0b;
    }

    .star-icon {
      width: 14px;
      height: 14px;
      font-size: 14px;
    }

    .search-footer {
      padding: 12px 16px;
      border-top: 1px solid #e5e7eb;
      background-color: #f9fafb;
      text-align: center;
    }

    .search-empty {
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .empty-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #d1d5db;
      margin-bottom: 8px;
    }

    /* Mobile optimizations */
    @media (max-width: 768px) {
      .search-dropdown {
        max-height: 70vh;
      }

      .search-results-list {
        max-height: calc(70vh - 80px);
      }
    }
  `
})
export class SearchComponent implements OnDestroy {
  private router = inject(Router);
  private productService = inject(ProductService);
  
  searchControl = new FormControl('');
  showSuggestions = signal(false);
  isSearching = signal(false);
  suggestions = signal<Product[]>([]);
  selectedIndex = signal(-1);
  isMouseInDropdown = signal(false);
  private searchSubscription?: Subscription;
  searchPerformed = output<string>();
  
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  constructor() {
    this.searchSubscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          if (query && query.trim().length >= 2) {
            this.isSearching.set(true);
            return this.productService.getProducts({ 
              search: query.trim(), 
              limit: 8,
              status: 'active'
            }).pipe(
              catchError(error => {
                console.error('Search error:', error);
                return of([]);
              })
            );
          } else {
            this.suggestions.set([]);
            this.isSearching.set(false);
            return of([]);
          }
        })
      )
      .subscribe(products => {
        this.suggestions.set(products);
        this.isSearching.set(false);
        if (this.searchControl.value && this.searchControl.value.length >= 2) {
          this.showSuggestions.set(true);
        }
      });
  }

  onFocus() {
    if (this.searchControl.value && this.searchControl.value.length >= 2) {
      this.showSuggestions.set(true);
    }
  }

  onBlur() {
    // Delay to allow click events on suggestions
    setTimeout(() => {
      if (!this.isMouseInDropdown()) {
        this.showSuggestions.set(false);
        this.selectedIndex.set(-1);
      }
    }, 200);
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.suggestions.set([]);
    this.showSuggestions.set(false);
    this.selectedIndex.set(-1);
    this.searchInput?.nativeElement.focus();
  }

  selectSuggestion(product: Product) {
    this.searchControl.setValue('');
    this.suggestions.set([]);
    this.showSuggestions.set(false);
    this.selectedIndex.set(-1);
    this.router.navigate(['/product', product.id]);
  }

  handleEnterKey() {
    if (this.selectedIndex() >= 0 && this.suggestions().length > 0) {
      const selectedProduct = this.suggestions()[this.selectedIndex()];
      this.selectSuggestion(selectedProduct);
    } else if (this.searchControl.value && this.searchControl.value.trim().length >= 2) {
      this.navigateToSearchResults();
    }
  }

  handleEscapeKey() {
    this.showSuggestions.set(false);
    this.selectedIndex.set(-1);
    this.searchInput?.nativeElement.blur();
  }

  handleArrowDown(event: Event) {
    event.preventDefault();
    if (this.suggestions().length > 0) {
      const newIndex = this.selectedIndex() < this.suggestions().length - 1 
        ? this.selectedIndex() + 1 
        : 0;
      this.selectedIndex.set(newIndex);
    }
  }

  handleArrowUp(event: Event) {
    event.preventDefault();
    if (this.suggestions().length > 0) {
      const newIndex = this.selectedIndex() > 0 
        ? this.selectedIndex() - 1 
        : this.suggestions().length - 1;
      this.selectedIndex.set(newIndex);
    }
  }

  navigateToSearchResults() {
    const query = this.searchControl.value;
    if (query && query.trim().length >= 2) {
      this.router.navigate(['/products/all'], { 
        queryParams: { search: query.trim() } 
      });
      this.showSuggestions.set(false);
      this.selectedIndex.set(-1);
    }
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }
}
