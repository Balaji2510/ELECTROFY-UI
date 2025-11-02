import { Component, input, output, computed } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CouponInput } from '../coupon-input/coupon-input';

@Component({
  selector: 'app-order-summary',
  imports: [MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatButton, MatIcon, CouponInput],
  template: `
    <mat-card class="sticky top-24">
      <mat-card-header>
        <mat-card-title>Order Summary</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="space-y-4">
          <!-- Items Count -->
          <div class="flex justify-between text-gray-600">
            <span>Subtotal ({{ itemCount() }} {{ itemCount() === 1 ? 'item' : 'items' }})</span>
            <span class="font-medium">&#8377;{{ subtotal().toLocaleString('en-IN') }}</span>
          </div>

          <!-- Shipping -->
          <div class="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span class="font-medium">
              @if (shippingCost() === 0) {
                <span class="text-green-600">Free</span>
              } @else {
                &#8377;{{ shippingCost().toLocaleString('en-IN') }}
              }
            </span>
          </div>

          <!-- Discount -->
          @if (discount() > 0) {
            <div class="flex justify-between text-green-600">
              <span>Discount</span>
              <span class="font-medium">-&#8377;{{ discount().toLocaleString('en-IN') }}</span>
            </div>
          }

          <!-- Tax -->
          <div class="flex justify-between text-gray-600">
            <span>Tax</span>
            <span class="font-medium">&#8377;{{ tax().toLocaleString('en-IN') }}</span>
          </div>

          <!-- Divider -->
          <div class="border-t border-gray-200 pt-4">
            <div class="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>&#8377;{{ total().toLocaleString('en-IN') }}</span>
            </div>
          </div>

          <!-- Coupon Input -->
          @if (showCoupon()) {
            <app-coupon-input
              [subtotal]="subtotal()"
              (couponApplied)="onCouponApplied($event)"
              (couponRemoved)="onCouponRemoved()"
            />
          }

          <!-- Action Button -->
          @if (showActionButton()) {
            <button
              matButton="filled"
              color="primary"
              [disabled]="disabled()"
              (click)="action.emit()"
              class="w-full text-base py-3"
            >
              <mat-icon>{{ actionIcon() }}</mat-icon>
              {{ actionLabel() }}
            </button>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `
})
export class OrderSummary {
  subtotal = input.required<number>();
  shippingCost = input<number>(0);
  tax = input<number>(0);
  discount = input<number>(0);
  itemCount = input.required<number>();
  showCoupon = input<boolean>(true);
  showActionButton = input<boolean>(true);
  actionLabel = input<string>('Proceed to Payment');
  actionIcon = input<string>('arrow_forward');
  disabled = input<boolean>(false);

  action = output<void>();
  couponApplied = output<number>();
  couponRemoved = output<void>();

  total = computed(() => {
    return Math.max(0, this.subtotal() + this.shippingCost() + this.tax() - this.discount());
  });

  onCouponApplied(discount: number) {
    this.couponApplied.emit(discount);
  }

  onCouponRemoved() {
    this.couponRemoved.emit();
  }
}

