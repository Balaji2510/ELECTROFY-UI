import { Component, computed, input, inject, effect, signal } from '@angular/core';
import { AiService } from '../../services/ai.service';
import { Product } from '../../models/product';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductFilters, FilterOptions } from '../../components/product-filters/product-filters';
import { ProductSort, SortOption } from '../../components/product-sort/product-sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList, MatListItemTitle } from '@angular/material/list';
import { MatListItem } from '@angular/material/list';
import { RouterLink } from "@angular/router";
import { TitleCasePipe } from '@angular/common';
import { electrofyStore } from '../../electrofy-store';
import { ToggleWishlistButton } from "../../components/toggle-wishlist-button/toggle-wishlist-button";
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-product-grid',
  imports: [
    ProductCard,
    ProductFilters,
    ProductSort,
    MatSidenavModule,
    TitleCasePipe,
    ToggleWishlistButton,
    MatIcon,
    MatButton,
    MatChipsModule
  ],
  template: `
  <mat-sidenav-container class="h-full">
    <mat-sidenav 
      [mode]="sidebarMode()"
      [opened]="store.issideNavOpened()"
      (closedStart)="onSidebarClose()"
    >
      <!-- Filters are now the main content of the sidebar -->
      <app-product-filters
        [filters]="activeFilters()"
        [priceRange]="priceRange()"
        [brands]="availableBrands()"
        (filterChange)="onFiltersChange($event)"
      />
    </mat-sidenav>
    <mat-sidenav-content class="bg-gray-50 min-h-screen p-4 md:p-6">
      <div class="max-w-[1400px] mx-auto">
        <div class="mb-4 md:mb-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 class="text-xl md:text-3xl font-bold text-gray-900 mb-2 animate-fade-in"> 
                {{ category() | titlecase }}
              </h1>
              <p class="text-sm md:text-base text-gray-600">
                {{ displayedProducts().length }} {{ category().toLowerCase() === 'all' ? '' : category().toLowerCase() }} product{{ displayedProducts().length !== 1 ? 's' : '' }} found.
              </p>
            </div>
            
            <!-- Sort and Filter Controls -->
            <div class="flex items-center gap-4 md:gap-6">
              <div class="w-48">
                <app-product-sort
                  [currentSort]="currentSort()"
                  (sortChange)="onSortChange($event)"
                />
              </div>
              <!-- Filter Toggle Button -->
              <button
                mat-button
                (click)="store.toggleSidebar()"
                class="md:hidden text-sm md:text-base font-medium text-gray-600"
              >
                <mat-icon>filter_list</mat-icon>
                Filters
              </button>
            </div>
          </div>
          
          <!-- AI Recommendations -->
          @if (recommendations().length > 0) {
            <div class="mb-6 animate-fade-in">
              <div class="flex items-center gap-2 mb-2 text-indigo-600">
                <mat-icon>auto_awesome</mat-icon>
                <span class="font-semibold">AI Verified Suggestions</span>
              </div>
              <mat-chip-set>
                @for (rec of recommendations(); track rec) {
                  <mat-chip class="cursor-pointer hover:bg-indigo-50" (click)="searchProduct(rec)">
                    {{ rec }}
                  </mat-chip>
                }
              </mat-chip-set>
            </div>
          }
        </div>

        @if (store.loading()) {
          <div class="responsive-grid">
            @for(item of [1,2,3,4,5,6]; track item) {
              <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="skeleton h-[300px] w-full"></div>
                <div class="p-5 space-y-3">
                  <div class="skeleton h-6 w-3/4"></div>
                  <div class="skeleton h-4 w-full"></div>
                  <div class="skeleton h-4 w-2/3"></div>
                  <div class="skeleton h-10 w-full mt-4"></div>
                </div>
              </div>
            }
          </div>
        } @else if (store.filteredProducts().length === 0) {
          <div class="flex flex-col items-center justify-center py-20 animate-fade-in">
            <mat-icon class="text-6xl md:text-8xl text-gray-300 mb-4">inventory_2</mat-icon>
            <h2 class="text-2xl font-bold text-gray-700 mb-2">No Products Found</h2>
            <p class="text-gray-500 text-center max-w-md">
              We couldn't find any products in this category. Try browsing other categories!
            </p>
          </div>
        } @else {
          <div class="responsive-grid">
            @for(product of displayedProducts(); track product.id){
              <app-product-card [product]="product" class="animate-fade-in">
                <app-toggle-wishlist-button [product]="product" class="!absolute z-10 top-3 right-3"></app-toggle-wishlist-button>
              </app-product-card>     
            }
          </div>
        }
      </div>
    </mat-sidenav-content>
  </mat-sidenav-container>
  `,
  styles: ``
})
export class ProductGrid {
  category = input<string>('all');
  store = inject(electrofyStore);
  aiService = inject(AiService);

  activeFilters = signal<FilterOptions>({});
  currentSort = signal<SortOption>('default');
  showMobileFilters = signal(false);
  recommendations = signal<string[]>([]);

  categories = computed(() => ['All', ...this.store.categories().map(c => c.name)]);

  priceRange = computed(() => {
    const products = this.store.filteredProducts();
    if (products.length === 0) return { min: 0, max: 100000 };

    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  });

  availableBrands = computed(() => {
    const products = this.store.filteredProducts();
    const brands = products
      .map(p => (p as any)?.brand)
      .filter((b): b is string => typeof b === 'string' && b.trim().length > 0);
    const uniqueBrands = [...new Set(brands)];
    return uniqueBrands.sort();
  });

  displayedProducts = computed(() => {
    let products = [...this.store.filteredProducts()];

    // Apply filters
    const filters = this.activeFilters();

    if (filters.minPrice !== undefined) {
      products = products.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      products = products.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.minRating !== undefined) {
      products = products.filter(p => p.rating >= filters.minRating!);
    }
    if (filters.inStock === true) {
      products = products.filter(p => p.inStock);
    }
    if (filters.featured === true) {
      // Assuming featured products have a certain property - adjust as needed
      // For now, we'll filter by high ratings as a proxy
      products = products.filter(p => p.rating >= 4);
    }
    if (filters.brands && filters.brands.length > 0) {
      // Use (p as any)?.brand to avoid type error since Product may not have brand property
      products = products.filter(
        p => (p as any)?.brand && filters.brands!.includes((p as any).brand)
      );
    }

    // Apply sorting
    const sort = this.currentSort();
    switch (sort) {
      case 'price-low-high':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming products have createdAt - adjust as needed
        products.sort((a, b) => 0); // Placeholder
        break;
      case 'oldest':
        products.sort((a, b) => 0); // Placeholder
        break;
      case 'rating-high-low':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default: keep original order
        break;
    }

    return products;
  });

  sidebarMode = computed<'over' | 'side'>(() => {
    return window.innerWidth < 768 ? 'over' : 'side';
  });

  constructor() {
    effect(() => {
      this.store.setCategory(this.category());
      this.loadRecommendations();
    });
  }

  loadRecommendations() {
    // Only load if not already loaded or category changed
    const interest = this.category() === 'all' ? 'Top rated electronics' : `Best ${this.category()}`;
    this.aiService.recommend(interest).subscribe({
      next: (res) => {
        if (res.recommendations) {
          this.recommendations.set(res.recommendations);
        }
      },
      error: (err) => console.error('AI Recommendation failed', err)
    });
  }

  searchProduct(term: string) {
    // Implement search logic or navigate to search result
    // For now, let's just log or maybe filter?
    console.log('Searching for:', term);
  }

  onFiltersChange(filters: FilterOptions) {
    this.activeFilters.set(filters);
  }

  onSortChange(sort: SortOption) {
    this.currentSort.set(sort);
  }

  onCategoryClick() {
    // Reset filters when category changes
    this.activeFilters.set({});
  }

  onSidebarClose() {
    // Any cleanup if needed
  }
}
