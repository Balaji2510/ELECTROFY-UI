import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel, MatError, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { Toaster } from '../../services/toaster';

@Component({
  selector: 'app-forgot-password',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatError,
    MatHint,
    MatInput,
    MatButton,
    MatIcon
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <mat-card class="max-w-md w-full">
        <mat-card-header>
          <mat-card-title class="text-2xl font-bold text-center">Forgot Password</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="text-gray-600 text-center mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <mat-form-field>
              <mat-label>Email Address</mat-label>
              <input matInput formControlName="email" type="email" placeholder="your.email@example.com" required>
              <mat-icon matPrefix>email</mat-icon>
              @if (forgotPasswordForm.get('email')?.hasError('required') && forgotPasswordForm.get('email')?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (forgotPasswordForm.get('email')?.hasError('email') && forgotPasswordForm.get('email')?.touched) {
                <mat-error>Please enter a valid email address</mat-error>
              }
              <mat-hint>We'll send reset instructions to this email</mat-hint>
            </mat-form-field>

            <button
              matButton="filled"
              color="primary"
              type="submit"
              [disabled]="forgotPasswordForm.invalid || submitting()"
              class="w-full text-base py-3"
            >
              @if (submitting()) {
                <span>Sending...</span>
              } @else {
                <span class="flex items-center justify-center gap-2">
                  <mat-icon>send</mat-icon>
                  <span>Send Reset Link</span>
                </span>
              }
            </button>
          </form>

          @if (emailSent()) {
            <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-start gap-3">
                <mat-icon class="text-green-600">check_circle</mat-icon>
                <div>
                  <p class="font-semibold text-green-900 mb-1">Email Sent!</p>
                  <p class="text-sm text-green-700">
                    We've sent password reset instructions to <strong>{{ forgotPasswordForm.value.email }}</strong>
                  </p>
                  <p class="text-xs text-green-600 mt-2">
                    Please check your email and follow the instructions to reset your password.
                  </p>
                </div>
              </div>
            </div>
          }

          <div class="mt-6 text-center">
            <a routerLink="/sign-in" class="text-blue-600 hover:underline text-sm">
              <mat-icon class="!text-base align-middle">arrow_back</mat-icon>
              Back to Sign In
            </a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ForgotPassword {
  private router = inject(Router);
  private apiService = inject(ApiService);
  private toaster = inject(Toaster);
  private fb = inject(FormBuilder);

  forgotPasswordForm: FormGroup;
  submitting = signal(false);
  emailSent = signal(false);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.submitting.set(true);
      this.apiService.post('/auth/forgot-password', {
        email: this.forgotPasswordForm.value.email
      }).subscribe({
        next: (response) => {
          if (response.success) {
            this.emailSent.set(true);
            this.toaster.success('Password reset email sent successfully');
          } else {
            this.toaster.error(response.error || 'Failed to send reset email');
          }
          this.submitting.set(false);
        },
        error: (err) => {
          this.toaster.error(err.message || 'Failed to send reset email');
          this.submitting.set(false);
        }
      });
    }
  }
}
