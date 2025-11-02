import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ProductGallery } from '../../components/product-gallery/product-gallery';
import { VariantSelector, ProductVariant } from '../../components/variant-selector/variant-selector';
import { QuantitySelectorComponent } from '../../components/quantity-selector/quantity-selector';
import { ReviewList } from '../../components/review-list/review-list';
import { ReviewForm } from '../../components/review-form/review-form';
import { ToggleWishlistButton } from '../../components/toggle-wishlist-button/toggle-wishlist-button';
import { StarRatingComponent } from '../../components/star-rating/star-rating';
import { ProductCard } from '../../components/product-card/product-card';
import { BackButton } from '../../components/back-button/back-button';
import { ProductService } from '../../services/product.service';
import { ReviewService } from '../../services/review.service';
import { electrofyStore } from '../../electrofy-store';
import { Toaster } from '../../services/toaster';
import { Product } from '../../models/product';
import { Review } from '../../models/review';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
    ProductGallery,
    VariantSelector,
    QuantitySelectorComponent,
    ReviewList,
    ReviewForm,
    ToggleWishlistButton,
    StarRatingComponent,
    ProductCard,
    BackButton
  ],
  template: `
    <div class="mx-auto max-w-[1400px] py-4 md:py-6 px-4">
      <div class="mb-4">
        <app-back-button navigate="/products/all">Back to Products</app-back-button>
      </div>

      @if (loading()) {
        <div class="animate-pulse space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="skeleton h-[500px] w-full rounded-lg"></div>
            <div class="space-y-4">
              <div class="skeleton h-8 w-3/4"></div>
              <div class="skeleton h-6 w-1/2"></div>
              <div class="skeleton h-24 w-full"></div>
            </div>
          </div>
        </div>
      } @else if (product()) {
        <!-- Product Details -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <!-- Product Images -->
          <div>
            <app-product-gallery 
              [images]="productImages()" 
              [productName]="product()!.name"
            />
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product()!.name }}</h1>
              
              @if (product()!.rating > 0) {
                <div class="flex items-center gap-2 mb-4">
                  <app-star-rating [rating]="product()!.rating" [clickable]="false" [showNumber]="true" />
                  <span class="text-sm text-gray-600">
                    ({{ product()!.ratingsCount }} reviews)
                  </span>
                </div>
              }

              <div class="flex items-center gap-3 mb-4">
                @if (selectedVariant()) {
                  <span class="text-4xl font-bold text-gray-900">
                    &#8377;{{ selectedVariant()!.price.toLocaleString('en-IN') }}
                  </span>
                  @if (selectedVariant()!.compareAtPrice && selectedVariant()!.compareAtPrice! > selectedVariant()!.price) {
                    <span class="text-xl text-gray-500 line-through">
                      &#8377;{{ selectedVariant()!.compareAtPrice?.toLocaleString('en-IN') }}
                    </span>
                    <span class="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                      {{ getDiscountPercent() }}% off
                    </span>
                  }
                } @else {
                  <span class="text-4xl font-bold text-gray-900">
                    &#8377;{{ product()!.price.toLocaleString('en-IN') }}
                  </span>
                }
              </div>

              @if (product()!.inStock) {
                <span class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  In Stock
                </span>
              } @else {
                <span class="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  Out of Stock
                </span>
              }
            </div>

            <!-- Variant Selector -->
            @if (variants().length > 0) {
              <div>
                <app-variant-selector
                  [variants]="variants()"
                  (selectedVariantChange)="onVariantSelected($event)"
                />
              </div>
            }

            <!-- Quantity and Add to Cart -->
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <label class="text-sm font-medium text-gray-700">Quantity:</label>
                <app-quantity-selector
                  [quantity]="quantity()"
                  [min]="1"
                  [max]="99"
                  (quantityChange)="quantity.set($event)"
                />
              </div>

              <div class="flex gap-3">
                <button
                  matButton="filled"
                  color="primary"
                  [disabled]="!product()!.inStock || addingToCart()"
                  (click)="addToCart()"
                  class="flex-1 text-lg py-3"
                >
                  <mat-icon>shopping_cart</mat-icon>
                  <span>{{ addingToCart() ? 'Adding...' : 'Add to Cart' }}</span>
                </button>
                
                <app-toggle-wishlist-button [product]="product()!" />
              </div>
            </div>

            <!-- Product Description -->
            <div class="border-t border-gray-200 pt-6">
              <h2 class="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <p class="text-gray-700 whitespace-pre-wrap">{{ product()!.description }}</p>
            </div>
          </div>
        </div>

        <!-- Reviews Section -->
        <div class="border-t border-gray-200 pt-8 mb-12">
          <app-review-list
            [reviews]="reviews()"
            (markHelpfulEvent)="markReviewHelpful($event)"
          />

          @if (canReview()) {
            <div class="mt-8">
              <app-review-form
                [productId]="productId()"
                (submit)="submitReview($event)"
              />
            </div>
          }
        </div>

        <!-- Related Products -->
        @if (relatedProducts().length > 0) {
          <div class="border-t border-gray-200 pt-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              @for (relatedProduct of relatedProducts(); track relatedProduct.id) {
                <app-product-card [product]="relatedProduct" />
              }
            </div>
          </div>
        }
      } @else {
        <div class="text-center py-20">
          <mat-icon class="text-6xl text-gray-300 mb-4">inventory_2</mat-icon>
          <h2 class="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h2>
          <p class="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button matButton="filled" color="primary" routerLink="/products/all">
            Browse Products
          </button>
        </div>
      }
    </div>
  `
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private reviewService = inject(ReviewService);
  private store = inject(electrofyStore);
  private toaster = inject(Toaster);
  private authService = inject(AuthService);

  product = signal<Product | null>(null);
  variants = signal<ProductVariant[]>([]);
  selectedVariant = signal<ProductVariant | null>(null);
  quantity = signal(1);
  reviews = signal<Review[]>([]);
  relatedProducts = signal<Product[]>([]);
  loading = signal(true);
  addingToCart = signal(false);
  
  productId = computed(() => String(this.product()?.id || ''));
  
  productImages = computed(() => {
    const prod = this.product();
    if (!prod) return [];
    
    const variantImage = this.selectedVariant()?.image;
    const allImages = prod.images || [prod.imageUrl].filter(Boolean);
    
    if (variantImage && !allImages.includes(variantImage)) {
      return [variantImage, ...allImages];
    }
    
    return allImages;
  });

  canReview = computed(() => {
    return this.authService.isAuthenticated();
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  async loadProduct(id: string) {
    this.loading.set(true);
    try {
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          if (product) {
            this.product.set(product);
            this.loadVariants(id);
            this.loadReviews(id);
            this.loadRelatedProducts(product.category);
          } else {
            this.toaster.error('Product not found');
          }
          this.loading.set(false);
        },
        error: (err) => {
          this.toaster.error(err.message || 'Failed to load product');
          this.loading.set(false);
        }
      });
    } catch (error: any) {
      this.toaster.error(error.message || 'Failed to load product');
      this.loading.set(false);
    }
  }

  loadVariants(productId: string) {
    // Load variants from API - for now assume they come with product
    // This would be enhanced when API provides variant endpoint
  }

  async loadReviews(productId: string) {
    try {
      this.reviewService.getProductReviews(productId).subscribe({
        next: (reviews) => {
          this.reviews.set(reviews);
        },
        error: (err) => {
          console.error('Failed to load reviews:', err);
        }
      });
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  }

  loadRelatedProducts(category: string) {
    this.productService.getProducts({ category, limit: 4 }).subscribe({
      next: (products) => {
        const currentProductId = this.product()?.id;
        const related = products.filter(p => p.id !== currentProductId).slice(0, 4);
        this.relatedProducts.set(related);
      }
    });
  }

  onVariantSelected(variant: ProductVariant | null) {
    this.selectedVariant.set(variant);
  }

  getDiscountPercent(): number {
    const variant = this.selectedVariant();
    if (variant?.compareAtPrice && variant.price) {
      return Math.round(((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100);
    }
    return 0;
  }

  async addToCart() {
    const prod = this.product();
    if (!prod) return;

    this.addingToCart.set(true);
    try {
      const variantId = this.selectedVariant()?._id || this.selectedVariant()?.id;
      await this.store.addToCart(prod);
      this.toaster.success('Added to cart');
    } catch (error: any) {
      this.toaster.error(error.message || 'Failed to add to cart');
    } finally {
      this.addingToCart.set(false);
    }
  }

  submitReview(reviewData: { rating: number; title?: string; comment: string; images?: string[] }) {
    const productId = this.productId();
    this.reviewService.createReview({
      product: productId,
      ...reviewData
    }).subscribe({
      next: () => {
        this.toaster.success('Review submitted successfully');
        this.loadReviews(productId);
      },
      error: (err) => {
        this.toaster.error(err.message || 'Failed to submit review');
      }
    });
  }

  markReviewHelpful(reviewId: string) {
    this.reviewService.markHelpful(reviewId).subscribe({
      next: () => {
        // Update local review helpful count
        const updated = this.reviews().map(r => {
          if ((r._id || r.id) === reviewId) {
            return { ...r, isHelpful: r.isHelpful + 1 };
          }
          return r;
        });
        this.reviews.set(updated);
      },
      error: (err) => {
        this.toaster.error(err.message || 'Failed to mark review as helpful');
      }
    });
  }
}

