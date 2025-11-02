import { Component, input, output, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelect, MatOption } from '@angular/material/select';
import { ShippingAddress } from '../../models/shipping-address';

@Component({
  selector: 'app-shipping-address-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatButton,
    MatCheckbox,
    MatSelect,
    MatOption
  ],
  template: `
    <form [formGroup]="addressForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- First Name -->
        <mat-form-field>
          <mat-label>First Name <span class="text-red-500">*</span></mat-label>
          <input matInput formControlName="firstName" required>
          @if (addressForm.get('firstName')?.hasError('required') && addressForm.get('firstName')?.touched) {
            <mat-error>First name is required</mat-error>
          }
        </mat-form-field>

        <!-- Last Name -->
        <mat-form-field>
          <mat-label>Last Name <span class="text-red-500">*</span></mat-label>
          <input matInput formControlName="lastName" required>
          @if (addressForm.get('lastName')?.hasError('required') && addressForm.get('lastName')?.touched) {
            <mat-error>Last name is required</mat-error>
          }
        </mat-form-field>
      </div>

      <!-- Phone -->
      <mat-form-field>
        <mat-label>Phone Number <span class="text-red-500">*</span></mat-label>
        <input matInput formControlName="phone" type="tel" placeholder="+91 9876543210" required>
        @if (addressForm.get('phone')?.hasError('required') && addressForm.get('phone')?.touched) {
          <mat-error>Phone number is required</mat-error>
        }
        @if (addressForm.get('phone')?.hasError('pattern') && addressForm.get('phone')?.touched) {
          <mat-error>Please enter a valid phone number</mat-error>
        }
      </mat-form-field>

      <!-- Address Line 1 -->
      <mat-form-field>
        <mat-label>Address Line 1 <span class="text-red-500">*</span></mat-label>
        <input matInput formControlName="addressLine1" placeholder="Street address, P.O. box" required>
        @if (addressForm.get('addressLine1')?.hasError('required') && addressForm.get('addressLine1')?.touched) {
          <mat-error>Address is required</mat-error>
        }
      </mat-form-field>

      <!-- Address Line 2 -->
      <mat-form-field>
        <mat-label>Address Line 2 (Optional)</mat-label>
        <input matInput formControlName="addressLine2" placeholder="Apartment, suite, unit, building, floor, etc.">
      </mat-form-field>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- City -->
        <mat-form-field>
          <mat-label>City <span class="text-red-500">*</span></mat-label>
          <input matInput formControlName="city" required>
          @if (addressForm.get('city')?.hasError('required') && addressForm.get('city')?.touched) {
            <mat-error>City is required</mat-error>
          }
        </mat-form-field>

        <!-- State -->
        <mat-form-field>
          <mat-label>State <span class="text-red-500">*</span></mat-label>
          <input matInput formControlName="state" required>
          @if (addressForm.get('state')?.hasError('required') && addressForm.get('state')?.touched) {
            <mat-error>State is required</mat-error>
          }
        </mat-form-field>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Zip Code -->
        <mat-form-field>
          <mat-label>ZIP Code <span class="text-red-500">*</span></mat-label>
          <input matInput formControlName="zipCode" required>
          @if (addressForm.get('zipCode')?.hasError('required') && addressForm.get('zipCode')?.touched) {
            <mat-error>ZIP code is required</mat-error>
          }
        </mat-form-field>

        <!-- Country -->
        <mat-form-field>
          <mat-label>Country <span class="text-red-500">*</span></mat-label>
          <mat-select formControlName="country" required>
            <mat-option value="India">India</mat-option>
            <mat-option value="United States">United States</mat-option>
            <mat-option value="United Kingdom">United Kingdom</mat-option>
            <mat-option value="Canada">Canada</mat-option>
            <mat-option value="Australia">Australia</mat-option>
          </mat-select>
          @if (addressForm.get('country')?.hasError('required') && addressForm.get('country')?.touched) {
            <mat-error>Country is required</mat-error>
          }
        </mat-form-field>
      </div>

      <!-- Address Type -->
      <mat-form-field>
        <mat-label>Address Type</mat-label>
        <mat-select formControlName="addressType">
          <mat-option value="home">Home</mat-option>
          <mat-option value="work">Work</mat-option>
          <mat-option value="other">Other</mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Set as Default -->
      <mat-checkbox formControlName="isDefault">
        Set as default address
      </mat-checkbox>

      <!-- Submit Button -->
      <div class="flex gap-3">
        <button
          matButton="filled"
          color="primary"
          type="submit"
          [disabled]="addressForm.invalid || submitting()"
          class="flex-1"
        >
          @if (submitting()) {
            <span>Saving...</span>
          } @else {
            <span>{{ editMode() ? 'Update Address' : 'Save Address' }}</span>
          }
        </button>
        @if (showCancel()) {
          <button
            matButton="outlined"
            type="button"
            (click)="cancel.emit()"
          >
            Cancel
          </button>
        }
      </div>
    </form>
  `
})
export class ShippingAddressForm implements OnInit {
  address = input<ShippingAddress | null>(null);
  showCancel = input<boolean>(false);
  
  submit = output<ShippingAddress>();
  cancel = output<void>();

  addressForm: FormGroup;
  editMode = signal(false);
  submitting = signal(false);

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[\d\s\+\-\(\)]+$/)]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['India', [Validators.required]],
      zipCode: ['', [Validators.required]],
      addressType: ['home'],
      isDefault: [false]
    });
  }

  ngOnInit() {
    const addr = this.address();
    if (addr) {
      this.editMode.set(true);
      this.addressForm.patchValue(addr);
    }
  }

  onSubmit() {
    if (this.addressForm.valid) {
      this.submitting.set(true);
      const formValue = this.addressForm.value;
      this.submit.emit(formValue as ShippingAddress);
    }
  }
}

