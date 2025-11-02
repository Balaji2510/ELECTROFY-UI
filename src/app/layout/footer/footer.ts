import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, MatIcon],
  template: `
    <footer class="bg-gray-900 text-gray-300 mt-auto">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div>
            <h3 class="text-white text-lg font-bold mb-4">Electrofy</h3>
            <p class="text-sm mb-4">
              Your trusted destination for quality electronics and gadgets.
            </p>
            <div class="flex gap-4">
              <a href="#" class="hover:text-white transition-colors" aria-label="Facebook">
                <mat-icon>facebook</mat-icon>
              </a>
              <a href="#" class="hover:text-white transition-colors" aria-label="Twitter">
                <mat-icon>twitter</mat-icon>
              </a>
              <a href="#" class="hover:text-white transition-colors" aria-label="Instagram">
                <mat-icon>instagram</mat-icon>
              </a>
              <a href="#" class="hover:text-white transition-colors" aria-label="LinkedIn">
                <mat-icon>linkedin</mat-icon>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-white font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2 text-sm">
              <li>
                <a routerLink="/products/all" class="hover:text-white transition-colors">All Products</a>
              </li>
              <li>
                <a routerLink="/account" class="hover:text-white transition-colors">My Account</a>
              </li>
              <li>
                <a routerLink="/orders" class="hover:text-white transition-colors">My Orders</a>
              </li>
              <li>
                <a routerLink="/wishlist" class="hover:text-white transition-colors">Wishlist</a>
              </li>
            </ul>
          </div>

          <!-- Customer Service -->
          <div>
            <h4 class="text-white font-semibold mb-4">Customer Service</h4>
            <ul class="space-y-2 text-sm">
              <li>
                <a href="#" class="hover:text-white transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="#" class="hover:text-white transition-colors">Shipping Policy</a>
              </li>
              <li>
                <a href="#" class="hover:text-white transition-colors">Returns & Refunds</a>
              </li>
              <li>
                <a href="#" class="hover:text-white transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="text-white font-semibold mb-4">Legal</h4>
            <ul class="space-y-2 text-sm">
              <li>
                <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" class="hover:text-white transition-colors">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {{ currentYear }} Electrofy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
})
export class Footer {
  currentYear = new Date().getFullYear();
}

