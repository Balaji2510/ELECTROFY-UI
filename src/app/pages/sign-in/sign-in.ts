import { AfterViewInit, Component, NgZone, inject } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatFormField, MatLabel } from "@angular/material/form-field";
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
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatFormField, MatInput, MatButton, MatDivider, MatIcon, MatLabel, ReactiveFormsModule, RouterLink],
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
            </mat-form-field>
            <mat-form-field class="w-full" appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" placeholder="Enter your password">
            </mat-form-field>
            <button mat-flat-button color="primary" class="w-full" [disabled]="signInForm.invalid">Sign In</button>
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

  onSubmit() {
    if (this.signInForm.valid) {
      console.log('Form Submitted!', this.signInForm.value);
      // Handle sign-in logic here
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

  private handleCredentialResponse(response: any) {
    // Here you would handle the credential response.
    // This usually involves sending the credential (response.credential) to your backend for verification.
    console.log('Encoded JWT ID token: ' + response.credential);
    
    // Decode the JWT token to get user information
    const decodedToken = this.decodeJwt(response.credential);
    console.log('Decoded JWT payload:', decodedToken);
    
    // Set user in AuthService
    this.authService.setCurrentUser(decodedToken);
    
    // For now, let's navigate to another route on successful sign-in, inside NgZone
    this.ngZone.run(() => {
      this.router.navigate(['/products/all']);
    });
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
