import { Component, input, output } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ShippingAddress } from '../../models/shipping-address';

@Component({
  selector: 'app-shipping-address-card',
  imports: [MatCard, MatCardContent, MatButton, MatIcon],
  template: `
    <mat-card [class.border-2]="selected()" [class.border-blue-500]="selected()" class="cursor-pointer hover:shadow-lg transition-all">
      <mat-card-content>
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-semibold text-gray-900">
                {{ address().firstName }} {{ address().lastName }}
              </h3>
              @if (address().isDefault) {
                <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Default
                </span>
              }
              @if (address().addressType) {
                <span class="text-xs text-gray-500 capitalize">
                  {{ address().addressType }}
                </span>
              }
            </div>
            
            <p class="text-sm text-gray-700 mb-1">
              {{ address().addressLine1 }}
            </p>
            @if (address().addressLine2) {
              <p class="text-sm text-gray-700 mb-1">
                {{ address().addressLine2 }}
              </p>
            }
            <p class="text-sm text-gray-700 mb-1">
              {{ address().city }}, {{ address().state }} {{ address().zipCode }}
            </p>
            <p class="text-sm text-gray-700 mb-2">
              {{ address().country }}
            </p>
            <p class="text-sm text-gray-600">
              Phone: {{ address().phone }}
            </p>
          </div>
          
          @if (selectable()) {
            <button
              matIconButton
              (click)="select.emit()"
              [class.bg-blue-500]="selected()"
              [class.text-white]="selected()"
              class="ml-2"
            >
              <mat-icon>{{ selected() ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
            </button>
          }
        </div>
        
        @if (showActions()) {
          <div class="flex gap-2 mt-4 pt-4 border-t border-gray-200">
            <button
              matButton="outlined"
              (click)="edit.emit()"
              class="flex-1"
            >
              <mat-icon class="!text-base">edit</mat-icon>
              Edit
            </button>
            <button
              matButton="outlined"
              (click)="setDefault.emit()"
              [disabled]="address().isDefault"
              class="flex-1"
            >
              <mat-icon class="!text-base">star</mat-icon>
              Set Default
            </button>
            <button
              matButton="outlined"
              (click)="delete.emit()"
              class="!text-red-500"
            >
              <mat-icon class="!text-base">delete</mat-icon>
            </button>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `
})
export class ShippingAddressCard {
  address = input.required<ShippingAddress>();
  selected = input<boolean>(false);
  selectable = input<boolean>(false);
  showActions = input<boolean>(true);

  select = output<void>();
  edit = output<void>();
  delete = output<void>();
  setDefault = output<void>();
}

