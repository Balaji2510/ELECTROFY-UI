import { Component, input, output, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AuthService, User } from '../../services/auth.service';
import { MatHint } from '@angular/material/form-field';

@Component({
  selector: 'app-profile-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatButton,
    MatHint
  ],
  template: `
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Profile Information</h3>
      
      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <mat-form-field>
          <mat-label>Full Name <span class="text-red-500">*</span></mat-label>
          <input matInput formControlName="name" required>
          @if (profileForm.get('name')?.hasError('required') && profileForm.get('name')?.touched) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" [disabled]="true">
          <mat-hint>Email cannot be changed</mat-hint>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Phone Number</mat-label>
          <input matInput formControlName="phone" type="tel" placeholder="+91 9876543210">
        </mat-form-field>

        <div class="flex gap-3">
          <button
            matButton="filled"
            color="primary"
            type="submit"
            [disabled]="profileForm.invalid || submitting()"
            class="flex-1"
          >
            @if (submitting()) {
              <span>Updating...</span>
            } @else {
              <span>Update Profile</span>
            }
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProfileForm {
  user = input<User | null>(null);
  
  submit = output<{
    name: string;
    phone?: string;
  }>();

  profileForm: FormGroup;
  submitting = signal(false);

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [{ value: '', disabled: true }],
      phone: ['']
    });

    // Update form when user input changes
    effect(() => {
      const user = this.user();
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          phone: (user as any).phone || ''
        });
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.submitting.set(true);
      const formValue = this.profileForm.getRawValue();
      this.submit.emit({
        name: formValue.name,
        phone: formValue.phone || undefined
      });
    }
  }
}

