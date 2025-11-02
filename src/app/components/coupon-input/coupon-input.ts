import { Component, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CouponService } from '../../services/coupon.service';
import { Toaster } from '../../services/toaster';

@Component({
  selector: 'app-coupon-input',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatButton,
    MatIcon
  ],
  template: `
    <div class="border border-gray-200 rounded-lg p-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Have a coupon code?
      </label>
      
      @if (!appliedCoupon()) {
        <form [formGroup]="couponForm" (ngSubmit)="applyCoupon()" class="flex gap-2">
          <mat-form-field class="flex-1">
            <mat-label>Enter coupon code</mat-label>
            <input matInput formControlName="code" placeholder="SAVE10" [disabled]="validating()">
            @if (couponForm.get('code')?.hasError('required') && couponForm.get('code')?.touched) {
              <mat-error>Coupon code is required</mat-error>
            }
          </mat-form-field>
          <button
            matButton="outlined"
            type="submit"
            [disabled]="couponForm.invalid || validating()"
          >
            @if (validating()) {
              <span>Applying...</span>
            } @else {
              <span>Apply</span>
            }
          </button>
        </form>
      } @else {
        <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div class="flex items-center gap-2">
            <mat-icon class="text-green-600">check_circle</mat-icon>
            <div>
              <p class="text-sm font-medium text-green-900">
                {{ appliedCoupon()?.code }} Applied
              </p>
              @if (discountAmount() > 0) {
                <p class="text-xs text-green-700">
                  You saved &#8377;{{ discountAmount().toLocaleString('en-IN') }}
                </p>
              }
            </div>
          </div>
          <button
            matIconButton
            (click)="removeCoupon()"
            class="!text-green-700"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>
      }
      
      @if (error()) {
        <p class="text-sm text-red-500 mt-2">{{ error() }}</p>
      }
    </div>
  `
})
export class CouponInput {
  subtotal = input.required<number>();

  couponApplied = output<number>();
  couponRemoved = output<void>();

  couponForm: FormGroup;
  validating = signal(false);
  appliedCoupon = signal<any>(null);
  discountAmount = signal(0);
  error = signal<string>('');

  constructor(
    private fb: FormBuilder,
    private couponService: CouponService,
    private toaster: Toaster
  ) {
    this.couponForm = this.fb.group({
      code: ['', [Validators.required]]
    });
  }

  applyCoupon() {
    if (this.couponForm.valid) {
      this.validating.set(true);
      this.error.set('');
      const code = this.couponForm.value.code.toUpperCase();

      this.couponService.validateCoupon(code, this.subtotal()).subscribe({
        next: (response) => {
          if (response.valid && response.coupon && response.discount) {
            this.appliedCoupon.set(response.coupon);
            this.discountAmount.set(response.discount);
            this.couponApplied.emit(response.discount);
            this.toaster.success('Coupon applied successfully!');
            this.couponForm.reset();
          } else {
            this.error.set(response.error || 'Invalid coupon code');
          }
          this.validating.set(false);
        },
        error: (err) => {
          this.error.set(err.message || 'Failed to validate coupon');
          this.validating.set(false);
        }
      });
    }
  }

  removeCoupon() {
    this.appliedCoupon.set(null);
    this.discountAmount.set(0);
    this.couponRemoved.emit();
    this.toaster.success('Coupon removed');
  }
}

