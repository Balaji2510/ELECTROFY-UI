import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {  MatIconButton,MatButton } from '@angular/material/button';
import { RouterLink } from "@angular/router";
import { MatBadge } from "@angular/material/badge";
import { electrofyStore } from '../../electrofy-store';

@Component({
  selector: 'app-header-actions',
  imports: [MatIcon, MatIconButton, MatButton, RouterLink,MatBadge],
  template: `
    <div class="flex items-center gap-2">
      <!-- Header actions go here -->
       <button matIconButton aria-label="Wishlist" routerLink="/wishlist" [matBadge]="store.wishlistItems().length" [matBadgeHidden]="store.wishlistItems().length==0" matBadgeColor="warn">
        <mat-icon >favorite</mat-icon>
      </button>
      <button matIconButton aria-label="Shopping Cart">
        <mat-icon>shopping_cart</mat-icon>
      </button>
      <!-- <button matIconButton aria-label="Notifications">
        <mat-icon>notifications</mat-icon>
      </button> -->
      <button matButton aria-label="Sign In">
       Sign in
      </button>
      <button matButton="filled" aria-label="Sign Up">
        Sign up
      </button>
      <!-- <button matIconButton aria-label="User Profile">
        <mat-icon>person</mat-icon>
      </button> -->
    </div>
  `,
  styles: ``
})
export class HeaderActions {

  store=inject(electrofyStore);

}
