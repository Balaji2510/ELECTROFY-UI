import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { PaymentForm } from '../../../components/payment-form/payment-form';
import { OrderSummary } from '../../../components/order-summary/order-summary';
import { ShippingAddressCard } from '../../../components/shipping-address-card/shipping-address-card';
import { ShippingAddressService } from '../../../services/shipping-address.service';
import { OrderService } from '../../../services/order.service';
import { electrofyStore } from '../../../electrofy-store';
import { Toaster } from '../../../services/toaster';
import { ShippingAddress } from '../../../models/shipping-address';

@Component({
  selector: 'app-checkout-payment',
  imports: [
    MatButton,
    MatIcon,
    PaymentForm,
    OrderSummary,
    ShippingAddressCard
  ],
  template: `
    <div class="mx-auto max-w-[1200px] py-4 md:py-6 px-4">
      <div class="mb-6">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
        <div class="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <span class="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✓</span>
          <span class="text-gray-400 line-through">Shipping Address</span>
          <mat-icon class="!text-base">chevron_right</mat-icon>
          <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
          <span class="font-medium">Payment</span>
          <mat-icon class="!text-base">chevron_right</mat-icon>
          <span class="text-gray-400">Confirmation</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Payment Section -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Shipping Address Review -->
          @if (selectedAddress()) {
            <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
              <app-shipping-address-card
                [address]="selectedAddress()!"
                [selectable]="false"
                [showActions]="false"
              />
              <button
                matButton="text"
                (click)="router.navigate(['/checkout/shipping'])"
                class="mt-4"
              >
                Change Address
              </button>
            </div>
          }

          <!-- Payment Form -->
          <app-payment-form (submit)="placeOrder($event)" />
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <app-order-summary
            [subtotal]="subtotal()"
            [shippingCost]="0"
            [tax]="tax()"
            [discount]="discount()"
            [itemCount]="itemCount()"
            [showCoupon]="true"
            [showActionButton]="false"
            (couponApplied)="discount.set($event)"
            (couponRemoved)="discount.set(0)"
          />
        </div>
      </div>
    </div>
  `
})
export class CheckoutPayment implements OnInit {
  router = inject(Router);
  private addressService = inject(ShippingAddressService);
  private orderService = inject(OrderService);
  private store = inject(electrofyStore);
  private toaster = inject(Toaster);

  selectedAddress = signal<ShippingAddress | null>(null);
  discount = signal(0);
  placingOrder = signal(false);

  subtotal = computed(() => {
    return this.store.cartItems().reduce((sum, item) => sum + item.price, 0);
  });

  tax = computed(() => {
    return Math.round(this.subtotal() * 0.18);
  });

  itemCount = computed(() => {
    return this.store.cartItems().length;
  });

  ngOnInit() {
    const addressId = sessionStorage.getItem('checkout_address_id');
    if (addressId) {
      this.loadAddress(addressId);
    } else {
      this.router.navigate(['/checkout/shipping']);
    }

    if (this.store.cartItems().length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  loadAddress(addressId: string) {
    this.addressService.getAddressById(addressId).subscribe({
      next: (address) => {
        if (address) {
          this.selectedAddress.set(address);
        } else {
          this.router.navigate(['/checkout/shipping']);
        }
      },
      error: () => {
        this.router.navigate(['/checkout/shipping']);
      }
    });
  }

  placeOrder(paymentData: any) {
    const address = this.selectedAddress();
    if (!address || !address._id && !address.id) {
      this.toaster.error('Shipping address is required');
      return;
    }

    this.placingOrder.set(true);
    const addressId = address._id || address.id || '';

    this.orderService.createOrder({
      shippingAddress: addressId,
      paymentMethod: paymentData.paymentMethod,
      couponCode: undefined, // Would come from coupon input
      notes: ''
    }).subscribe({
      next: (order) => {
        this.toaster.success('Order placed successfully!');
        sessionStorage.removeItem('checkout_address_id');
        this.store.clearCartItems();
        this.router.navigate(['/checkout/confirmation', order._id || order.id]);
      },
      error: (err) => {
        this.toaster.error(err.message || 'Failed to place order');
        this.placingOrder.set(false);
      }
    });
  }
}

