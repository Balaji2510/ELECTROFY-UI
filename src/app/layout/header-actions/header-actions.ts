import { Component, inject } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import {  MatIconButton,MatButton } from '@angular/material/button';
import { Router, RouterLink } from "@angular/router";
import { MatBadge } from "@angular/material/badge";
import { electrofyStore } from '../../electrofy-store';
import { AuthService } from '../../services/auth.service'; // Corrected path
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-header-actions',
  imports: [MatIcon, MatIconButton, MatButton, RouterLink, MatBadge, MatMenu, MatMenuTrigger, MatMenuItem, MatDivider, MatIconModule],
  template: `
    <div class="header-actions">
      <!-- Wishlist Button -->
      <button 
        matIconButton 
        aria-label="Wishlist" 
        routerLink="/wishlist" 
        [matBadge]="store.wishlistItems().length" 
        [matBadgeHidden]="store.wishlistItems().length==0" 
        matBadgeColor="warn"
        class="action-button"
      >
        <mat-icon>favorite</mat-icon>
      </button>
      
      <!-- Shopping Cart Button -->
      <button 
        matIconButton 
        aria-label="Shopping Cart" 
        routerLink="/cart" 
        [matBadge]="store.cartItems().length" 
        [matBadgeHidden]="store.cartItems().length==0" 
        matBadgeColor="warn"
        class="action-button cart-button"
      >
        <mat-icon>shopping_cart</mat-icon>
      </button>

      @if (authService.currentUser()) {
        <!-- User Menu -->
        <button 
          [matMenuTriggerFor]="userMenu" 
          mat-icon-button 
          class="action-button user-menu-button"
          aria-label="User account menu"
        >
          <img 
            class="user-avatar" 
            [src]="authService.currentUser()?.picture"
            [alt]="(authService.currentUser()?.name || 'User') + ' profile picture'"
          >
        </button>
        <mat-menu #userMenu="matMenu" class="user-dropdown-menu">
          <button mat-menu-item routerLink="/account">
            <mat-icon>account_circle</mat-icon>
            <span>My Account</span>
          </button>
          <button mat-menu-item routerLink="/orders">
            <mat-icon>receipt_long</mat-icon>
            <span>Orders</span>
          </button>
          <button mat-menu-item routerLink="/wishlist">
            <mat-icon>favorite</mat-icon>
            <span>Wishlist</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="signOut()">
            <mat-icon>logout</mat-icon>
            <span>Sign Out</span>
          </button>
        </mat-menu>
      } @else {
        <!-- Sign In Button -->
        <button 
          mat-button 
          routerLink="/sign-in" 
          aria-label="Sign In"
          class="sign-in-button"
        >
          Sign in
        </button>
        <!-- Sign Up Button -->
        <button 
          mat-flat-button 
          color="primary" 
          routerLink="/sign-up" 
          aria-label="Sign Up"
          class="sign-up-button"
        >
          Sign up
        </button>
        <!-- Mobile menu button -->
        <button 
          matIconButton
          [matMenuTriggerFor]="mobileMenu"
          class="mobile-menu-button"
          aria-label="Account menu"
        >
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #mobileMenu="matMenu">
          <button mat-menu-item routerLink="/sign-in">
            <mat-icon>login</mat-icon>
            <span>Sign In</span>
          </button>
          <button mat-menu-item routerLink="/sign-up">
            <mat-icon>person_add</mat-icon>
            <span>Sign Up</span>
          </button>
        </mat-menu>
      }
    </div>
  `,
  styles: `
    .header-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .action-button {
      color: #4b5563;
      transition: all 0.2s ease;
      position: relative;
    }

    .action-button:hover {
      color: #667eea;
      background-color: #f3f4f6;
    }

    .cart-button {
      margin-right: 4px;
    }

    .user-menu-button {
      margin-left: 4px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #e5e7eb;
      object-fit: cover;
      transition: border-color 0.2s ease;
    }

    .user-menu-button:hover  {
      border-color: #667eea;
    }

    .sign-in-button {
      color: #4b5563;
      font-weight: 500;
      text-transform: none;
      padding: 8px 16px;
      margin-right: 8px;
    }

    .sign-in-button:hover {
      background-color: #f3f4f6;
    }

    .sign-up-button {
      text-transform: none;
      font-weight: 500;
      padding: 8px 20px;
      border-radius: 6px;
      box-shadow: none;
    }

    .sign-up-button:hover {
      box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
    }

    .mobile-menu-button {
      display: none;
      color: #4b5563;
    }

    /* User Dropdown Menu */
    ::ng-deep .user-dropdown-menu {
      margin-top: 8px;
      border-radius: 8px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border: 1px solid #e5e7eb;
      padding: 4px;
    }

    ::ng-deep .user-dropdown-menu .mat-mdc-menu-item {
      border-radius: 6px;
      margin: 2px 0;
      min-height: 40px;
    }

    ::ng-deep .user-dropdown-menu .mat-mdc-menu-item:hover {
      background-color: #f3f4f6;
    }

    /* Badge Styling */
    ::ng-deep .mat-mdc-icon-button .mat-badge {
      --mdc-badge-label-text-size: 10px;
      --mdc-badge-size: 18px;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .sign-in-button,
      .sign-up-button {
        display: none;
      }

      .mobile-menu-button {
        display: flex;
      }

      .action-button {
        padding: 8px;
      }
    }
  `
})
export class HeaderActions {
  store = inject(electrofyStore);
  authService = inject(AuthService);
  private router = inject(Router);

  constructor() {}

  async signOut(): Promise<void> {
    await this.authService.logout();
  }
}
