import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileForm } from '../../../components/profile-form/profile-form';
import { PasswordChangeForm } from '../../../components/password-change-form/password-change-form';
import { AccountSidebar } from '../../../components/account-sidebar/account-sidebar';
import { AuthService, User } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { Toaster } from '../../../services/toaster';

@Component({
  selector: 'app-profile',
  imports: [ ProfileForm, PasswordChangeForm, AccountSidebar],
  template: `
    <div class="mx-auto max-w-[1200px] py-4 md:py-6 px-4">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Profile Settings</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <app-account-sidebar />
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Profile Form -->
          <app-profile-form
            [user]="authService.currentUser()"
            (submit)="updateProfile($event)"
          />

          <!-- Password Change Form -->
          <app-password-change-form
            (submit)="changePassword($event)"
          />
        </div>
      </div>
    </div>
  `
})
export class Profile implements OnInit {
  authService = inject(AuthService);
  private apiService = inject(ApiService);
  private toaster = inject(Toaster);

  ngOnInit() {
    // Load current user if needed
    this.authService.getCurrentUser();
  }

  updateProfile(data: { name: string; phone?: string }) {
    this.apiService.put('/auth/profile', data).subscribe({
      next: (response) => {
        if (response.success) {
          this.toaster.success('Profile updated successfully');
          this.authService.getCurrentUser();
        } else {
          this.toaster.error(response.error || 'Failed to update profile');
        }
      },
      error: (err) => {
        this.toaster.error(err.message || 'Failed to update profile');
      }
    });
  }

  changePassword(data: { currentPassword: string; newPassword: string }) {
    this.apiService.put('/auth/change-password', data).subscribe({
      next: (response) => {
        if (response.success) {
          this.toaster.success('Password changed successfully');
        } else {
          this.toaster.error(response.error || 'Failed to change password');
        }
      },
      error: (err) => {
        this.toaster.error(err.message || 'Failed to change password');
      }
    });
  }
}

