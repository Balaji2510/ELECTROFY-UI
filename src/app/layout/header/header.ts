import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderActions } from "../header-actions/header-actions";
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { electrofyStore } from '../../electrofy-store';
import { Router, RouterLink } from "@angular/router";
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, HeaderActions, MatIcon, MatIconButton, RouterLink],
  template: `
    <mat-toolbar class="w-full elevated py-4">
      @if (router.url !== '/sign-in' && router.url !== '/sign-up') {
        <div class="mr-4">
          <button matIconButton aria-label="Toggle Sidebar" (click)="toggleSidebar()">
            <mat-icon>menu</mat-icon>
          </button>
        </div>
      }
      <div class="max-w-[1200px] mx-auto w-full flex items-center justify-between" routerLink="/products/all">ELECTROFY</div>
      <app-header-actions></app-header-actions>
    </mat-toolbar>
  `,
  styles: ``
})
export class Header {
  store = inject(electrofyStore);
  router = inject(Router);

  toggleSidebar() {
    this.store.toggleSidebar();
  }

}
