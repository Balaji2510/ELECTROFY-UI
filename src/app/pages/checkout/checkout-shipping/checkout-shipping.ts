import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ShippingAddressForm } from '../../../components/shipping-address-form/shipping-address-form';
import { ShippingAddressCard } from '../../../components/shipping-address-card/shipping-address-card';
import { OrderSummary } from '../../../components/order-summary/order-summary';
import { ShippingAddressService } from '../../../services/shipping-address.service';
import { electrofyStore } from '../../../electrofy-store';
import { Toaster } from '../../../services/toaster';
import { ShippingAddress } from '../../../models/shipping-address';

@Component({
  selector: 'app-checkout-shipping',
  imports: [
    MatButton,
    MatIcon,
    ShippingAddressForm,
    ShippingAddressCard,
    OrderSummary
  ],
  template: `
    <div class="mx-auto max-w-[1200px] py-4 md:py-6 px-4">
      <div class="mb-6">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
        <div class="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
          <span class="font-medium">Shipping Address</span>
          <mat-icon class="!text-base">chevron_right</mat-icon>
          <span class="text-gray-400">Payment</span>
          <mat-icon class="!text-base">chevron_right</mat-icon>
          <span class="text-gray-400">Confirmation</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Shipping Address Section -->
        <div class="lg:col-span-2 space-y-6">
          @if (showForm()) {
            <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-gray-900">
                  {{ editingAddress() ? 'Edit Address' : 'Add New Address' }}
                </h2>
                @if (addresses().length > 0) {
                  <button
                    matButton="text"
                    (click)="showForm.set(false)"
                  >
                    Cancel
                  </button>
                }
              </div>
              <app-shipping-address-form
                [address]="editingAddress()"
                [showCancel]="addresses().length > 0"
                (submit)="saveAddress($event)"
                (cancel)="showForm.set(false); editingAddress.set(null)"
              />
            </div>
          } @else {
            <div class="space-y-4">
              @if (addresses().length > 0) {
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-gray-900">Select Shipping Address</h2>
                    <button
                      matButton="outlined"
                      (click)="showForm.set(true)"
                    >
                      <mat-icon class="!text-base">add</mat-icon>
                      Add New Address
                    </button>
                  </div>
                  <div class="space-y-4">
                    @for (address of addresses(); track address._id || address.id) {
                      <app-shipping-address-card
                        [address]="address"
                        [selected]="selectedAddressId() === (address._id || address.id)"
                        [selectable]="true"
                        [showActions]="true"
                        (select)="selectAddress(address)"
                        (edit)="editAddress(address)"
                        (delete)="deleteAddress(address)"
                        (setDefault)="setDefaultAddress(address)"
                      />
                    }
                  </div>
                </div>
              } @else {
                <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center">
                  <mat-icon class="text-6xl text-gray-300 mb-4">home</mat-icon>
                  <h2 class="text-xl font-bold text-gray-900 mb-2">No Address Saved</h2>
                  <p class="text-gray-600 mb-4">Add a shipping address to continue</p>
                  <button
                    matButton="filled"
                    color="primary"
                    (click)="showForm.set(true)"
                  >
                    <mat-icon class="!text-base">add</mat-icon>
                    Add Address
                  </button>
                </div>
              }
            </div>
          }
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <app-order-summary
            [subtotal]="subtotal()"
            [shippingCost]="0"
            [tax]="tax()"
            [discount]="0"
            [itemCount]="itemCount()"
            [showCoupon]="false"
            [showActionButton]="true"
            [actionLabel]="'Continue to Payment'"
            [actionIcon]="'arrow_forward'"
            [disabled]="!selectedAddressId()"
            (action)="continueToPayment()"
          />
        </div>
      </div>
    </div>
  `
})
export class CheckoutShipping implements OnInit {
  private router = inject(Router);
  private addressService = inject(ShippingAddressService);
  private store = inject(electrofyStore);
  private toaster = inject(Toaster);

  addresses = signal<ShippingAddress[]>([]);
  selectedAddressId = signal<string | null>(null);
  showForm = signal(false);
  editingAddress = signal<ShippingAddress | null>(null);

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
    this.loadAddresses();
    if (this.store.cartItems().length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  async loadAddresses() {
    try {
      this.addressService.getAddresses().subscribe({
        next: (addresses) => {
          this.addresses.set(addresses);
          const defaultAddress = addresses.find(a => a.isDefault);
          if (defaultAddress) {
            this.selectedAddressId.set(defaultAddress._id || defaultAddress.id || null);
          } else if (addresses.length > 0) {
            this.selectedAddressId.set(addresses[0]._id || addresses[0].id || null);
          }
        },
        error: (err) => {
          console.error('Failed to load addresses:', err);
        }
      });
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  }

  selectAddress(address: ShippingAddress) {
    const id = address._id || address.id;
    if (id) {
      this.selectedAddressId.set(id);
    }
  }

  saveAddress(addressData: ShippingAddress) {
    const editing = this.editingAddress();
    if (editing && (editing._id || editing.id)) {
      // Update existing address
      const id = editing._id || editing.id || '';
      this.addressService.updateAddress(id, addressData).subscribe({
        next: () => {
          this.toaster.success('Address updated successfully');
          this.loadAddresses();
          this.showForm.set(false);
          this.editingAddress.set(null);
        },
        error: (err) => {
          this.toaster.error(err.message || 'Failed to update address');
        }
      });
    } else {
      // Create new address
      this.addressService.createAddress(addressData).subscribe({
        next: (newAddress) => {
          this.toaster.success('Address saved successfully');
          this.addresses.update(addrs => [...addrs, newAddress]);
          this.selectedAddressId.set(newAddress._id || newAddress.id || null);
          this.showForm.set(false);
        },
        error: (err) => {
          this.toaster.error(err.message || 'Failed to save address');
        }
      });
    }
  }

  editAddress(address: ShippingAddress) {
    this.editingAddress.set(address);
    this.showForm.set(true);
  }

  deleteAddress(address: ShippingAddress) {
    const id = address._id || address.id;
    if (id && confirm('Are you sure you want to delete this address?')) {
      this.addressService.deleteAddress(id).subscribe({
        next: () => {
          this.toaster.success('Address deleted');
          this.addresses.update(addrs => addrs.filter(a => (a._id || a.id) !== id));
          if (this.selectedAddressId() === id) {
            this.selectedAddressId.set(null);
          }
        },
        error: (err) => {
          this.toaster.error(err.message || 'Failed to delete address');
        }
      });
    }
  }

  setDefaultAddress(address: ShippingAddress) {
    const id = address._id || address.id;
    if (id) {
      this.addressService.setDefaultAddress(id).subscribe({
        next: () => {
          this.toaster.success('Default address updated');
          this.loadAddresses();
        },
        error: (err) => {
          this.toaster.error(err.message || 'Failed to set default address');
        }
      });
    }
  }

  continueToPayment() {
    if (this.selectedAddressId()) {
      // Store selected address in session storage for payment page
      sessionStorage.setItem('checkout_address_id', this.selectedAddressId()!);
      this.router.navigate(['/checkout/payment']);
    } else {
      this.toaster.error('Please select a shipping address');
    }
  }
}

