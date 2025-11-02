import { Component, inject, OnInit, OnDestroy, HostListener, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderActions } from "../header-actions/header-actions";
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { electrofyStore } from '../../electrofy-store';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../components/search/search';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, HeaderActions, MatIcon, MatIconButton, RouterLink, RouterLinkActive, CommonModule, SearchComponent],
  template: `
    <!-- Top Promotional Bar -->
    @if (router.url !== '/sign-in' && router.url !== '/sign-up' && !isTopBarDismissed()) {
      <div class="top-bar">
        <div class="top-bar-content">
          <div class="top-bar-text">
            <mat-icon class="top-bar-icon">local_shipping</mat-icon>
            <span>Free Shipping on Orders Over ₹999 | <strong>Shop Now!</strong></span>
          </div>
          <button matIconButton class="top-bar-close" (click)="dismissTopBar()" aria-label="Close">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
    }

    <!-- Main Header -->
    <header 
      class="enterprise-header"
      [class.scrolled]="isScrolled()"
      [class.top-bar-hidden]="isTopBarDismissed()"
    >
      <!-- Top Section: Logo, Search, Actions -->
      <mat-toolbar class="header-main">
        <div class="header-container">
          <!-- Mobile Menu Button -->
          <!-- @if (router.url !== '/sign-in' && router.url !== '/sign-up') {
            <button 
              matIconButton 
              aria-label="Toggle Menu" 
              (click)="toggleSidebar()"
              class="menu-button"
            >
              <mat-icon>menu</mat-icon>
            </button>
          } -->

          <!-- Logo -->
          <a 
            routerLink="/products/all" 
            class="logo"
          >
            <div class="logo-content">
              <mat-icon class="logo-icon">
                
              </mat-icon>
              <span class="logo-text">ELECTROFY</span>
            </div>
          </a>

          <!-- Search Bar (Desktop) -->
          @if (router.url !== '/sign-in' && router.url !== '/sign-up') {
            <div class="search-container-desktop">
              <app-search></app-search>
            </div>
          }

          <!-- Spacer -->
          <div class="flex-1"></div>

          <!-- Header Actions -->
          <app-header-actions></app-header-actions>
        </div>
      </mat-toolbar>

      <!-- Navigation Menu -->
      @if (router.url !== '/sign-in' && router.url !== '/sign-up') {
        <nav class="navigation-menu">
          <div class="nav-container">
            <div class="nav-links">
              <a 
                routerLink="/products/all" 
                routerLinkActive="active"
                [routerLinkActiveOptions]="{exact: false}"
                class="nav-link"
              >
                <span>All Products</span>
              </a>
              @for (category of categories(); track category._id) {
                <a 
                  [routerLink]="['/products', category.slug || category.name.toLowerCase()]" 
                  routerLinkActive="active"
                  class="nav-link"
                >
                  <span>{{ category.name }}</span>
                </a>
              }
            </div>
            
            <!-- Additional Links -->
            <div class="nav-actions">
              <a routerLink="/orders" class="nav-link-secondary">
                <mat-icon>receipt_long</mat-icon>
                <span class="hidden lg:inline">Orders</span>
              </a>
              <a routerLink="/account" class="nav-link-secondary">
                <mat-icon>account_circle</mat-icon>
                <span class="hidden lg:inline">Account</span>
              </a>
            </div>
          </div>
        </nav>
      }

      <!-- Mobile Search Bar -->
      <!-- @if (router.url !== '/sign-in' && router.url !== '/sign-up') {
        <div class="search-container-mobile">
          <app-search></app-search>
        </div>
      } -->
    </header>
  `,
  styles: `
    /* Top Promotional Bar */
    .top-bar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 8px 0;
      position: relative;
      z-index: 1001;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .top-bar-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .top-bar-text {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 500;
    }

    .top-bar-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .top-bar-close {
      color: white !important;
      opacity: 0.9;
      transition: opacity 0.2s;
    }

    .top-bar-close:hover {
      opacity: 1;
    }

    /* Main Header */
    .enterprise-header {
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .enterprise-header.scrolled {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .enterprise-header.top-bar-hidden {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    /* Header Main Section */
    .header-main {
      background: white;
      padding: 0 !important;
      min-height: 72px;
      height: auto;
    }

    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      gap: 24px;
    }

    /* Logo */
    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    .logo:hover {
      transform: scale(1.02);
    }

    .logo-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .logo-text {
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
    }

    /* Menu Button */
    .menu-button {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1f2937;
      transition: background-color 0.2s;
    }

    .menu-button:hover {
      background-color: #f3f4f6;
    }

    /* Search Container */
    .search-container-desktop {
      flex: 1;
      max-width: 600px;
      margin: 0 auto;
    }

    .search-container-mobile {
      padding: 12px 24px;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    /* Navigation Menu */
    .navigation-menu {
      background: #ffffff;
      border-top: 1px solid #e5e7eb;
      padding: 0;
    }

    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      min-height: 48px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .nav-links::-webkit-scrollbar {
      display: none;
    }

    .nav-link {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      text-decoration: none;
      color: #4b5563;
      font-weight: 500;
      font-size: 14px;
      white-space: nowrap;
      border-bottom: 3px solid transparent;
      transition: all 0.2s ease;
      position: relative;
    }

    .nav-link:hover {
      color: #667eea;
      background-color: #f9fafb;
    }

    .nav-link.active {
      color: #667eea;
      border-bottom-color: #667eea;
      background-color: #f0f4ff;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-left: 16px;
      border-left: 1px solid #e5e7eb;
    }

    .nav-link-secondary {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      text-decoration: none;
      color: #6b7280;
      font-size: 13px;
      font-weight: 500;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .nav-link-secondary:hover {
      background-color: #f3f4f6;
      color: #1f2937;
    }

    .nav-link-secondary mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-container {
        padding: 12px 16px;
        gap: 12px;
      }

      .logo-text {
        font-size: 20px;
      }

      .logo-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .search-container-desktop {
        display: none;
      }

      .nav-container {
        padding: 0 16px;
      }

      .nav-link {
        padding: 10px 16px;
        font-size: 13px;
      }

      .nav-actions {
        display: none;
      }

      .top-bar-content {
        padding: 0 16px;
      }

      .top-bar-text {
        font-size: 12px;
      }
    }

    @media (max-width: 640px) {
      .logo-text {
        display: none;
      }
    }

    /* Hide top bar when dismissed */
    .top-bar.hidden {
      transform: translateY(-100%);
      opacity: 0;
      display: none;
    }
  `
})
export class Header implements OnInit, OnDestroy {
  store = inject(electrofyStore);
  router = inject(Router);
  categoryService = inject(CategoryService);
  isScrolled = signal(false);
  isTopBarDismissed = signal(false);
  categories = signal<Category[]>([]);
  private scrollListener?: () => void;

  toggleSidebar() {
    this.store.toggleSidebar();
  }

  dismissTopBar() {
    this.isTopBarDismissed.set(true);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 10);
  }

  ngOnInit() {
    this.scrollListener = () => this.onWindowScroll();
    window.addEventListener('scroll', this.scrollListener);
    
    // Load categories for navigation
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        // Filter only active categories and parent categories
        const activeCategories = categories.filter(cat => cat.isActive && !cat.parent);
        this.categories.set(activeCategories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }
}
