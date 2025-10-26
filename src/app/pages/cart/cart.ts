import { Component, inject } from '@angular/core';
import { electrofyStore } from '../../electrofy-store';
import { ProductCard } from "../../components/product-card/product-card";
import { MatIcon } from "@angular/material/icon";
import { BackButton } from "../../components/back-button/back-button";

@Component({
  selector: 'app-cart',
  imports: [ProductCard, MatIcon, BackButton],
  template: `
       <div class="mx-auto max-x-w-[1200px] py-6 px-4">
    <app-back-button navigate="/products/all">Back to Products</app-back-button>
    @if(store.cartItems().length === 0 ){
      <!-- <app-empty-wishlist /> -->
    }@else {
      <div class="flex items-center justify-between mb-6">
       <h1 class="text-2xl font-bold">My Cart</h1>
       <span class="text-gray-500 text-xl">{{store.cartItems().length}} items</span>
      </div> 
      <div class="responsive-grid">
        @for (product of store.cartItems(); track product) {
          <app-product-card [product]="product">
          <button (click)="store.removeFromCart(product)"  matIconButton class="!absolute z-10 top-3 right-3 w-10 h-10 rounded-full !bg-white border-0 shadow flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg">
            <mat-icon >
              delete
            </mat-icon>
         </button>
          </app-product-card>
        }
      </div>
       <div class="mt-8 flex justify-center">
    <button matButton="outlined" (click)="store.clearCartItems()"  class="danger">
      Clear Wishlist
    </button>
  </div>
    }
  </div>
  `,
  styles: ``
})
export class Cart {

  store = inject(electrofyStore);

}
