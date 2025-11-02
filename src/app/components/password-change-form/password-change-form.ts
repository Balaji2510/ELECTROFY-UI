import { Component, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormField, MatLabel, MatError, MatHint, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  
  if (!password || !confirmPassword) {
    return null;
  }
  
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-password-change-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatHint,
    MatInput,
    MatButton,
    MatIconButton,
    MatIcon,
    MatSuffix
  ],
  template: `
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Change Password</h3>
      
      <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <mat-form-field>
          <mat-label>Current Password <span class="text-red-500">*</span></mat-label>
          <input 
            matInput 
            formControlName="currentPassword" 
            [type]="showCurrentPassword() ? 'text' : 'password'"
            required
          >
          <span matSuffix>
            <button
              matIconButton
              type="button"
              (click)="showCurrentPassword.set(!showCurrentPassword())"
            >
              <mat-icon>{{ showCurrentPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </span>
          @if (passwordForm.get('currentPassword')?.hasError('required') && passwordForm.get('currentPassword')?.touched) {
            <mat-error>Current password is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>New Password <span class="text-red-500">*</span></mat-label>
          <input 
            matInput 
            formControlName="newPassword" 
            [type]="showNewPassword() ? 'text' : 'password'"
            required
          >
          <span matSuffix>
            <button
              matIconButton
              type="button"
              (click)="showNewPassword.set(!showNewPassword())"
            >
              <mat-icon>{{ showNewPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </span>
          @if (passwordForm.get('newPassword')?.hasError('required') && passwordForm.get('newPassword')?.touched) {
            <mat-error>New password is required</mat-error>
          }
          @if (passwordForm.get('newPassword')?.hasError('minlength') && passwordForm.get('newPassword')?.touched) {
            <mat-error>Password must be at least 8 characters</mat-error>
          }
          <mat-hint>Must be at least 8 characters long</mat-hint>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Confirm New Password <span class="text-red-500">*</span></mat-label>
          <input 
            matInput 
            formControlName="confirmPassword" 
            [type]="showConfirmPassword() ? 'text' : 'password'"
            required
          >
          <span matSuffix>
            <button
              matIconButton
              type="button"
              (click)="showConfirmPassword.set(!showConfirmPassword())"
            >
              <mat-icon>{{ showConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </span>
          @if (passwordForm.get('confirmPassword')?.hasError('required') && passwordForm.get('confirmPassword')?.touched) {
            <mat-error>Please confirm your password</mat-error>
          }
          @if (passwordForm.hasError('passwordMismatch') && passwordForm.get('confirmPassword')?.touched) {
            <mat-error>Passwords do not match</mat-error>
          }
        </mat-form-field>

        <div class="flex gap-3">
          <button
            matButton="filled"
            color="primary"
            type="submit"
            [disabled]="passwordForm.invalid || submitting()"
            class="flex-1"
          >
            @if (submitting()) {
              <span>Updating...</span>
            } @else {
              <span>Change Password</span>
            }
          </button>
        </div>
      </form>
    </div>
  `
})
export class PasswordChangeForm {
  submit = output<{
    currentPassword: string;
    newPassword: string;
  }>();

  passwordForm: FormGroup;
  submitting = signal(false);
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.submitting.set(true);
      const formValue = this.passwordForm.value;
      this.submit.emit({
        currentPassword: formValue.currentPassword,
        newPassword: formValue.newPassword
      });
    }
  }
}

