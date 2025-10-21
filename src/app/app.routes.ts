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
    }
];
