import { Injectable } from '@angular/core';
import { ApiService, ApiResponse } from './api.service';
import { Observable, map } from 'rxjs';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  isActive: boolean;
  children?: Category[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService) {}

  /**
   * Get all categories
   */
  getCategories(): Observable<Category[]> {
    return this.apiService.get<Category[]>('/categories').pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return [];
      })
    );
  }

  /**
   * Get category by slug
   */
  getCategoryBySlug(slug: string): Observable<Category | null> {
    return this.apiService.get<Category>(`/categories/slug/${slug}`).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        return null;
      })
    );
  }
}

