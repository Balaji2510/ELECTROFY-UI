import { computed, inject, effect } from "@angular/core";
import { Product } from "./models/product";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { produce } from "immer";
import { Toaster } from "./services/toaster";
import { ProductService } from "./services/product.service";
import { CartService } from "./services/cart.service";
import { WishlistService } from "./services/wishlist.service";
import { AuthService } from "./services/auth.service";
import { Category, CategoryService } from "./services/category.service";

export type electrofyStore = {
    products: Product[];
    category: string;
    wishlistItems: Product[];
    cartItems: Product[];
    isSidebarOpen: boolean;
    loading: boolean;
    categories: Category[];
};

export const electrofyStore = signalStore(
    {
        providedIn: 'root'
    },
    withState<{ products: Product[]; category: string; wishlistItems: Product[]; cartItems: Product[]; isSidebarOpen: boolean; loading: boolean; categories: Category[]; }>({
        products: [] as Product[],
        category: 'all',
        wishlistItems: [] as Product[],
        cartItems: [] as Product[],
        isSidebarOpen: true,
        loading: false,
        categories: [] as Category[],
    }),
    // withComputed(({ products, category, categories }) => ({
    withComputed(({ products, category }) => ({
        filteredProducts: computed(() => {
            if (category().toLowerCase() === 'all') {
                return products();
            } else {
                return products().filter(product => product.category.toLowerCase() === category().toLowerCase());
            }
        })
    })),
    withMethods((store, 
        toaster = inject(Toaster),
        productService = inject(ProductService),
        cartService = inject(CartService),
        wishlistService = inject(WishlistService),
        authService = inject(AuthService),
        categoryService = inject(CategoryService)
    ) => ({
        async loadProducts() {
            patchState(store, { loading: true });
            try {
                await productService.getProducts({ status: 'active' }).subscribe((products) => {
                     patchState(store, { products });
                });
            } catch (error: any) {
                console.error('Error loading products:', error);
                toaster.error(error.message || 'Failed to load products');
            } finally {
                patchState(store, { loading: false });
            }
        },

        async loadCart() {
            try {
                const cart = await cartService.getCart().toPromise();
                if (cart?.items) {
                    // Transform cart items to products for display
                    const cartProducts = cart.items.map((item: any) => ({
                        id: item.product?._id || item.product?.id,
                        name: item.product?.name || '',
                        description: item.product?.description || '',
                        price: item.price || item.product?.basePrice || 0,
                        imageUrl: item.product?.images?.[0] || '',
                        isFavorite: false,
                        rating: item.product?.averageRating || 0,
                        ratingsCount: item.product?.ratingCount || 0,
                        inStock: true,
                        category: item.product?.category?.name || '',
                    })) as Product[];
                    // Ensure correct type: cartProducts is Product[]
                    patchState(store, { cartItems: cartProducts });
                }
            } catch (error: any) {
                console.error('Error loading cart:', error);
            }
        },

        async loadCategories() {
            try {
              await categoryService.getCategories().subscribe((categories) => {
                patchState(store, { categories });
              });
            } catch (error: any) {
                console.error('Error loading categories:', error);
            }
        },

        async loadWishlist() {
            try {
                const wishlist = await wishlistService.getDefaultWishlist().toPromise();
                if (wishlist?.items) {
                    // Transform wishlist items to products for display
                    const wishlistProducts = wishlist.items.map((item: any) => ({
                        id: item.product?._id || item.product?.id,
                        name: item.product?.name || '',
                        description: item.product?.description || '',
                        price: item.product?.basePrice || item.product?.price || 0,
                        imageUrl: item.product?.images?.[0] || '',
                        isFavorite: true,
                        rating: item.product?.averageRating || 0,
                        ratingsCount: item.product?.ratingCount || 0,
                        inStock: (item.product?.totalStock || 0) > 0,
                        category: item.product?.category?.name || '',
                    }));
                    patchState(store, { wishlistItems: wishlistProducts });
                }
            } catch (error: any) {
                console.error('Error loading wishlist:', error);
            }
        },

        setCategory(newCategory: string) {
            patchState(store, { category: newCategory });
        },

        async addToWishlist(product: Product) {
            try {
                await wishlistService.addToWishlist(String(product.id)).toPromise();
                const updatedWishlist = produce(store.wishlistItems(), (draft: Product[]) => {
                    const existingProduct = { ...product, isFavorite: true };
                    if (!draft.find(item => item.id === product.id)) {
                        draft.push(existingProduct);
                    }
                });
                patchState(store, { wishlistItems: updatedWishlist });
                toaster.success('Added to wishlist');
            } catch (error: any) {
                toaster.error(error.message || 'Failed to add to wishlist');
            }
        },

        async removeFromWishlist(product: Product) {
            try {
                const wishlist = await wishlistService.getDefaultWishlist().toPromise();
                if (wishlist?._id) {
                    const item = wishlist.items.find((item: any) => 
                        (item.product?._id || item.product?.id) === String(product.id)
                    );
                    if (item && (item as any)._id) {
                        await wishlistService.removeFromWishlist(wishlist._id, (item as any)._id).toPromise();
                    }
                }
                const updatedWishlist = produce(store.wishlistItems(), (draft: Product[]) => {
                    const index = draft.findIndex(item => item.id === product.id);
                    if (index !== -1) {
                        draft.splice(index, 1);
                    }
                });
                patchState(store, { wishlistItems: updatedWishlist });
                toaster.success('Removed from wishlist');
            } catch (error: any) {
                toaster.error(error.message || 'Failed to remove from wishlist');
            }
        },

        async addToCart(product: Product) {
            try {
                await cartService.addToCart(String(product.id), 1).toPromise();
                await this.loadCart();
                toaster.success('Added to cart');
            } catch (error: any) {
                toaster.error(error.message || 'Failed to add to cart');
            }
        },

        async removeFromCart(product: Product) {
            try {
                const cart = await cartService.getCart().toPromise();
                if (cart?.items) {
                    const item = cart.items.find((item: any) => 
                        (item.product?._id || item.product?.id) === String(product.id)
                    );
                    if (item && (item as any)._id) {
                        await cartService.removeCartItem((item as any)._id).toPromise();
                        await this.loadCart();
                        toaster.success('Removed from cart');
                    }
                }
            } catch (error: any) {
                toaster.error(error.message || 'Failed to remove from cart');
            }
        },

        async clearWishlist() {
            try {
                const wishlist = await wishlistService.getDefaultWishlist().toPromise();
                if (wishlist?._id) {
                    await wishlistService.clearWishlist(wishlist._id).toPromise();
                }
                patchState(store, { wishlistItems: [] });
                toaster.success('Wishlist cleared');
            } catch (error: any) {
                toaster.error(error.message || 'Failed to clear wishlist');
            }
        },

        async clearCartItems() {
            try {
                await cartService.clearCart().toPromise();
                patchState(store, { cartItems: [] });
                toaster.success('Cart cleared');
            } catch (error: any) {
                toaster.error(error.message || 'Failed to clear cart');
            }
        },

        issideNavOpened() {
            return store.isSidebarOpen();
        },

        toggleSidebar() {
            const currentState = store.isSidebarOpen();
            patchState(store, { isSidebarOpen: !currentState });
        },

        async initialize() {
            // Load products
            await this.loadProducts();
            await this.loadCategories();
            
            // Load cart and wishlist if authenticated
            if (authService.isAuthenticated()) {
                await this.loadCart();
                await this.loadWishlist();
            }
        }
    }))
);
