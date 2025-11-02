import { Component, input, computed } from '@angular/core';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

@Component({
  selector: 'app-order-status-badge',
  imports: [],
  template: `
    <span [class]="badgeClasses()">
      {{ statusLabel() }}
    </span>
  `
})
export class OrderStatusBadge {
  status = input.required<OrderStatus>();

  statusLabel = computed(() => {
    const status = this.status();
    const labels: Record<OrderStatus, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
    };
    return labels[status] || status;
  });

  badgeClasses = computed(() => {
    const status = this.status();
    const baseClasses = 'text-xs font-semibold px-2 py-1 rounded-full';
    
    const statusColors: Record<OrderStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      processing: 'bg-purple-100 text-purple-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700'
    };
    
    return `${baseClasses} ${statusColors[status] || 'bg-gray-100 text-gray-700'}`;
  });
}

