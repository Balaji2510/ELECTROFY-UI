export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isFavorite: boolean;
    rating: number;
    ratingsCount: number;
    inStock: boolean;
    category: string;
};