import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'products/all',
        pathMatch: 'full'

    },
    {
        path: 'products/:category',
        loadComponent: () => import('./pages/product-grid/product-grid').then(m => m.ProductGrid)
    },
    {
        path: 'wishlist',
        loadComponent: () => import('./pages/wishlist/wishlist').then(m => m.Wishlist)
    },
    {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart').then(m => m.Cart)
    },
    {
        path: 'sign-in',
        loadComponent: () => import('./pages/sign-in/sign-in').then(m => m.SignIn)
    },
    {
        path: 'sign-up',
        loadComponent: () => import('./pages/sign-up/sign-up').then(m => m.SignUp)    
    }
];
