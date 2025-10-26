import { Component } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-wishlist',
  imports: [MatButton,MatAnchor,RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center py-20">
      <h2 class="text-3xl font-bold mb-4">Your Wishlist is Empty</h2>
      <p class="text-gray-600 mb-6">Browse products and add them to your wishlist to see them here.</p>
      <a routerLink="/products/all" matButton class="primary">
        Browse Products
      </a>
    </div>

  `,
  styles: ``
})
export class EmptyWishlist {

}
