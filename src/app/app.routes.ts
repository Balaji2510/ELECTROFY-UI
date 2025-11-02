import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'products/all',
        pathMatch: 'full'
    },
    {
        path: 'product/:id',
        loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail)
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
        path: 'checkout/shipping',
        loadComponent: () => import('./pages/checkout/checkout-shipping/checkout-shipping').then(m => m.CheckoutShipping),
        canActivate: [authGuard]
    },
    {
        path: 'checkout/payment',
        loadComponent: () => import('./pages/checkout/checkout-payment/checkout-payment').then(m => m.CheckoutPayment),
        canActivate: [authGuard]
    },
    {
        path: 'checkout/confirmation/:orderId',
        loadComponent: () => import('./pages/checkout/checkout-confirmation/checkout-confirmation').then(m => m.CheckoutConfirmation),
        canActivate: [authGuard]
    },
    {
        path: 'account',
        loadComponent: () => import('./pages/account/account').then(m => m.Account),
        canActivate: [authGuard]
    },
    {
        path: 'account/profile',
        loadComponent: () => import('./pages/account/profile/profile').then(m => m.Profile),
        canActivate: [authGuard]
    },
    {
        path: 'account/addresses',
        loadComponent: () => import('./pages/account/addresses/addresses').then(m => m.Addresses),
        canActivate: [authGuard]
    },
    {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders').then(m => m.Orders),
        canActivate: [authGuard]
    },
    {
        path: 'orders/:orderId',
        loadComponent: () => import('./pages/orders/order-detail/order-detail').then(m => m.OrderDetail),
        canActivate: [authGuard]
    },
    {
        path: 'sign-in',
        loadComponent: () => import('./pages/sign-in/sign-in').then(m => m.SignIn)
    },
    {
        path: 'sign-up',
        loadComponent: () => import('./pages/sign-up/sign-up').then(m => m.SignUp)    
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword)
    },
    {
        path: 'reset-password',
        loadComponent: () => import('./pages/reset-password/reset-password').then(m => m.ResetPassword)
    }
];
