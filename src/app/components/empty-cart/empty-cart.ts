import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-empty-cart',
  imports: [MatButton, RouterLink, MatIcon],
  template: `
    <div class="flex flex-col items-center justify-center py-12 md:py-20 animate-fade-in">
      <mat-icon class="text-6xl md:text-8xl text-gray-300 mb-4">shopping_cart</mat-icon>
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
      <p class="text-gray-600 mb-6 text-center max-w-md px-4">
        Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
      </p>
      <a routerLink="/products/all" matButton="filled" color="primary" class="animate-scale-in">
        <mat-icon>shopping_bag</mat-icon>
        <span>Browse Products</span>
      </a>
    </div>
  `,
  styles: ``
})
export class EmptyCart {}

