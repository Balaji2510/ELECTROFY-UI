import { Component, computed, inject, input, output } from '@angular/core';
import { Product } from '../../models/product';
import { MatAnchor } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { electrofyStore } from '../../electrofy-store';

@Component({
  selector: 'app-product-card',
  imports: [MatAnchor, MatIcon],
  template: `
    <div class="relative bg-white cursor-pointer rounded-xl shadow-md overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
          <img [src]="product().imageUrl" alt="{{ product().name }}" class="w-full h-[300px] object-cover rounded-t-xl">
          <ng-content/>
          <div class="p-5 flex flex-col justify-between h-full">
            <h3 class="text-lg font-semibold text-gray-900 mb-2 leading-light">
              {{ product().name }}
            </h3>
            <p class="text-sm text-gray-600 flex-1 mb-4 leading-relaxed">
              {{ product().description }}
            </p>
            <div class="text-sm font-medium mb-3">
             {{product().inStock ? 'In Stock' : 'Out of Stock'}}
            </div>
            <!-- add rating component here -->
             <div class="flex items-center justify-center mt-auto">
              <span class="text-2xl font-bold text-gray-900">
                &#8377;{{ product().price.toFixed(2) }}
              </span>
              <button matButton="filled" class="flex items-center gap-2" (click)="addtoCart(product())" [disabled]="!product().inStock">
                <mat-icon>shopping_cart</mat-icon>
                Add to Cart
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
