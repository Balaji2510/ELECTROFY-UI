import { Component, computed, inject, input, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { MatAnchor } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { electrofyStore } from '../../electrofy-store';

@Component({
  selector: 'app-product-card',
  imports: [MatAnchor, MatIcon, RouterLink],
  template: `
    <div class="group relative bg-white cursor-pointer rounded-xl shadow-md overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div class="relative overflow-hidden" [routerLink]="['/product', product().id]">
        <img 
          [src]="product().imageUrl" 
          [alt]="product().name" 
          class="w-full h-[250px] md:h-[300px] object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          (error)="$event.target.src='/assets/placeholder.jpg'"
        >
        <div class="absolute top-2 left-2">
          @if (product().inStock) {
            <span class="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              In Stock
            </span>
          } @else {
            <span class="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Out of Stock
            </span>
          }
        </div>
        <ng-content/>
      </div>
      <div class="p-4 md:p-5 flex flex-col justify-between h-full flex-1">
        <div class="flex-1" [routerLink]="['/product', product().id]">
          <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] cursor-pointer hover:text-blue-600">
            {{ product().name }}
          </h3>
          <p class="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {{ product().description }}
          </p>
          <!-- Rating -->
          @if (product().rating > 0) {
            <div class="flex items-center gap-1 mb-3">
              <mat-icon class="text-yellow-500 text-sm">star</mat-icon>
              <span class="text-sm font-medium text-gray-700">{{ product().rating }}</span>
              <span class="text-xs text-gray-500">({{ product().ratingsCount }})</span>
            </div>
          }
        </div>
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mt-auto pt-3 border-t border-gray-100">
          <span class="text-xl md:text-2xl font-bold text-gray-900">
            &#8377;{{ product().price.toLocaleString('en-IN', { maximumFractionDigits: 0 }) }}
          </span>
          <button 
            matButton="filled" 
            class="w-full md:w-auto flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95" 
            (click)="addtoCart(product())" 
            [disabled]="!product().inStock"
          >
            <mat-icon class="text-base">shopping_cart</mat-icon>
            <span class="hidden sm:inline">Add to Cart</span>
            <span class="sm:hidden">Add</span>
          </button>
        </div>           
      </div>
    </div>
  `,
  styles: ``
})
export class ProductCard {

  product = input.required<Product>();
  store = inject(electrofyStore);
  addtoCart(product: Product) {
    this.store.addToCart(product);
  }
}
