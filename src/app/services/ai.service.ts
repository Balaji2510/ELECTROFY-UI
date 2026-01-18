import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';

@Injectable({ providedIn: 'root' })
export class AiService {
    constructor(private apiService: ApiService) {
    }

    chat(message: string, userId?: string): Observable<{ reply: string }> {
        return this.apiService.post<{ reply: string }>('/ai/chat', { message, userId }).pipe(
            map((response: ApiResponse<{ reply: string }>) => {
                if (response.success && response.data) {
                    return response.data;
                }
                throw new Error(response.error || 'Failed to get AI reply');
            })
        );
    }

    recommend(userInterests: string, userId?: string): Observable<{ recommendations: string[] }> {
        return this.apiService.post<{ recommendations: string[] }>('/ai/recommend', { userInterests, userId }).pipe(
            map((response: ApiResponse<{ recommendations: string[] }>) => {
                if (response.success && response.data) {
                    return response.data
                }
                throw new Error(response.error);
            })
        );
    }
    generateDescription(productName: string, productCategory: string, userId?: string): Observable<{ description: string }> {
        return this.apiService.post<{ description: string }>('/ai/description', { productName, productCategory, userId }).pipe(
            map((response: ApiResponse<{ description: string }>) => {
                if (response.success && response.data) {
                    return response.data
                }
                throw new Error(response.error);
            })
        );
    }



}