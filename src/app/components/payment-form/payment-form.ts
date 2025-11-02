import { Component, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';

@Component({
  selector: 'app-payment-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatButton,
    MatRadioGroup,
    MatRadioButton
  ],
  template: `
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Payment Method</h3>
      
      <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Payment Method Selection -->
        <mat-radio-group formControlName="paymentMethod" class="flex flex-col gap-4">
          <mat-radio-button value="card" class="border border-gray-200 rounded-lg p-4">
            <div class="ml-3">
              <div class="font-medium text-gray-900">Credit/Debit Card</div>
              <div class="text-sm text-gray-500">Pay securely using your card</div>
            </div>
          </mat-radio-button>
          
          <mat-radio-button value="upi" class="border border-gray-200 rounded-lg p-4">
            <div class="ml-3">
              <div class="font-medium text-gray-900">UPI</div>
              <div class="text-sm text-gray-500">Pay using UPI ID or QR code</div>
            </div>
          </mat-radio-button>
          
          <mat-radio-button value="netbanking" class="border border-gray-200 rounded-lg p-4">
            <div class="ml-3">
              <div class="font-medium text-gray-900">Net Banking</div>
              <div class="text-sm text-gray-500">Pay using your bank account</div>
            </div>
          </mat-radio-button>
          
          <mat-radio-button value="cod" class="border border-gray-200 rounded-lg p-4">
            <div class="ml-3">
              <div class="font-medium text-gray-900">Cash on Delivery</div>
              <div class="text-sm text-gray-500">Pay when you receive</div>
            </div>
          </mat-radio-button>
        </mat-radio-group>

        <!-- Card Details (if card selected) -->
        @if (paymentForm.value.paymentMethod === 'card') {
          <div class="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
            <mat-form-field>
              <mat-label>Card Number</mat-label>
              <input matInput formControlName="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19">
              @if (paymentForm.get('cardNumber')?.invalid && paymentForm.get('cardNumber')?.touched) {
                <mat-error>Valid card number is required</mat-error>
              }
            </mat-form-field>

            <div class="grid grid-cols-2 gap-4">
              <mat-form-field>
                <mat-label>Expiry Date</mat-label>
                <input matInput formControlName="expiryDate" placeholder="MM/YY" maxlength="5">
              </mat-form-field>

              <mat-form-field>
                <mat-label>CVV</mat-label>
                <input matInput formControlName="cvv" type="password" placeholder="123" maxlength="4">
              </mat-form-field>
            </div>

            <mat-form-field>
              <mat-label>Cardholder Name</mat-label>
              <input matInput formControlName="cardholderName" placeholder="John Doe">
            </mat-form-field>
          </div>
        }

        <!-- UPI ID (if UPI selected) -->
        @if (paymentForm.value.paymentMethod === 'upi') {
          <mat-form-field>
            <mat-label>UPI ID</mat-label>
            <input matInput formControlName="upiId" placeholder="yourname@upi">
          </mat-form-field>
        }

        <!-- Submit Button -->
        <button
          matButton="filled"
          color="primary"
          type="submit"
          [disabled]="paymentForm.invalid || submitting()"
          class="w-full text-base py-3"
        >
          @if (submitting()) {
            <span>Processing...</span>
          } @else {
            <span>Place Order</span>
          }
        </button>

        <p class="text-xs text-gray-500 text-center">
          Your payment information is secure and encrypted
        </p>
      </form>
    </div>
  `
})
export class PaymentForm {
  submit = output<{
    paymentMethod: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardholderName?: string;
    upiId?: string;
  }>();

  paymentForm: FormGroup;
  submitting = signal(false);

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['cod', [Validators.required]],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      cardholderName: [''],
      upiId: ['']
    });

    // Add validators conditionally based on payment method
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      const cardNumber = this.paymentForm.get('cardNumber');
      const expiryDate = this.paymentForm.get('expiryDate');
      const cvv = this.paymentForm.get('cvv');
      const cardholderName = this.paymentForm.get('cardholderName');
      const upiId = this.paymentForm.get('upiId');

      if (method === 'card') {
        cardNumber?.setValidators([Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]);
        expiryDate?.setValidators([Validators.required]);
        cvv?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
        cardholderName?.setValidators([Validators.required]);
        upiId?.clearValidators();
      } else if (method === 'upi') {
        upiId?.setValidators([Validators.required, Validators.email]);
        cardNumber?.clearValidators();
        expiryDate?.clearValidators();
        cvv?.clearValidators();
        cardholderName?.clearValidators();
      } else {
        cardNumber?.clearValidators();
        expiryDate?.clearValidators();
        cvv?.clearValidators();
        cardholderName?.clearValidators();
        upiId?.clearValidators();
      }

      cardNumber?.updateValueAndValidity();
      expiryDate?.updateValueAndValidity();
      cvv?.updateValueAndValidity();
      cardholderName?.updateValueAndValidity();
      upiId?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      this.submitting.set(true);
      const formValue = this.paymentForm.value;
      
      // Format card number if provided
      if (formValue.cardNumber) {
        formValue.cardNumber = formValue.cardNumber.replace(/\s/g, '');
      }

      this.submit.emit(formValue);
    }
  }
}

