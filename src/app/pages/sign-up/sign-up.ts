import { AfterViewInit, Component, NgZone, inject, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from "@angular/router";

declare const google: any;

@Component({
  selector: 'app-sign-up',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatInput,
    MatButton,
    MatDivider,
    MatLabel,
    MatError,
    ReactiveFormsModule,
    RouterLink
  ],
  template: `
    <div class="flex items-center justify-center h-full p-4 bg-gray-100">
      <mat-card class="w-full max-w-md">
        <mat-card-header>
          <mat-card-title class="text-center text-2xl font-bold">Create Your Account</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <!-- Google Sign-Up Button -->
          <div id="google-btn" class="flex justify-center"></div>
          <div class="flex items-center my-4">
            <mat-divider class="flex-grow"></mat-divider>
            <span class="mx-4 text-gray-500">OR</span>
            <mat-divider class="flex-grow"></mat-divider>
          </div>
          <form [formGroup]="signUpForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="name" type="text" placeholder="Enter your full name">
              @if (signUpForm.get('name')?.invalid && signUpForm.get('name')?.touched) {
                <mat-error>
                  @if (signUpForm.get('name')?.errors?.['required']) {
                    Name is required
                  }
                </mat-error>
              }
            </mat-form-field>
            
            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter your email">
              @if (signUpForm.get('email')?.invalid && signUpForm.get('email')?.touched) {
                <mat-error>
                  @if (signUpForm.get('email')?.errors?.['required']) {
                    Email is required
                  } @else if (signUpForm.get('email')?.errors?.['email']) {
                    Please enter a valid email
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" placeholder="Enter your password">
              @if (signUpForm.get('password')?.invalid && signUpForm.get('password')?.touched) {
                <mat-error>
                  @if (signUpForm.get('password')?.errors?.['required']) {
                    Password is required
                  } @else if (signUpForm.get('password')?.errors?.['minlength']) {
                    Password must be at least 8 characters
                  } @else if (signUpForm.get('password')?.errors?.['pattern']) {
                    Password must contain uppercase, lowercase, and number
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Confirm Password</mat-label>
              <input matInput formControlName="confirmPassword" type="password" placeholder="Confirm your password">
              @if (signUpForm.get('confirmPassword')?.invalid && signUpForm.get('confirmPassword')?.touched) {
                <mat-error>
                  @if (signUpForm.get('confirmPassword')?.errors?.['required']) {
                    Please confirm your password
                  } @else if (signUpForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
                    Passwords do not match
                  }
                </mat-error>
              }
            </mat-form-field>

            @if (errorMessage()) {
              <div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ errorMessage() }}
              </div>
            }

            <button 
              mat-flat-button 
              color="primary" 
              class="w-full" 
              [disabled]="signUpForm.invalid || isLoading()"
              type="submit">
              @if (isLoading()) {
                <span>Creating Account...</span>
              } @else {
                <span>Sign Up</span>
              }
            </button>
          </form>
          <div class="text-center mt-4">
            <span class="text-sm">Already have an account? 
              <a routerLink="/sign-in" class="text-blue-600 hover:underline">Sign In</a>
            </span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: ``
})
export class SignUp implements AfterViewInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private authService = inject(AuthService);

  isLoading = signal(false);
  errorMessage = signal<string>('');

  signUpForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    ]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.signUpForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      try {
        const { name, email, password } = this.signUpForm.value;
        await this.authService.register(name!, email!, password!);
        
        // Redirect to products page on success
        this.ngZone.run(() => {
          this.router.navigate(['/products/all']);
        });
      } catch (error: any) {
        this.errorMessage.set(error.message || 'Registration failed. Please try again.');
        console.error('Registration error:', error);
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  ngAfterViewInit(): void {
    this.loadGoogleApiScript();
  }

  private loadGoogleApiScript() {
    // Check if script is already loaded
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      this.initializeGoogleSignIn();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = this.initializeGoogleSignIn.bind(this);
    document.head.appendChild(script);
  }

  private initializeGoogleSignIn() {
    if (typeof google === 'undefined') {
      console.error('Google API not loaded');
      return;
    }

    google.accounts.id.initialize({
      client_id: '495788996928-kooncmg3ejr3tljcju0kkqmv81e13nv1.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
      context: 'signup'
    });
    
    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { 
        theme: 'outline', 
        size: 'large', 
        width: '500',
        text: 'signup_with'
      }
    );
  }

  private async handleCredentialResponse(response: any) {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      // Decode the JWT token to get user information
      const decodedToken = this.decodeJwt(response.credential);
      
      // Call API for Google OAuth signup
      await this.authService.loginWithGoogle({
        id: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture
      });

      // Navigate to products page on success
      this.ngZone.run(() => {
        this.router.navigate(['/products/all']);
      });
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Google sign-up failed. Please try again.');
      console.error('Google sign-up error:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private decodeJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return {};
    }
  }
}
