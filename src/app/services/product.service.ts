import { Injectable } from '@angular/core';
import { ApiService, ApiResponse } from './api.service';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product';

export interface ProductFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private apiService: ApiService) {}

  /**
   * Get all products with filters
   */
  getProducts(filters?: ProductFilters): Observable<Product[]> {
    const params: any = {};
    
    if (filters?.category && filters.category !== 'all') {
      params.category = filters.category;
    }
    if (filters?.search) {
      params.search = filters.search;
    }
    if (filters?.page) {
      params.page = filters.page;
    }
    if (filters?.limit) {
      params.limit = filters.limit;
    }
    if (filters?.status) {
      params.status = filters.status;
    }
    if (filters?.featured !== undefined) {
      params.featured = filters.featured;
    }
    if (filters?.minPrice !== undefined) {
      params.minPrice = filters.minPrice;
    }
    if (filters?.maxPrice !== undefined) {
      params.maxPrice = filters.maxPrice;
    }

    return this.apiService.get<ProductsResponse>('/products', params).pipe(
      map((response) => {
        if (response.success && response.data) {
          // Transform API products to match UI Product interface
          return this.transformProducts(response.data || []);
        }
        return [];
      })
    );
  }

  /**
   * Get product by ID
   */
  getProductById(id: string): Observable<Product | null> {
    return this.apiService.get<any>(`/products/${id}`).pipe(
      map((response) => {
        if (response.success && response.data) {
          return this.transformProduct(response.data);
        }
        return null;
      })
    );
  }

  /**
   * Transform API product to UI Product format
   */
  private transformProduct(apiProduct: any): Product {
    return {
      id: apiProduct._id || apiProduct.id,
      name: apiProduct.name,
      description: apiProduct.description,
      price: apiProduct.basePrice || apiProduct.price,
      imageUrl: apiProduct.images?.[0] || '',
      images: apiProduct.images || [],
      isFavorite: false, // Will be set by wishlist
      rating: apiProduct.averageRating || 0,
      ratingsCount: apiProduct.ratingCount || 0,
      inStock: (apiProduct.totalStock || 0) > 0,
      category: (apiProduct.category as any)?.name || apiProduct.category || '',
    };
  }

  /**
   * Transform array of products
   */
  private transformProducts(apiProducts: any): Product[] {
    return apiProducts.map((product: any) => this.transformProduct(product));
  }
}

