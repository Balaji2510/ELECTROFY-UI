import { Component, input, output, signal, computed, OnInit, ElementRef, inject, AfterViewInit } from '@angular/core';
import { MatSlider, MatSliderRangeThumb, MatSliderThumb } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  minRating?: number;
  inStock?: boolean;
  brands?: string[];
}

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [
    MatSlider,
    FormsModule,
    MatIcon,
    CommonModule,
    MatSliderRangeThumb
  ],
  template: `
    <div class="filters-container" [class.sidebar-mode]="isInSidebar()">
      <!-- Header -->
      <div class="filters-header">
        <div class="flex items-center gap-2">
          <mat-icon class="filter-icon">tune</mat-icon>
          <h3 class="filters-title">Filters</h3>
          @if (activeFiltersCount() > 0) {
            <span class="active-count-badge">{{ activeFiltersCount() }}</span>
          }
        </div>
        @if (hasActiveFilters()) {
          <button
            class="clear-all-btn"
            (click)="clearFilters()"
            type="button"
          >
            <mat-icon>close</mat-icon>
            Clear All
          </button>
        }
      </div>

      <!-- Active Filters Chips -->
      @if (hasActiveFilters()) {
        <div class="active-filters-chips">
          @if (currentFilters().minPrice || currentFilters().maxPrice) {
            <div class="filter-chip">
              <span>Price: ₹{{ formatPriceValue(currentFilters().minPrice || priceRange().min || 0) }} - ₹{{ formatPriceValue(currentFilters().maxPrice || priceRange().max || 100000) }}</span>
              <button class="chip-close" (click)="clearPriceFilter()" type="button">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          }
          @if (currentFilters().minRating) {
            <div class="filter-chip">
              <span>
                @for (star of getStars(currentFilters().minRating!); track $index) {
                  <mat-icon class="chip-star">star</mat-icon>
                }
                & Up
              </span>
              <button class="chip-close" (click)="clearRatingFilter()" type="button">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          }
          @if (currentFilters().inStock) {
            <div class="filter-chip">
              <span>In Stock</span>
              <button class="chip-close" (click)="clearStockFilter()" type="button">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          }
          @if (currentFilters().featured) {
            <div class="filter-chip">
              <span>Featured</span>
              <button class="chip-close" (click)="clearFeaturedFilter()" type="button">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          }
          @for(brand of currentFilters().brands || []; track brand) {
            <div class="filter-chip">
              <span>{{ brand }}</span>
              <button class="chip-close" (click)="toggleBrand(brand)" type="button">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          }
        </div>
      }

      <!-- Price Range Section -->
      <div class="filter-section">
        <div class="filter-section-header">
          <mat-icon class="section-icon">currency_rupee</mat-icon>
          <h4 class="section-title">Price Range</h4>
        </div>
        <div class="price-content">
          <!-- Price Inputs -->
          <div class="price-inputs">
            <div class="price-input-wrapper">
              <label class="price-label">Min</label>
              <div class="price-input-container">
                <span class="price-currency">₹</span>
                <input 
                  type="number" 
                  class="price-input"
                  [value]="currentFilters().minPrice || priceRange().min || 0"
                  (input)="onMinPriceInput($event)"
                  [min]="priceRange().min || 0"
                  [max]="priceRange().max || 100000"
                  placeholder="0"
                >
              </div>
            </div>
            <div class="price-separator"></div>
            <div class="price-input-wrapper">
              <label class="price-label">Max</label>
              <div class="price-input-container">
                <span class="price-currency">₹</span>
                <input 
                  type="number" 
                  class="price-input"
                  [value]="currentFilters().maxPrice || priceRange().max || 100000"
                  (input)="onMaxPriceInput($event)"
                  [min]="priceRange().min || 0"
                  [max]="priceRange().max || 100000"
                  placeholder="100000"
                >
              </div>
            </div>
          </div>
          
          <!-- Price Range Slider -->
          @if (priceRange().min !== undefined && priceRange().max !== undefined) {
            <div class="price-slider-wrapper">
              <mat-slider
                class="price-slider"
                [min]="priceRange().min || 0"
                [max]="priceRange().max || 100000"
                [step]="(priceRange().max! - priceRange().min!) / 100"
                [discrete]="true"
                [displayWith]="formatPrice"
              >
                <input 
                  matSliderStartThumb 
                  [value]="currentFilters().minPrice || priceRange().min || 0"
                  (valueChange)="onSliderMinPriceChange($event)"
                >
                <input 
                  matSliderEndThumb 
                  [value]="currentFilters().maxPrice || priceRange().max || 100000"
                  (valueChange)="onSliderMaxPriceChange($event)"
                >
              </mat-slider>
              <div class="price-range-display">
                <span class="price-display-value">₹{{ formatPriceValue(currentFilters().minPrice || priceRange().min || 0) }}</span>
                <span class="price-display-separator">-</span>
                <span class="price-display-value">₹{{ formatPriceValue(currentFilters().maxPrice || priceRange().max || 100000) }}</span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Brand Filter Section -->
      @if (brands().length > 0) {
        <div class="filter-section">
          <div class="filter-section-header">
            <mat-icon class="section-icon">store</mat-icon>
            <h4 class="section-title">Brands</h4>
          </div>
          <div class="checkbox-content flex-col gap-3">
            @for (brand of brands(); track brand) {
              <label class="checkbox-label !p-0 !border-none !bg-transparent">
                <input 
                  type="checkbox"
                  class="custom-checkbox"
                  [checked]="isBrandSelected(brand)"
                  (change)="toggleBrand(brand)"
                >
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">{{ brand }}</span>
              </label>
            }
            @if (brands().length > 5) {
              <!-- Add a show more/less button if list is long -->
            }
          </div>
        </div>
      }

      <!-- Rating Filter Section -->
      <div class="filter-section">
        <div class="filter-section-header">
          <mat-icon class="section-icon">star</mat-icon>
          <h4 class="section-title">Customer Rating</h4>
        </div>
        <div class="rating-content">
          <div class="rating-buttons">
            @for (rating of [4, 3, 2, 1]; track rating) {
              <button
                class="rating-button"
                [class.active]="currentFilters().minRating === rating"
                (click)="toggleRating(rating)"
                type="button"
              >
                <div class="rating-stars">
                  @for (star of getStars(rating); track $index) {
                    <mat-icon class="rating-star filled">star</mat-icon>
                  }
                  @if (rating < 4) {
                    @for (star of getEmptyStars(rating); track $index) {
                      <mat-icon class="rating-star empty">star</mat-icon>
                    }
                  }
                </div>
                <span class="rating-text">& Up</span>
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Availability Section -->
      <div class="filter-section">
        <div class="filter-section-header">
          <mat-icon class="section-icon">inventory_2</mat-icon>
          <h4 class="section-title">Availability</h4>
        </div>
        <div class="checkbox-content">
          <label class="checkbox-label">
            <input 
              type="checkbox"
              class="custom-checkbox"
              [checked]="currentFilters().inStock === true"
              (change)="onStockChange($event)"
            >
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">In Stock Only</span>
          </label>
        </div>
      </div>

      <!-- Special Section -->
      <div class="filter-section">
        <div class="filter-section-header">
          <mat-icon class="section-icon">local_offer</mat-icon>
          <h4 class="section-title">Special Offers</h4>
        </div>
        <div class="checkbox-content">
          <label class="checkbox-label">
            <input 
              type="checkbox"
              class="custom-checkbox"
              [checked]="currentFilters().featured === true"
              (change)="onFeaturedChange($event)"
            >
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">Featured Products</span>
          </label>
        </div>
      </div>
    </div>
  `,
  styles: `
    .filters-container {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .filters-header {
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: white;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .filter-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .filters-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .active-count-badge {
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 12px;
      font-weight: 600;
      min-width: 20px;
      text-align: center;
    }

    .clear-all-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      padding: 6px 12px;
      color: white;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .clear-all-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .clear-all-btn mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .active-filters-chips {
      padding: 16px 20px;
      background: #f1f5f9;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .filter-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 20px;
      padding: 6px 12px;
      font-size: 13px;
      color: #475569;
      font-weight: 500;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .filter-chip .chip-star {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: #fbbf24;
    }

    .chip-close {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e2e8f0;
      border: none;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0;
    }

    .chip-close:hover {
      background: #cbd5e1;
    }

    .chip-close mat-icon {
      font-size: 12px;
      width: 12px;
      height: 12px;
      color: #64748b;
    }

    .filter-section {
      padding: 20px;
      border-bottom: 1px solid #e2e8f0;
    }

    .filter-section:last-child {
      border-bottom: none;
    }

    .filter-section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }

    .section-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #667eea;
    }

    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    /* Price Range Styles */
    .price-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .price-inputs {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 12px;
      align-items: end;
    }

    .price-input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .price-label {
      font-size: 12px;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .price-input-container {
      position: relative;
      display: flex;
      align-items: center;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 0 12px;
      transition: all 0.2s ease;
    }

    .price-input-container:focus-within {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .price-currency {
      font-size: 14px;
      font-weight: 600;
      color: #64748b;
      margin-right: 4px;
    }

    .price-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 10px 0;
      font-size: 14px;
      font-weight: 500;
      color: #1e293b;
      background: transparent;
    }

    .price-input::placeholder {
      color: #cbd5e1;
    }

    .price-separator {
      width: 1px;
      height: 32px;
      background: #e2e8f0;
      margin-bottom: 8px;
    }

    .price-slider-wrapper {
      padding: 12px 0;
    }

    .price-slider {
      width: 100%;
    }

    .price-slider ::ng-deep .mdc-slider__track {
      height: 6px;
      border-radius: 3px;
    }

    .price-slider ::ng-deep .mdc-slider__track--active {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }

    .price-slider ::ng-deep .mdc-slider__thumb {
      width: 20px;
      height: 20px;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .price-slider ::ng-deep .mdc-slider__thumb-knob {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .price-range-display {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 13px;
      color: #64748b;
    }

    .price-display-value {
      font-weight: 600;
      color: #667eea;
    }

    .price-display-separator {
      color: #cbd5e1;
    }

    /* Rating Styles */
    .rating-content {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .rating-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .rating-button {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .rating-button:hover {
      border-color: #cbd5e1;
      background: #f8fafc;
      transform: translateX(4px);
    }

    .rating-button.active {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
    }

    .rating-stars {
      display: flex;
      gap: 2px;
    }

    .rating-star {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .rating-star.filled {
      color: #fbbf24;
    }

    .rating-star.empty {
      color: #e2e8f0;
    }

    .rating-text {
      font-size: 14px;
      font-weight: 500;
      color: #475569;
    }

    .rating-button.active .rating-text {
      color: #667eea;
      font-weight: 600;
    }

    /* Checkbox Styles */
    .checkbox-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .checkbox-label:hover {
      border-color: #cbd5e1;
      background: #f8fafc;
    }

    .custom-checkbox {
      display: none;
    }

    .custom-checkbox:checked + .checkbox-custom {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
    }

    .custom-checkbox:checked + .checkbox-custom::after {
      opacity: 1;
      transform: scale(1);
    }

    .checkbox-custom {
      width: 20px;
      height: 20px;
      border: 2px solid #cbd5e1;
      border-radius: 5px;
      background: white;
      position: relative;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .checkbox-custom::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      color: white;
      font-size: 14px;
      font-weight: bold;
      opacity: 0;
      transition: all 0.2s ease;
    }

    .checkbox-text {
      font-size: 14px;
      font-weight: 500;
      color: #475569;
    }

    .custom-checkbox:checked ~ .checkbox-text {
      color: #667eea;
      font-weight: 600;
    }

    /* Sidebar Adaptive Styles */
    .filters-container.sidebar-mode {
      width: 100%;
      max-width: 100%;
    }

    .filters-container.sidebar-mode .filters-header {
      padding: 12px 14px;
      flex-wrap: wrap;
      gap: 8px;
    }

    /* Sidebar Adaptive Styles */
    .filters-container.sidebar-mode .filters-title {
      font-size: 15px;
      gap: 6px;
    }

    .filters-container.sidebar-mode .filter-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .filters-container.sidebar-mode .clear-all-btn {
      padding: 4px 10px;
      font-size: 11px;
      gap: 4px;
    }

    .filters-container.sidebar-mode .clear-all-btn mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .filters-container.sidebar-mode .active-filters-chips {
      padding: 10px 14px;
      gap: 6px;
    }

    .filters-container.sidebar-mode .filter-chip {
      padding: 4px 8px;
      font-size: 11px;
      gap: 4px;
    }

    .filters-container.sidebar-mode .filter-chip .chip-star {
      font-size: 12px;
      width: 12px;
      height: 12px;
    }

    .filters-container.sidebar-mode .filter-section {
      padding: 12px 14px;
    }

    .filters-container.sidebar-mode .filter-section-header {
      margin-bottom: 10px;
      gap: 8px;
    }

    .filters-container.sidebar-mode .section-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .filters-container.sidebar-mode .section-title {
      font-size: 13px;
    }

    .filters-container.sidebar-mode .price-content {
      gap: 12px;
    }

    .filters-container.sidebar-mode .price-inputs {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .filters-container.sidebar-mode .price-separator {
      display: none;
    }

    .filters-container.sidebar-mode .price-input-wrapper {
      gap: 4px;
    }

    .filters-container.sidebar-mode .price-label {
      font-size: 11px;
    }

    .filters-container.sidebar-mode .price-input-container {
      padding: 0 10px;
    }

    .filters-container.sidebar-mode .price-input {
      padding: 8px 0;
      font-size: 13px;
    }

    .filters-container.sidebar-mode .price-currency {
      font-size: 12px;
    }

    .filters-container.sidebar-mode .price-slider-wrapper {
      padding: 8px 0;
    }

    .filters-container.sidebar-mode .price-range-display {
      font-size: 11px;
      flex-wrap: wrap;
      gap: 4px;
      justify-content: center;
    }

    .filters-container.sidebar-mode .price-display-value {
      font-size: 11px;
    }

    .filters-container.sidebar-mode .rating-buttons {
      gap: 8px;
    }

    .filters-container.sidebar-mode .rating-button {
      padding: 10px 12px;
      gap: 8px;
    }

    .filters-container.sidebar-mode .rating-star {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .filters-container.sidebar-mode .rating-text {
      font-size: 12px;
    }

    .filters-container.sidebar-mode .checkbox-label {
      padding: 10px 12px;
      gap: 10px;
    }

    .filters-container.sidebar-mode .checkbox-text {
      font-size: 12px;
    }

    .filters-container.sidebar-mode .checkbox-custom {
      width: 18px;
      height: 18px;
    }

    .filters-container.sidebar-mode .checkbox-custom::after {
      font-size: 12px;
    }

    /* Additional narrow container detection */
    @container (max-width: 300px) {
      .filters-header {
        padding: 12px 14px;
        flex-wrap: wrap;
        gap: 8px;
      }

      .filters-title {
        font-size: 15px;
      }

      .filter-section {
        padding: 12px 14px;
      }

      .price-inputs {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .price-separator {
        display: none;
      }
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .filters-container {
        border-radius: 12px;
      }

      .filters-header {
        padding: 16px;
      }

      .filter-section {
        padding: 16px;
      }

      .price-inputs {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .price-separator {
        display: none;
      }
    }
  `
})
export class ProductFilters implements OnInit, AfterViewInit {
  private elementRef = inject(ElementRef);
  
  filters = input<FilterOptions>({});
  priceRange = input<{ min?: number; max?: number }>({});
  brands = input<string[]>([]);

  filterChange = output<FilterOptions>();

  currentFilters = signal<FilterOptions>({});
  isInSidebar = signal(false);

  hasActiveFilters = computed(() => {
    const f = this.currentFilters();
    return !!(f.minPrice || f.maxPrice || f.featured || f.minRating || f.inStock || (f.brands && f.brands.length > 0));
  });

  activeFiltersCount = computed(() => {
    const f = this.currentFilters();
    let count = 0;
    if (f.minPrice || f.maxPrice) count++;
    if (f.brands && f.brands.length > 0) count++;
    if (f.minRating) count++;
    if (f.inStock) count++;
    if (f.featured) count++;
    return count;
  });

  ngOnInit() {
    this.currentFilters.set(this.filters());
  }

  ngAfterViewInit() {
    // Check if component is inside a mat-sidenav
    const sidenav = this.elementRef.nativeElement.closest('mat-sidenav');
    this.isInSidebar.set(!!sidenav);
  }

  onFilterChange() {
    const filters = { ...this.currentFilters() };
    // Clean up undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof FilterOptions] === undefined) {
        delete filters[key as keyof FilterOptions];
      }
    });
    this.filterChange.emit(filters);
  }

  onPriceRangeChange(event: any) {
    this.onFilterChange();
  }

  onMinPriceInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.updateFilter('minPrice', value ? +value : null);
  }

  onMaxPriceInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.updateFilter('maxPrice', value ? +value : null);
  }

  onSliderMinPriceChange(event: any) {
    const value = typeof event === 'number' ? event : (event?.value ?? event?.target?.value);
    this.updateFilter('minPrice', value ?? null);
  }

  onSliderMaxPriceChange(event: any) {
    const value = typeof event === 'number' ? event : (event?.value ?? event?.target?.value);
    this.updateFilter('maxPrice', value ?? null);
  }

  updateFilter(key: 'minPrice' | 'maxPrice', value: number | null | undefined) {
    this.currentFilters.update(f => ({
      ...f,
      [key]: value || undefined
    }));
    this.onFilterChange();
  }

  toggleRating(rating: number) {
    const currentRating = this.currentFilters().minRating;
    this.currentFilters.update(f => ({
      ...f,
      minRating: currentRating === rating ? undefined : rating
    }));
    this.onFilterChange();
  }

  isBrandSelected(brand: string): boolean {
    return this.currentFilters().brands?.includes(brand) ?? false;
  }

  toggleBrand(brand: string) {
    this.currentFilters.update(f => {
      const currentBrands = f.brands || [];
      const newBrands = currentBrands.includes(brand)
        ? currentBrands.filter(b => b !== brand)
        : [...currentBrands, brand];
      
      return {
        ...f,
        brands: newBrands.length > 0 ? newBrands : undefined
      };
    });
    this.onFilterChange();
  }

  onRatingChange(event: any, rating: number | null) {
    this.currentFilters.update(f => ({
      ...f,
      minRating: event.checked ? rating! : undefined
    }));
    this.onFilterChange();
  }

  clearRatingFilter() {
    this.currentFilters.update(f => ({
      ...f,
      minRating: undefined
    }));
    this.onFilterChange();
  }

  clearPriceFilter() {
    this.currentFilters.update(f => ({
      ...f,
      minPrice: undefined,
      maxPrice: undefined
    }));
    this.onFilterChange();
  }

  clearStockFilter() {
    this.currentFilters.update(f => ({
      ...f,
      inStock: undefined
    }));
    this.onFilterChange();
  }

  clearFeaturedFilter() {
    this.currentFilters.update(f => ({
      ...f,
      featured: undefined
    }));
    this.onFilterChange();
  }

  onStockChange(event: any) {
    this.currentFilters.update(f => ({
      ...f,
      inStock: event.checked ? true : undefined
    }));
    this.onFilterChange();
  }

  onFeaturedChange(event: any) {
    this.currentFilters.update(f => ({
      ...f,
      featured: event.checked ? true : undefined
    }));
    this.onFilterChange();
  }

  clearFilters() {
    const emptyFilters: FilterOptions = {};
    this.currentFilters.set(emptyFilters);
    this.onFilterChange();
  }

  formatPrice(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }

  formatPriceValue(value: number): string {
    return value.toLocaleString('en-IN');
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(4 - rating).fill(0);
  }
}
