import { Component, computed, inject, input } from '@angular/core';
import { electrofyStore } from '../../electrofy-store';
import { Product } from '../../models/product';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-toggle-wishlist-button',
  imports: [MatIcon],
  template: `
      <button [class]="isInWishlist()? '!text-red-500':'text-gray-500'" (click)="toggleWishList(product())"  matIconButton class=" w-10 h-10 rounded-full !bg-white border-0 shadow flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg">
            <mat-icon >
              {{ isInWishlist() ? 'favorite' : 'favorite_border' }}
            </mat-icon>
         </button>
  `,
  styles: ``
})
export class ToggleWishlistButton {
  product = input.required<Product>();
  store = inject(electrofyStore);
  isInWishlist = computed(() =>
    this.store.wishlistItems().find((item: Product) => item.id === this.product().id)
  );
  toggleWishList(product: Product) {
    if (this.isInWishlist()) {
      this.store.removeFromWishlist(product);
    } else {
      this.store.addToWishlist(product);
    }
  }

}
