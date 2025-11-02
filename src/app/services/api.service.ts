import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, window } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string;


  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  /**
   * Get authorization headers
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const token = this.getAccessToken();
    const sessionId = this.getSessionId();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (sessionId) {
      headers = headers.set('X-Session-Id', sessionId);
    }

    return headers;
  }

  /**
   * Get access token from localStorage
   */
  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Get or create session ID for guest users
   */
  private getSessionId(): string {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set access token
   */
  setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  /**
   * Set refresh token
   */
  setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  /**
   * Clear tokens
   */
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders(),
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http
      .put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http
      .delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Error handler
   */
  private handleError = (error: any): Observable<never> => {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.error || error.error?.message || error.message || errorMessage;
    }

    return throwError(() => new Error(errorMessage));
  };
}
