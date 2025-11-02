import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { AccountSidebar } from '../../components/account-sidebar/account-sidebar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account',
  imports: [RouterLink, MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatIcon, AccountSidebar],
  template: `
    <div class="mx-auto max-w-[1200px] py-4 md:py-6 px-4">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">My Account</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <app-account-sidebar />
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3 space-y-6">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Account Overview</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              @if (authService.currentUser(); as user) {
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <img src="https://ui-avatars.com/api/?name={{user.name}}" alt="Profile" class="w-10 h-10 border-2 border-gray-200 rounded-full">
                    </div>
                    <div>
                      <h3 class="text-xl font-semibold text-gray-900">{{ user.name }}</h3>
                      <p class="text-gray-600">{{ user.email }}</p>
                    </div>
                  </div>
                </div>
              }
            </mat-card-content>
          </mat-card>

          <!-- Quick Links -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <mat-card class="cursor-pointer hover:shadow-lg transition-all" [routerLink]="['/orders']">
              <mat-card-content class="flex items-center gap-4 p-6">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <mat-icon class="text-blue-600">shopping_bag</mat-icon>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">My Orders</h3>
                  <p class="text-sm text-gray-600">View order history</p>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="cursor-pointer hover:shadow-lg transition-all" [routerLink]="['/wishlist']">
              <mat-card-content class="flex items-center gap-4 p-6">
                <div class="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <mat-icon class="text-pink-600">favorite</mat-icon>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">Wishlist</h3>
                  <p class="text-sm text-gray-600">Saved items</p>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="cursor-pointer hover:shadow-lg transition-all" [routerLink]="['/account/addresses']">
              <mat-card-content class="flex items-center gap-4 p-6">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <mat-icon class="text-green-600">home</mat-icon>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">Addresses</h3>
                  <p class="text-sm text-gray-600">Manage addresses</p>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="cursor-pointer hover:shadow-lg transition-all" [routerLink]="['/account/profile']">
              <mat-card-content class="flex items-center gap-4 p-6">
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <mat-icon class="text-purple-600">settings</mat-icon>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">Profile Settings</h3>
                  <p class="text-sm text-gray-600">Edit profile</p>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `
})
export class Account {
  authService = inject(AuthService);
}

