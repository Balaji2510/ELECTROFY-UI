import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { OrderTimeline } from '../../../components/order-timeline/order-timeline';
import { OrderItemsList } from '../../../components/order-items-list/order-items-list';
import { TrackingInfo } from '../../../components/tracking-info/tracking-info';
import { OrderStatusBadge } from '../../../components/order-status-badge/order-status-badge';
import { ShippingAddressCard } from '../../../components/shipping-address-card/shipping-address-card';
import { BackButton } from '../../../components/back-button/back-button';
import { OrderService } from '../../../services/order.service';
import { Toaster } from '../../../services/toaster';
import { Order } from '../../../models/order';

@Component({
  selector: 'app-order-detail',
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
    OrderTimeline,
    OrderItemsList,
    TrackingInfo,
    OrderStatusBadge,
    ShippingAddressCard,
    BackButton
  ],
  template: `
    <div class="mx-auto max-w-[1200px] py-4 md:py-6 px-4">
      <div class="mb-6">
        <app-back-button navigate="/orders">Back to Orders</app-back-button>
      </div>

      @if (loading()) {
        <div class="animate-pulse space-y-6">
          <div class="skeleton h-8 w-1/4"></div>
          <div class="skeleton h-64 w-full"></div>
        </div>
      } @else if (order()) {
        <div class="space-y-6">
          <!-- Order Header -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 class="text-2xl font-bold text-gray-900 mb-2">
                  Order #{{ order()!.orderNumber }}
                </h1>
                <p class="text-gray-600">
                  Placed on {{ formatDate(order()!.createdAt) }}
                </p>
              </div>
              <app-order-status-badge [status]="order()!.status" />
            </div>

            <!-- Order Timeline -->
            <div class="border-t border-gray-200 pt-6">
              <app-order-timeline [order]="order()!" />
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Order Items -->
            <div class="lg:col-span-2 space-y-6">
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
                <app-order-items-list [items]="order()!.items" />
              </div>

              <!-- Tracking Information -->
              @if (order()!.status === 'shipped' || order()!.status === 'delivered') {
                <div class="bg-white rounded-lg shadow-md p-6">
                  <app-tracking-info
                    [trackingNumber]="order()!.trackingNumber"
                    [shippingMethod]="order()!.shippingMethod"
                  />
                </div>
              }
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1 space-y-6">
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                <div class="space-y-3">
                  <div class="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span class="font-medium">&#8377;{{ order()!.subtotal.toLocaleString('en-IN') }}</span>
                  </div>
                  <div class="flex justify-between text-gray-600">
                    <span>Shipping</span>
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
                  <div class="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span class="font-medium">&#8377;{{ order()!.tax.toLocaleString('en-IN') }}</span>
                  </div>
                  <div class="border-t border-gray-200 pt-3">
                    <div class="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>&#8377;{{ order()!.total.toLocaleString('en-IN') }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Shipping Address -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
                @if (order()!.shippingAddress) {
                  <app-shipping-address-card
                    [address]="order()!.shippingAddress"
                    [selectable]="false"
                    [showActions]="false"
                  />
                }
              </div>

              <!-- Actions -->
              @if (canCancel()) {
                <div class="bg-white rounded-lg shadow-md p-6">
                  <button
                    matButton="outlined"
                    color="warn"
                    (click)="cancelOrder()"
                    class="w-full"
                  >
                    <mat-icon>cancel</mat-icon>
                    Cancel Order
                  </button>
                </div>
              }
            </div>
          </div>
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
export class OrderDetail implements OnInit {
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

  canCancel(): boolean {
    const order = this.order();
    if (!order) return false;
    return order.status === 'pending' || order.status === 'confirmed';
  }

  cancelOrder() {
    const order = this.order();
    if (!order) return;

    const orderId = order._id || order.id;
    if (orderId && confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.toaster.success('Order cancelled successfully');
          this.loadOrder(orderId);
        },
        error: (err) => {
          this.toaster.error(err.message || 'Failed to cancel order');
        }
      });
    }
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

