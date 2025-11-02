import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel, MatError, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { Toaster } from '../../services/toaster';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (!password || !confirmPassword) {
    return null;
  }
  
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-reset-password',
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
          <mat-card-title class="text-2xl font-bold text-center">Reset Password</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="text-gray-600 text-center mb-6">
            Enter your new password below.
          </p>

          <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <mat-form-field>
              <mat-label>New Password</mat-label>
              <input 
                matInput 
                formControlName="password" 
                [type]="showPassword() ? 'text' : 'password'"
                required
              >
              <mat-icon matPrefix>lock</mat-icon>
              <span matSuffix>
                <button
                  matIconButton
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                >
                  <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </span>
              @if (resetPasswordForm.get('password')?.hasError('required') && resetPasswordForm.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
              @if (resetPasswordForm.get('password')?.hasError('minlength') && resetPasswordForm.get('password')?.touched) {
                <mat-error>Password must be at least 8 characters</mat-error>
              }
              <mat-hint>Must be at least 8 characters long</mat-hint>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Confirm New Password</mat-label>
              <input 
                matInput 
                formControlName="confirmPassword" 
                [type]="showConfirmPassword() ? 'text' : 'password'"
                required
              >
              <mat-icon matPrefix>lock</mat-icon>
              <span matSuffix>
                <button
                  matIconButton
                  type="button"
                  (click)="showConfirmPassword.set(!showConfirmPassword())"
                >
                  <mat-icon>{{ showConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </span>
              @if (resetPasswordForm.get('confirmPassword')?.hasError('required') && resetPasswordForm.get('confirmPassword')?.touched) {
                <mat-error>Please confirm your password</mat-error>
              }
              @if (resetPasswordForm.hasError('passwordMismatch') && resetPasswordForm.get('confirmPassword')?.touched) {
                <mat-error>Passwords do not match</mat-error>
              }
            </mat-form-field>

            <button
              matButton="filled"
              color="primary"
              type="submit"
              [disabled]="resetPasswordForm.invalid || submitting()"
              class="w-full text-base py-3"
            >
              @if (submitting()) {
                <span>Resetting...</span>
              } @else {
                <span class="flex items-center justify-center">
                  <mat-icon class="!text-base align-middle">lock_reset</mat-icon>
                  <span>Reset Password</span>
                </span>
              }
            </button>
          </form>

          @if (resetSuccess()) {
            <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-start gap-3">
                <mat-icon class="text-green-600">check_circle</mat-icon>
                <div>
                  <p class="font-semibold text-green-900 mb-1">Password Reset Successful!</p>
                  <p class="text-sm text-green-700">
                    Your password has been reset successfully. You can now sign in with your new password.
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
export class ResetPassword implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private toaster = inject(Toaster);
  private fb = inject(FormBuilder);

  resetPasswordForm: FormGroup;
  submitting = signal(false);
  resetSuccess = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  token = signal<string | null>(null);

  constructor() {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.token.set(token);
      } else {
        this.toaster.error('Invalid reset link. Please request a new password reset.');
        this.router.navigate(['/forgot-password']);
      }
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && this.token()) {
      this.submitting.set(true);
      this.apiService.post('/auth/reset-password', {
        token: this.token(),
        password: this.resetPasswordForm.value.password
      }).subscribe({
        next: (response) => {
          if (response.success) {
            this.resetSuccess.set(true);
            this.toaster.success('Password reset successfully');
            setTimeout(() => {
              this.router.navigate(['/sign-in']);
            }, 2000);
          } else {
            this.toaster.error(response.error || 'Failed to reset password');
          }
          this.submitting.set(false);
        },
        error: (err) => {
          this.toaster.error(err.message || 'Failed to reset password');
          this.submitting.set(false);
        }
      });
    }
  }
}
