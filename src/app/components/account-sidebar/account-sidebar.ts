import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatNavList, MatListItem, MatListItemTitle } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account-sidebar',
  imports: [RouterLink, RouterLinkActive, MatNavList, MatListItem, MatListItemTitle, MatIcon],
  template: `
    <nav class="bg-white rounded-lg shadow-sm p-4">
      <mat-nav-list>
        <a mat-list-item routerLink="/account" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          <mat-icon matListItemIcon>dashboard</mat-icon>
          <span matListItemTitle>Dashboard</span>
        </a>
        
        <a mat-list-item routerLink="/account/profile" routerLinkActive="active">
          <mat-icon matListItemIcon>
            <img src="https://ui-avatars.com/api/?name={{authService.currentUser()?.name}}" alt="Profile" class="w-10 h-10 border-2 border-gray-200 rounded-full">
          </mat-icon>
          <span matListItemTitle>Profile</span>
        </a>
        
        <a mat-list-item routerLink="/orders" routerLinkActive="active">
          <mat-icon matListItemIcon>shopping_bag</mat-icon>
          <span matListItemTitle>Orders</span>
        </a>
        
        <a mat-list-item routerLink="/account/addresses" routerLinkActive="active">
          <mat-icon matListItemIcon>home</mat-icon>
          <span matListItemTitle>Addresses</span>
        </a>
        
        <a mat-list-item routerLink="/wishlist" routerLinkActive="active">
          <mat-icon matListItemIcon>favorite</mat-icon>
          <span matListItemTitle>Wishlist</span>
        </a>
      </mat-nav-list>
    </nav>
  `,
  styles: `
    .active {
      background-color: rgba(59, 130, 246, 0.1);
      color: rgb(59, 130, 246);
    }
  `
})
export class AccountSidebar {
  authService = inject(AuthService);
}

