import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { electrofyStore } from '../../electrofy-store';
import { ProductCard } from "../../components/product-card/product-card";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { BackButton } from "../../components/back-button/back-button";
import { EmptyCart } from "../../components/empty-cart/empty-cart";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [ MatIcon, MatButton, BackButton, EmptyCart, CommonModule, RouterLink],
  template: `
    <div class="mx-auto max-w-[1200px] py-4 md:py-6 px-4 min-h-[calc(100vh-200px)]">
      <div class="mb-4 md:mb-6">
        <app-back-button navigate="/products/all">Back to Products</app-back-button>
      </div>
      
      @if(store.cartItems().length === 0) {
        <app-empty-cart />
      } @else {
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-2">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">My Cart</h1>
          <span class="text-base md:text-xl text-gray-500">
            {{store.cartItems().length}} {{store.cartItems().length === 1 ? 'item' : 'items'}}
          </span>
        </div> 
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <!-- Cart Items -->
          <div class="lg:col-span-2 space-y-4">
            @for (product of store.cartItems(); track product.id) {
              <div class="bg-white rounded-xl shadow-md overflow-hidden p-4 md:p-6 animate-fade-in">
                <div class="flex flex-col sm:flex-row gap-4">
                  <div class="flex-shrink-0">
                    <img 
                      [src]="product.imageUrl" 
                      [alt]="product.name"
                      class="w-full sm:w-32 h-32 object-cover rounded-lg"
                      loading="lazy"
                    >
                  </div>
                  <div class="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {{ product.name }}
                      </h3>
                      <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                        {{ product.description }}
                      </p>
                      <div class="flex items-center justify-between">
                        <span class="text-xl font-bold text-gray-900">
                          &#8377;{{ product.price.toLocaleString('en-IN', { maximumFractionDigits: 0 }) }}
                        </span>
                        <button 
                          (click)="store.removeFromCart(product)" 
                          matIconButton 
                          class="!text-red-500 hover:bg-red-50 transition-colors"
                          aria-label="Remove from cart"
                        >
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            
            <div class="flex justify-center md:justify-start mt-6">
              <button 
                matButton="outlined" 
                (click)="store.clearCartItems()" 
                class="danger transition-transform hover:scale-105"
              >
                <mat-icon>delete_sweep</mat-icon>
                <span>Clear Cart</span>
              </button>
            </div>
          </div>
          
          <!-- Cart Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-md p-4 md:p-6 sticky top-24 animate-fade-in">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div class="space-y-3 mb-4">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal ({{store.cartItems().length}} items)</span>
                  <span class="font-medium">&#8377;{{ getSubtotal().toLocaleString('en-IN') }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span class="font-medium">Free</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span class="font-medium">&#8377;{{ getTax().toLocaleString('en-IN') }}</span>
                </div>
                <div class="border-t border-gray-200 pt-3">
                  <div class="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>&#8377;{{ getTotal().toLocaleString('en-IN') }}</span>
                  </div>
                </div>
              </div>
              
              <button 
                matButton="filled" 
                color="primary" 
                class="w-full text-base py-3 transition-transform hover:scale-105"
                (click)="proceedToCheckout()"
              >
                <mat-icon>shopping_cart</mat-icon>
                <span>Proceed to Checkout</span>
              </button>
              
              <a 
                routerLink="/products/all" 
                matButton="text" 
                class="w-full mt-3"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class Cart {
  store = inject(electrofyStore);
  
  getSubtotal = computed(() => {
    return this.store.cartItems().reduce((sum, item) => sum + item.price, 0);
  });
  
  getTax = computed(() => {
    return Math.round(this.getSubtotal() * 0.18); // 18% GST
  });
  
  getTotal = computed(() => {
    return this.getSubtotal() + this.getTax();
  });
  
  proceedToCheckout() {
    this.router.navigate(['/checkout/shipping']);
  }
  
  private router = inject(Router);
}

