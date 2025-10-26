import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderActions } from "../header-actions/header-actions";
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { electrofyStore } from '../../electrofy-store';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, HeaderActions,MatIcon,MatIconButton],
  template: `
    <mat-toolbar class="w-full elevated py-4">
      <div class="mr-4">
        <button matIconButton aria-label="Toggle Sidebar" (click)="toggleSidebar()">
          <mat-icon>menu</mat-icon>
        </button>
      </div>
      <div class="max-w-[1200px] mx-auto w-full flex items-center justify-between">ELECTROFY</div>
      <app-header-actions></app-header-actions>
    </mat-toolbar>
  `,
  styles: ``
})
export class Header {
  store = inject(electrofyStore);

  toggleSidebar() {
    this.store.toggleSidebar();
  }

}
