import { Component, inject } from '@angular/core';
import { BackButton } from "../../components/back-button/back-button";
import { electrofyStore } from '../../electrofy-store';
import { ProductCard } from "../../components/product-card/product-card";
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatAnchor, MatButton } from '@angular/material/button';
import { EmptyWishlist } from "../my-wishlist/empty-wishlist/empty-wishlist";

@Component({
  selector: 'app-wishlist',
  imports: [BackButton, ProductCard, MatIcon, MatIconButton, MatAnchor, MatButton, EmptyWishlist],
  template: `
   <div class="mx-auto max-w-[1200px] py-4 md:py-6 px-4 min-h-[calc(100vh-200px)]">
    <div class="mb-4 md:mb-6">
      <app-back-button navigate="/products/all">Back to Products</app-back-button>
    </div>
    
    @if(store.wishlistItems().length === 0) {
      <app-empty-wishlist />
    } @else {
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-2">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
        <span class="text-base md:text-xl text-gray-500">
          {{store.wishlistItems().length}} {{store.wishlistItems().length === 1 ? 'item' : 'items'}}
        </span>
      </div> 
      
      <div class="responsive-grid">
        @for (product of store.wishlistItems(); track product.id) {
          <app-product-card [product]="product" class="animate-fade-in">
            <button 
              (click)="store.removeFromWishlist(product)" 
              matIconButton 
              class="!absolute z-10 top-3 right-3 w-10 h-10 rounded-full !bg-white border-0 shadow flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg hover:bg-red-50 !text-red-500"
              aria-label="Remove from wishlist"
            >
              <mat-icon>favorite</mat-icon>
            </button>
          </app-product-card>
        }
      </div>
      
      <div class="mt-6 md:mt-8 flex justify-center">
        <button 
          matButton="outlined" 
          (click)="store.clearWishlist()" 
          class="danger transition-transform hover:scale-105"
        >
          <mat-icon>delete_sweep</mat-icon>
          <span>Clear Wishlist</span>
        </button>
      </div>
    }
  </div>
  `,
  styles: ``
})
export class Wishlist {

  store = inject(electrofyStore);

}
