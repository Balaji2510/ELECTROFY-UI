import { Component, computed, signal, input, inject } from '@angular/core';
import { Product } from '../../models/product';
import { ProductCard } from '../../components/product-card/product-card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList, MatListItemTitle } from '@angular/material/list';
import { MatListItem } from '@angular/material/list';
import { RouterLink } from "@angular/router";
import { TitleCasePipe } from '@angular/common';
import { electrofyStore } from '../../electrofy-store';
import { ToggleWishlistButton } from "../../components/toggle-wishlist-button/toggle-wishlist-button";
@Component({
  selector: 'app-product-grid',
  imports: [ProductCard, MatSidenavModule, MatNavList, MatListItem, MatListItemTitle, RouterLink, TitleCasePipe, ToggleWishlistButton],
  template: `
  <mat-sidenav-container>
    <mat-sidenav mode="side" [opened]="this.store.issideNavOpened()? true : false" class="w-64 bg-white h-full shadow-md">
      <div class="p-6">
        <h2 class="text-lg text-gray-900">Categories</h2>
        <mat-nav-list>
          @for(cat of categories(); track cat){
            <mat-list-item  [activated]="cat === category()"  class="cursor-pointer hover:bg-gray-200 rounded-md my-2" [routerLink]="'/products/' + cat.toLowerCase()">
             <span matListItemTitle class="font-medium" [class]="cat === category() ? 'text-white' : null">
                {{ cat | titlecase }}
             </span>
            </mat-list-item>
          }
        </mat-nav-list>

        </div>
    </mat-sidenav>
    <mat-sidenav-content  class="bg-gray-100 min-h-screen p-6 h-full">
      <h1 class="text-2xl font-bold text-gray-900 mb-1"> {{ category() |titlecase}}</h1>
      <p class="text-base text-gray-600 mb-6">
        {{ store.filteredProducts().length }} {{ category().toLowerCase() === 'all' ? '' : category().toLowerCase() }} products found.
      </p>

    <div class="responsive-grid">
      @for(product of store.filteredProducts(); track product.id){
      <app-product-card [product]="product" (addtoCartClicked)="addToCart($event)">
        <app-toggle-wishlist-button [product]="product" class="!absolute z-10 top-3 right-3"></app-toggle-wishlist-button>
      </app-product-card>     
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

  categories = signal<string[]>([
    'All',
    'Audio',
    'Accessories',
    'Smart Home',
    'Cameras',
    'Wearables',
    'Peripherals',
    'Monitors',
    'Kitchen',
    'Networking',
    'Home Electronics',
    'Wellness',
    'Drones',
    'Projectors',
    'Storage',
    'Outdoor',
    'Home Appliances',
    'VR',
    'TVs',
    'Phones',
    'Vehicles'
  ]);

  addToCart(product: Product) {
    console.log('Add to Cart clicked for product:', product);
  }

  constructor() {
    this.store.setCategory(this.category());
  }

}
