import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ShippingAddressForm } from '../../../components/shipping-address-form/shipping-address-form';
import { ShippingAddressCard } from '../../../components/shipping-address-card/shipping-address-card';
import { AccountSidebar } from '../../../components/account-sidebar/account-sidebar';
import { ShippingAddressService } from '../../../services/shipping-address.service';
import { Toaster } from '../../../services/toaster';
import { ShippingAddress } from '../../../models/shipping-address';

@Component({
  selector: 'app-addresses',
  imports: [MatButton, MatIcon, ShippingAddressForm, ShippingAddressCard, AccountSidebar],
  template: `
    <div class="mx-auto max-w-[1200px] py-4 md:py-6 px-4">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Manage Addresses</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <app-account-sidebar />
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3 space-y-6">
          @if (showForm()) {
            <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-gray-900">
                  {{ editingAddress() ? 'Edit Address' : 'Add New Address' }}
                </h2>
                <button
                  matButton="text"
                  (click)="showForm.set(false); editingAddress.set(null)"
                >
                  Cancel
                </button>
              </div>
              <app-shipping-address-form
                [address]="editingAddress()"
                [showCancel]="true"
                (submit)="saveAddress($event)"
                (cancel)="showForm.set(false); editingAddress.set(null)"
              />
            </div>
          } @else {
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold text-gray-900">Saved Addresses</h2>
                <button
                  matButton="filled"
                  color="primary"
                  (click)="showForm.set(true)"
                >
                  <mat-icon class="!text-base">add</mat-icon>
                  Add New Address
                </button>
              </div>

              @if (addresses().length === 0) {
                <div class="bg-white rounded-lg p-12 text-center border border-gray-100">
                  <mat-icon class="text-6xl text-gray-300 mb-4">home</mat-icon>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">No Addresses</h3>
                  <p class="text-gray-600 mb-6">Add your first address to get started</p>
                  <button
                    matButton="filled"
                    color="primary"
                    (click)="showForm.set(true)"
                  >
                    <mat-icon class="!text-base">add</mat-icon>
                    Add Address
                  </button>
                </div>
              } @else {
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  @for (address of addresses(); track address._id || address.id) {
                    <app-shipping-address-card
                      [address]="address"
                      [selectable]="false"
                      [showActions]="true"
                      (edit)="editAddress(address)"
                      (delete)="deleteAddress(address)"
                      (setDefault)="setDefaultAddress(address)"
                    />
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class Addresses implements OnInit {
  private addressService = inject(ShippingAddressService);
  private toaster = inject(Toaster);

  addresses = signal<ShippingAddress[]>([]);
  showForm = signal(false);
  editingAddress = signal<ShippingAddress | null>(null);

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.addressService.getAddresses().subscribe({
      next: (addresses) => {
        this.addresses.set(addresses);
      },
      error: (err) => {
        console.error('Failed to load addresses:', err);
      }
    });
  }

  saveAddress(addressData: ShippingAddress) {
    const editing = this.editingAddress();
    if (editing && (editing._id || editing.id)) {
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
      this.addressService.createAddress(addressData).subscribe({
        next: () => {
          this.toaster.success('Address saved successfully');
          this.loadAddresses();
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
          this.loadAddresses();
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
}

