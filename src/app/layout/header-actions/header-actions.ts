import { Component, computed, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {  MatIconButton,MatButton } from '@angular/material/button';
import { Router, RouterLink } from "@angular/router";
import { MatBadge } from "@angular/material/badge";
import { electrofyStore } from '../../electrofy-store';
import { AuthService } from '../../services/auth.service'; // Corrected path
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: 'app-header-actions',
  imports: [MatIcon, MatIconButton, MatButton, RouterLink, MatBadge, MatMenu, MatMenuTrigger, MatMenuItem],
  template: `
    <div class="flex items-center gap-2">
      <!-- Header actions go here -->
       <button matIconButton aria-label="Wishlist" routerLink="/wishlist" [matBadge]="store.wishlistItems().length" [matBadgeHidden]="store.wishlistItems().length==0" matBadgeColor="warn">
        <mat-icon >favorite</mat-icon>
      </button>
      <button matIconButton aria-label="Shopping Cart" routerLink="/cart" [matBadge]="store.cartItems().length" [matBadgeHidden]="store.cartItems().length==0" matBadgeColor="warn">
        <mat-icon>shopping_cart</mat-icon>
      </button>

      @if (authService.currentUser()) {
        <button [matMenuTriggerFor]="userMenu" mat-icon-button>
          <img class="w-9 h-9 rounded-full" [src]="authService.currentUser()?.picture" alt="User profile picture">
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="signOut()">
            <mat-icon>logout</mat-icon>
            <span>Sign Out</span>
          </button>
        </mat-menu>
      } @else {
        <button mat-button routerLink="/sign-in" aria-label="Sign In">
          Sign in
        </button>
        <button mat-flat-button color="primary" routerLink="/sign-up" aria-label="Sign Up">
          Sign up
        </button>
      }
    </div>
  `,
  styles: ``
})
export class HeaderActions {
  store = inject(electrofyStore);
  authService = inject(AuthService);
  private router = inject(Router);

  signOut() {
    this.authService.setCurrentUser(null);
    this.router.navigate(['/sign-in']);
  }
}
