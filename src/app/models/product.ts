export interface Product {
    id: string | number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    images?: string[];
    isFavorite: boolean;
    rating: number;
    ratingsCount: number;
    inStock: boolean;
    category: string;
};