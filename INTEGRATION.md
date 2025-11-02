# Electrofy UI - API Integration Guide

This document describes how the Angular UI is integrated with the Electrofy API service.

## Setup

### 1. Environment Configuration

The API URL is configured in `src/environments/environment.ts`:
- Development: `http://localhost:3000/api`
- Production: Set via `API_URL` environment variable

### 2. Services

#### API Service (`api.service.ts`)
- Centralized HTTP client for all API calls
- Automatically adds JWT tokens to requests
- Manages session IDs for guest users
- Handles errors consistently

#### Auth Service (`auth.service.ts`)
- User authentication (register, login, logout)
- Google OAuth integration
- Token management
- User state management

#### Product Service (`product.service.ts`)
- Fetch products from API
- Product filtering and search
- Transform API products to UI format

#### Cart Service (`cart.service.ts`)
- Cart management (add, update, remove items)
- Guest cart support via session ID
- Cart merging after login

#### Wishlist Service (`wishlist.service.ts`)
- Wishlist management
- Default wishlist handling

### 3. Store Integration

The `electrofyStore` has been updated to:
- Load products from API on initialization
- Sync cart and wishlist with API
- Handle async operations properly

### 4. Authentication Flow

1. **Registration/Login**: User credentials sent to `/api/auth/register` or `/api/auth/login`
2. **Token Storage**: Access and refresh tokens stored in localStorage
3. **Auto Token**: Tokens automatically added to API requests
4. **Logout**: Tokens cleared and user redirected to sign-in

### 5. Guest Cart Flow

1. Guest users get a session ID (stored in localStorage)
2. Session ID sent in `X-Session-Id` header
3. Cart persists for guest users
4. After login, cart is merged with user account

## API Endpoints Used

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/oauth/google` - Google OAuth
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:itemId` - Update cart item
- `DELETE /api/cart/items/:itemId` - Remove cart item
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/merge` - Merge guest cart

### Wishlist
- `GET /api/wishlists` - Get wishlists
- `GET /api/wishlists/default` - Get default wishlist
- `POST /api/wishlists/default/items` - Add to wishlist
- `DELETE /api/wishlists/:id/items/:itemId` - Remove from wishlist

## Running the Integration

### 1. Start the API Server
```bash
cd electrofy-api-service
pnpm dev
```

### 2. Start the Angular UI
```bash
cd ELECTROFY-UI
ng serve
```

### 3. Access the Application
- UI: http://localhost:4200
- API: http://localhost:3000

## CORS Configuration

Ensure the API server allows requests from the Angular dev server:
- The API has CORS enabled in `src/index.ts`
- Update `CORS_ORIGIN` environment variable if needed

## Troubleshooting

### API Connection Issues
- Verify API server is running on port 3000
- Check browser console for CORS errors
- Verify `environment.apiUrl` is correct

### Authentication Issues
- Check if tokens are stored in localStorage
- Verify token expiration
- Check API error responses

### Cart/Wishlist Not Loading
- Check if user is authenticated
- Verify API endpoints are accessible
- Check browser network tab for failed requests

## Next Steps

1. Add error handling interceptors
2. Implement token refresh mechanism
3. Add loading states to UI
4. Add offline support
5. Implement product search
6. Add category filtering

