import { AfterViewInit, Component, NgZone, inject, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from "@angular/router";

declare const google: any;

@Component({
  selector: 'app-sign-in',
  imports: [MatCard, MatCardHeader, MatCardContent, MatFormField, MatInput, MatButton, MatDivider, MatLabel, MatError, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex items-center justify-center h-full p-4 bg-gray-100">
      <mat-card class="w-full max-w-md">
        <mat-card-header>
          <!-- <mat-card-title class="text-center text-2xl font-bold">Sign In to Your Account</mat-card-title> -->
        </mat-card-header>
        <mat-card-content>
          <!-- This div will be used to render the Google Sign-In button -->
          <div id="google-btn" class="flex justify-center"></div>
          <div class="flex items-center my-4">
            <mat-divider class="flex-grow"></mat-divider>
            <span class="mx-4 text-gray-500">OR</span>
            <mat-divider class="flex-grow"></mat-divider>
          </div>
          <form [formGroup]="signInForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter your email">
              @if (signInForm.get('email')?.invalid && signInForm.get('email')?.touched) {
                <mat-error>
                  @if (signInForm.get('email')?.errors?.['required']) {
                    Email is required
                  } @else if (signInForm.get('email')?.errors?.['email']) {
                    Please enter a valid email
                  }
                </mat-error>
              }
            </mat-form-field>
            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" placeholder="Enter your password">
              @if (signInForm.get('password')?.invalid && signInForm.get('password')?.touched) {
                <mat-error>
                  Password is required
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
              [disabled]="signInForm.invalid || isLoading()"
              type="submit">
              @if (isLoading()) {
                <span>Signing In...</span>
              } @else {
                <span>Sign In</span>
              }
            </button>
          </form>
          <div class="text-center mt-4">
            <a routerLink="/forgot-password" class="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <div class="text-center mt-2">
            <span class="text-sm">Don't have an account? <a routerLink="/sign-up" class="text-blue-600 hover:underline">Sign Up</a></span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: ``
})
export class SignIn implements AfterViewInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private authService = inject(AuthService);

  signInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoading = signal(false);
  errorMessage = signal<string>('');

  async onSubmit() {
    if (this.signInForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      try {
        const { email, password } = this.signInForm.value;
        await this.authService.login(email!, password!);

        
        // Redirect to products page on success
        this.ngZone.run(() => {
          this.router.navigate(['/products/all']);
        });
      } catch (error: any) {
        this.errorMessage.set(error.message || 'Login failed. Please check your credentials.');
        console.error('Login error:', error);
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  ngAfterViewInit(): void {
    this.loadGoogleApiScript();
  }

  private loadGoogleApiScript() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = this.initializeGoogleSignIn.bind(this);
    document.head.appendChild(script);
  }

  private initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: '495788996928-kooncmg3ejr3tljcju0kkqmv81e13nv1.apps.googleusercontent.com', // Replace with your actual client ID
      callback: this.handleCredentialResponse.bind(this)
    });
    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'outline', size: 'large', width: '500' }
    );
  }

  private async handleCredentialResponse(response: any) {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      // Decode the JWT token to get user information
      const decodedToken = this.decodeJwt(response.credential);
      console.log(decodedToken);
      
      
      // Call API for Google OAuth login
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
      this.errorMessage.set(error.message || 'Google sign-in failed. Please try again.');
      console.error('Google sign-in error:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
  private decodeJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }
}
