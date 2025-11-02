import { Component, input, output } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Order } from '../../models/order';
import { OrderStatusBadge } from '../order-status-badge/order-status-badge';

@Component({
  selector: 'app-order-card',
  imports: [MatCard, MatCardContent, MatButton, MatIcon, RouterLink, OrderStatusBadge],
  template: `
    <mat-card class="hover:shadow-lg transition-all">
      <mat-card-content>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- Order Info -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="font-semibold text-gray-900">
                Order #{{ order().orderNumber }}
              </h3>
              <app-order-status-badge [status]="order().status" />
            </div>
            
            <p class="text-sm text-gray-600 mb-2">
              Placed on {{ formatDate(order().createdAt) }}
            </p>
            
            <!-- Order Items Preview -->
            <div class="flex items-center gap-2 mb-2">
              @for (item of order().items.slice(0, 3); track item._id || item.product._id) {
                <img
                  [src]="item.image || item.product.images?.[0] || '/assets/placeholder.jpg'"
                  [alt]="item.productName"
                  class="w-12 h-12 object-cover rounded border border-gray-200"
                >
              }
              @if (order().items.length > 3) {
                <div class="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-600">
                  +{{ order().items.length - 3 }}
                </div>
              }
            </div>
            
            <p class="text-sm text-gray-600">
              {{ order().items.length }} {{ order().items.length === 1 ? 'item' : 'items' }} • 
              Total: <span class="font-semibold text-gray-900">&#8377;{{ order().total.toLocaleString('en-IN') }}</span>
            </p>
          </div>
          
          <!-- Actions -->
          <div class="flex flex-col gap-2">
            <button
              matButton="outlined"
              [routerLink]="['/orders', order()._id || order().id]"
              class="w-full md:w-auto"
            >
              <mat-icon class="!text-base">visibility</mat-icon>
              View Details
            </button>
            
            @if (canCancel()) {
              <button
                matButton="outlined"
                (click)="cancel.emit()"
                class="!text-red-500 w-full md:w-auto"
              >
                <mat-icon class="!text-base">cancel</mat-icon>
                Cancel Order
              </button>
            }
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `
})
export class OrderCard {
  order = input.required<Order>();

  cancel = output<void>();

  canCancel(): boolean {
    const status = this.order().status;
    return status === 'pending' || status === 'confirmed';
  }

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(d);
  }
}

