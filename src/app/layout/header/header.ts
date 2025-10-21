import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderActions } from "../header-actions/header-actions";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, HeaderActions],
  template: `
    <mat-toolbar class="w-full elevated py-2">
      <div class="max-w-[1200px] mx-auto w-full flex items-center justify-between">ELECTROFY</div>
      <app-header-actions></app-header-actions>
    </mat-toolbar>
  `,
  styles: ``
})
export class Header {

}
