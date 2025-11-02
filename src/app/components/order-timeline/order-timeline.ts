import { Component, input, computed } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Order } from '../../models/order';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface TimelineStep {
  status: OrderStatus;
  label: string;
  icon: string;
  completed: boolean;
  current: boolean;
  date?: Date;
}

@Component({
  selector: 'app-order-timeline',
  imports: [MatIcon],
  template: `
    <div class="relative">
      <div class="flex flex-col gap-4">
        @for (step of timelineSteps(); track step.status) {
          <div class="flex items-start gap-4">
            <!-- Icon -->
            <div [class]="iconClasses(step)" class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center">
              @if (step.completed) {
                <mat-icon class="!text-sm">check</mat-icon>
              } @else {
                <mat-icon class="!text-sm">{{ step.icon }}</mat-icon>
              }
            </div>
            
            <!-- Content -->
            <div class="flex-1 pb-4">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-semibold text-gray-900">{{ step.label }}</h4>
                @if (step.current) {
                  <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Current</span>
                }
              </div>
              @if (step.date) {
                <p class="text-sm text-gray-600">
                  {{ formatDate(step.date) }}
                </p>
              } @else if (step.completed) {
                <p class="text-sm text-gray-500">Completed</p>
              } @else {
                <p class="text-sm text-gray-400">Not yet reached</p>
              }
            </div>
            
            <!-- Connector Line -->
            @if (!$last) {
              <div [class]="connectorClasses(step)" class="absolute left-[19px] w-0.5 h-full mt-10"></div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
    }
  `
})
export class OrderTimeline {
  order = input.required<Order>();

  timelineSteps = computed<TimelineStep[]>(() => {
    const order = this.order();
    const status = order.status;
    
    // Handle cancelled/refunded orders
    if (status === 'cancelled' || status === 'refunded') {
      const cancelledStep: TimelineStep = {
        status: status,
        label: status === 'cancelled' ? 'Order Cancelled' : 'Order Refunded',
        icon: status === 'cancelled' ? 'cancel' : 'undo',
        completed: true,
        current: false,
        date: order.cancelledAt || order.updatedAt
      };
      return [cancelledStep];
    }
    
    const steps: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentStatusIndex = steps.indexOf(status);
    
    return steps.map((stepStatus, index) => {
      const completed = index <= currentStatusIndex;
      const current = index === currentStatusIndex;
      
      const labels: Record<OrderStatus, string> = {
        pending: 'Order Placed',
        confirmed: 'Order Confirmed',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
        refunded: 'Refunded'
      };
      
      const icons: Record<OrderStatus, string> = {
        pending: 'schedule',
        confirmed: 'check_circle',
        processing: 'build',
        shipped: 'local_shipping',
        delivered: 'done',
        cancelled: 'cancel',
        refunded: 'undo'
      };
      
      let date: Date | undefined;
      if (stepStatus === 'pending') date = order.createdAt;
      if (stepStatus === 'delivered' && order.deliveredAt) date = order.deliveredAt;
      if (stepStatus === 'shipped' && order.updatedAt) {
        // Approximate shipped date as updatedAt if status is shipped or delivered
        if (status === 'shipped' || status === 'delivered') {
          date = order.updatedAt;
        }
      }
      
      return {
        status: stepStatus,
        label: labels[stepStatus],
        icon: icons[stepStatus],
        completed,
        current,
        date
      };
    });
  });

  iconClasses(step: TimelineStep): string {
    if (step.completed) {
      return 'bg-green-500 text-white';
    } else if (step.current) {
      return 'bg-blue-500 text-white';
    } else {
      return 'bg-gray-200 text-gray-400';
    }
  }

  connectorClasses(step: TimelineStep): string {
    return step.completed ? 'bg-green-500' : 'bg-gray-200';
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

