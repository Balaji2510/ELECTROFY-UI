import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { OrderCard } from '../../components/order-card/order-card';
import { OrderService } from '../../services/order.service';
import { Toaster } from '../../services/toaster';
import { Order } from '../../models/order';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'all';

@Component({
  selector: 'app-orders',
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
    MatSelect,
    MatOption,
    MatFormField,
    MatLabel,
    OrderCard
  ],
  template: `
    <div class="mx-auto max-w-[1200px] py-4 md:py-6 px-4">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
        
        <!-- Filter -->
        <mat-form-field class="w-full md:w-auto">
          <mat-label>Filter by Status</mat-label>
          <mat-select [value]="statusFilter()" (selectionChange)="statusFilter.set($event.value)">
            <mat-option value="all">All Orders</mat-option>
            <mat-option value="pending">Pending</mat-option>
            <mat-option value="confirmed">Confirmed</mat-option>
            <mat-option value="processing">Processing</mat-option>
            <mat-option value="shipped">Shipped</mat-option>
            <mat-option value="delivered">Delivered</mat-option>
            <mat-option value="cancelled">Cancelled</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      @if (loading()) {
        <div class="space-y-4">
          @for (item of [1,2,3]; track item) {
            <div class="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div class="skeleton h-6 w-1/4 mb-4"></div>
              <div class="skeleton h-4 w-1/2"></div>
            </div>
          }
        </div>
      } @else if (filteredOrders().length === 0) {
        <div class="bg-white rounded-lg p-12 text-center border border-gray-100">
          <mat-icon class="text-6xl text-gray-300 mb-4">shopping_bag</mat-icon>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h2>
          <p class="text-gray-600 mb-6">
            @if (statusFilter() !== 'all') {
              You don't have any {{ statusFilter() }} orders.
            } @else {
              You haven't placed any orders yet.
            }
          </p>
          <button matButton="filled" color="primary" routerLink="/products/all">
            <mat-icon class="!text-base">shopping_bag</mat-icon>
            Start Shopping
          </button>
        </div>
      } @else {
        <div class="space-y-4">
          @for (order of filteredOrders(); track order._id || order.id) {
            <app-order-card
              [order]="order"
              (cancel)="cancelOrder(order)"
            />
          }
        </div>
      }
    </div>
  `
})
export class Orders implements OnInit {
  private orderService = inject(OrderService);
  private toaster = inject(Toaster);

  orders = signal<Order[]>([]);
  statusFilter = signal<OrderStatus>('all');
  loading = signal(true);

  filteredOrders = computed(() => {
    const orders = this.orders();
    const filter = this.statusFilter();
    
    if (filter === 'all') {
      return orders;
    }
    
    return orders.filter(order => order.status === filter);
  });

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err) => {
        this.toaster.error(err.message || 'Failed to load orders');
        this.loading.set(false);
      }
    });
  }

  cancelOrder(order: Order) {
    const orderId = order._id || order.id;
    if (orderId && confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.toaster.success('Order cancelled successfully');
          this.loadOrders();
        },
        error: (err) => {
          this.toaster.error(err.message || 'Failed to cancel order');
        }
      });
    }
  }
}

