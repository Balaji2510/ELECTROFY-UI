import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order';
import { Toaster } from '../../../services/toaster';

@Component({
  selector: 'app-checkout-confirmation',
  imports: [RouterLink, MatButton, MatIcon],
  template: `
    <div class="mx-auto max-w-[800px] py-4 md:py-6 px-4">
      @if (order()) {
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <mat-icon class="text-green-600 !text-5xl">check_circle</mat-icon>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p class="text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="border-b border-gray-200 pb-4 mb-4">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Order Details</h2>
            <p class="text-gray-600">
              Order Number: <span class="font-semibold text-gray-900">{{ order()!.orderNumber }}</span>
            </p>
            <p class="text-sm text-gray-500 mt-1">
              Placed on {{ formatDate(order()!.createdAt) }}
            </p>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium">&#8377;{{ order()!.subtotal.toLocaleString('en-IN') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Shipping</span>
              <span class="font-medium">
                @if (order()!.shippingCost === 0) {
                  <span class="text-green-600">Free</span>
                } @else {
                  &#8377;{{ order()!.shippingCost.toLocaleString('en-IN') }}
                }
              </span>
            </div>
            @if (order()!.discount > 0) {
              <div class="flex justify-between text-green-600">
                <span>Discount</span>
                <span class="font-medium">-&#8377;{{ order()!.discount.toLocaleString('en-IN') }}</span>
              </div>
            }
            <div class="flex justify-between">
              <span class="text-gray-600">Tax</span>
              <span class="font-medium">&#8377;{{ order()!.tax.toLocaleString('en-IN') }}</span>
            </div>
            <div class="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>&#8377;{{ order()!.total.toLocaleString('en-IN') }}</span>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 class="font-semibold text-gray-900 mb-2">What's Next?</h3>
          <ul class="space-y-2 text-sm text-gray-700">
            <li class="flex items-start gap-2">
              <mat-icon class="!text-base text-blue-600">mail</mat-icon>
              <span>You will receive an order confirmation email shortly.</span>
            </li>
            <li class="flex items-start gap-2">
              <mat-icon class="!text-base text-blue-600">local_shipping</mat-icon>
              <span>We'll send you tracking information once your order ships.</span>
            </li>
            <li class="flex items-start gap-2">
              <mat-icon class="!text-base text-blue-600">schedule</mat-icon>
              <span>Expected delivery: 3-5 business days</span>
            </li>
          </ul>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            matButton="outlined"
            [routerLink]="['/orders', order()!._id || order()!.id]"
            class="flex-1 sm:flex-none"
          >
            <mat-icon>visibility</mat-icon>
            View Order Details
          </button>
          <button
            matButton="filled"
            color="primary"
            routerLink="/products/all"
            class="flex-1 sm:flex-none"
          >
            <mat-icon>shopping_bag</mat-icon>
            Continue Shopping
          </button>
        </div>
      } @else if (loading()) {
        <div class="text-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading order details...</p>
        </div>
      } @else {
        <div class="text-center py-20">
          <mat-icon class="text-6xl text-gray-300 mb-4">error_outline</mat-icon>
          <h2 class="text-2xl font-bold text-gray-700 mb-2">Order Not Found</h2>
          <p class="text-gray-500 mb-6">The order you're looking for doesn't exist.</p>
          <button matButton="filled" color="primary" routerLink="/orders">
            View My Orders
          </button>
        </div>
      }
    </div>
  `
})
export class CheckoutConfirmation implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private toaster = inject(Toaster);

  order = signal<Order | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const orderId = params.get('orderId');
      if (orderId) {
        this.loadOrder(orderId);
      }
    });
  }

  loadOrder(orderId: string) {
    this.loading.set(true);
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        if (order) {
          this.order.set(order);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.toaster.error(err.message || 'Failed to load order');
        this.loading.set(false);
      }
    });
  }

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  }
}

