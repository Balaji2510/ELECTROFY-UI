import { Component } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-wishlist',
  imports: [MatButton, MatAnchor, MatIcon, RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center py-12 md:py-20 animate-fade-in">
      <mat-icon class="text-6xl md:text-8xl text-gray-300 mb-4">favorite_border</mat-icon>
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
      <p class="text-gray-600 mb-6 text-center max-w-md px-4">
        Browse products and add them to your wishlist to see them here.
      </p>
      <a routerLink="/products/all" matButton="filled" color="primary" class="animate-scale-in">
        <mat-icon>shopping_bag</mat-icon>
        <span>Browse Products</span>
      </a>
    </div>
  `,
  styles: ``
})
export class EmptyWishlist {

}
