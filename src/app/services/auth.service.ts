import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, ApiResponse } from './api.service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  picture?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());
  
  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = computed(() => this.currentUserSignal() !== null);

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    // Check if user is still valid on service initialization
    if (this.currentUserSignal()) {
      this.checkAuthStatus();
    }
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Register new user
   */
  async register(name: string, email: string, password: string): Promise<void> {
    try {
      const response = await this.apiService.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
      }).toPromise();

      if (response?.success && response.data) {
        this.handleAuthSuccess(response.data);
      } else {
        throw new Error(response?.error || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<void> {
    try {
      const response = await this.apiService.post<AuthResponse>('/auth/login', {
        email,
        password,
      }).toPromise();

      if (response?.success && response.data) {
        this.handleAuthSuccess(response.data);
      } else {
        throw new Error(response?.error || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  /**
   * Google OAuth login
   */
  async loginWithGoogle(googleUser: { name: string; email: string; picture: string; id: string }): Promise<void> {
    console.log(googleUser)
    try {
      const response = await this.apiService.post<AuthResponse>('/auth/oauth/google', {
        providerId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      }).toPromise();

      if (response?.success && response.data) {
        this.handleAuthSuccess(response.data);
      } else {
        throw new Error(response?.error || 'Google login failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Google login failed');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await this.apiService.post('/auth/logout', { refreshToken }).toPromise();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
      this.router.navigate(['/sign-in']);
    }
  }

  /**
   * Get current user from API
   */
  async getCurrentUser(): Promise<void> {
    try {
      const response = await this.apiService.get<User>('/auth/me').toPromise();
      if (response?.success && response.data) {
        this.setCurrentUser(response.data);
      }
    } catch (error) {
      this.clearAuth();
    }
  }

  /**
   * Check authentication status
   */
  private async checkAuthStatus(): Promise<void> {
    const token = localStorage.getItem('accessToken');
    if (token) {
      await this.getCurrentUser();
    } else {
      this.clearAuth();
    }
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(data: AuthResponse): void {
    this.apiService.setAccessToken(data.accessToken);
    this.apiService.setRefreshToken(data.refreshToken);
    this.setCurrentUser(data.user);
    
  }

  /**
   * Set current user
   */
  setCurrentUser(user: User | null): void {
    this.currentUserSignal.set(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  /**
   * Clear authentication
   */
  private clearAuth(): void {
    this.apiService.clearTokens();
    this.setCurrentUser(null);
  }

  /**
   * Legacy method for backward compatibility
   */
  getUserFromSession(): User | null {
    return this.getUserFromStorage();
  }
}
