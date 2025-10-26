import { Component, input } from '@angular/core';
import { MatAnchor } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-back-button',
  imports: [MatAnchor, RouterLink, MatIcon],
  template: `
  <button matButton="text" [routerLink]="navigate()??null" class="flex items-center gap-2"> 
  <mat-icon>arrow_back</mat-icon> 
  <ng-content></ng-content>
  </button>
  `,
  styles: `
  :host {
    display: block;
  }
  `
})
export class BackButton {

  label = input('');
  navigate = input<string | null | undefined>();

}
