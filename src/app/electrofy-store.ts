import { computed, inject } from "@angular/core";
import { Product } from "./models/product";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { produce } from "immer";
import { Toaster } from "./services/toaster";
export type electrofyStore = {
    products: Product[];
    category: string;
    wishlistItems: Product[];
    cartItems: Product[];
   isSidebarOpen: boolean;
};

export const electrofyStore = signalStore(
    {
        providedIn: 'root'
    },
    withState({
        products: [
            { id: 1, name: 'AeroSound Wireless Headphones', description: 'Over-ear Bluetooth headphones with active noise cancellation and 30h battery life.', price: 10659.18, imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb', isFavorite: false, rating: 4.5, ratingsCount: 1245, inStock: true, category: 'Audio' },
            { id: 2, name: 'VoltX Portable Charger 20000mAh', description: 'High-capacity power bank with dual USB-C PD outputs and fast charging.', price: 4095.9, imageUrl: 'https://images.unsplash.com/photo-1551734465-8de5499b05f8', isFavorite: true, rating: 4.2, ratingsCount: 842, inStock: true, category: 'Accessories' },
            { id: 3, name: 'Lumen Smart Bulb (2-pack)', description: 'Dimmable RGB smart bulbs with app and voice assistant support.', price: 2378.0, imageUrl: 'https://images.unsplash.com/photo-1550436516-df1a1fc16e4f', isFavorite: false, rating: 4.0, ratingsCount: 210, inStock: true, category: 'Smart Home' },
            { id: 4, name: 'Nebula 4K Action Camera', description: 'Rugged action camera capable of 4K60 video and 12MP stills.', price: 16399.18, imageUrl: 'https://images.unsplash.com/photo-1519183071298-a2962be54a04?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3d3f2fb8f1a7a0f0b9d2f7f7d0f8b2b9', isFavorite: false, rating: 4.3, ratingsCount: 398, inStock: false, category: 'Cameras' },
            { id: 5, name: 'PulseFit Fitness Tracker', description: 'Lightweight activity tracker with heart-rate monitoring and sleep tracking.', price: 4879.0, imageUrl: 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8', isFavorite: true, rating: 4.1, ratingsCount: 670, inStock: true, category: 'Wearables' },
            { id: 6, name: 'Orion USB-C Noise-Cancelling Earbuds', description: 'In-ear earbuds with hybrid ANC and wireless charging case.', price: 6478.0, imageUrl: 'https://images.unsplash.com/photo-1634947704991-cf7666974982', isFavorite: false, rating: 4.0, ratingsCount: 512, inStock: true, category: 'Audio' },
            { id: 7, name: 'Vertex Gaming Mouse', description: 'Ergonomic RGB gaming mouse with 16000 DPI sensor and programmable buttons.', price: 4919.18, imageUrl: 'https://images.unsplash.com/photo-1613141411244-0e4ac259d217', isFavorite: false, rating: 4.4, ratingsCount: 304, inStock: true, category: 'Peripherals' },
            { id: 8, name: 'Aurora Mechanical Keyboard', description: 'Compact mechanical keyboard with hot-swappable switches and per-key RGB.', price: 8938.0, imageUrl: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6', isFavorite: true, rating: 4.6, ratingsCount: 221, inStock: true, category: 'Peripherals' },
            { id: 9, name: 'Spectra 27" 4K Monitor', description: '27-inch IPS 4K monitor with HDR10 support and USB-C input.', price: 28699.18, imageUrl: 'https://images.unsplash.com/photo-1629429408209-1f912961dbd8', isFavorite: false, rating: 4.5, ratingsCount: 178, inStock: true, category: 'Monitors' },
            { id: 10, name: 'Glide Bluetooth Speaker', description: 'Portable waterproof Bluetooth speaker with 12h playtime and deep bass.', price: 3279.18, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1', isFavorite: false, rating: 4.2, ratingsCount: 915, inStock: true, category: 'Audio' },
            { id: 11, name: 'Zen Home Robot Vacuum', description: 'Smart robot vacuum with mapping, app control and scheduled cleaning.', price: 20418.0, imageUrl: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9', isFavorite: false, rating: 4.1, ratingsCount: 402, inStock: true, category: 'Smart Home' },
            { id: 12, name: 'Nimbus Drone Mini', description: 'Compact camera drone with 2-axis gimbal and 1080p recording.', price: 14759.18, imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f', isFavorite: false, rating: 3.9, ratingsCount: 156, inStock: true, category: 'Drones' },
            { id: 13, name: 'Echo Smart Display 8"', description: 'Voice-activated smart display with assistant, streaming and home control.', price: 7379.18, imageUrl: 'https://images.unsplash.com/photo-1590635628138-f5741d2644c7', isFavorite: true, rating: 4.0, ratingsCount: 980, inStock: true, category: 'Smart Home' },
            { id: 14, name: 'ThermaPro Digital Food Thermometer', description: 'Instant-read thermometer with backlit display and calibration.', price: 2029.5, imageUrl: 'https://images.unsplash.com/photo-1589628672882-fc7f20037ae9', isFavorite: false, rating: 4.3, ratingsCount: 64, inStock: true, category: 'Kitchen' },
            { id: 15, name: 'Horizon WiFi Router AX3000', description: 'Dual-band WiFi 6 router with parental controls and QoS.', price: 10578.0, imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f', isFavorite: false, rating: 4.0, ratingsCount: 233, inStock: true, category: 'Networking' },
            { id: 16, name: 'PixelFrame Digital Photo Frame', description: '10-inch digital frame with cloud photo syncing and slideshow modes.', price: 5739.18, imageUrl: 'https://images.unsplash.com/photo-1595264829829-6d0c84e7209c', isFavorite: false, rating: 4.1, ratingsCount: 48, inStock: true, category: 'Home Electronics' },
            { id: 17, name: 'Solace Noise-Reducing Sleep Mask', description: 'Comfortable sleep mask with built-in white-noise speaker.', price: 2829.0, imageUrl: 'https://images.unsplash.com/photo-1511295742362-92c96b1cf484', isFavorite: false, rating: 4.2, ratingsCount: 89, inStock: true, category: 'Wellness' },
            { id: 18, name: 'Orbit Smart Lock Pro', description: 'Keyless smart lock with auto-lock and remote access via app.', price: 13119.18, imageUrl: 'https://images.unsplash.com/photo-1626179835021-6d9756a2cc7d', isFavorite: false, rating: 4.0, ratingsCount: 134, inStock: false, category: 'Smart Home' },
            { id: 19, name: 'Flux Portable Projector', description: 'Compact LED projector with 720p support and HDMI input.', price: 17958.0, imageUrl: 'https://images.unsplash.com/photo-1619250946562-0df3bb238b47', isFavorite: false, rating: 3.8, ratingsCount: 77, inStock: true, category: 'Projectors' },
            { id: 20, name: 'Eclipse Wireless Charging Pad', description: 'Fast wireless charger compatible with Qi devices and cases.', price: 1639.18, imageUrl: 'https://images.unsplash.com/photo-1615526675741-99b1af14ed61', isFavorite: false, rating: 4.1, ratingsCount: 512, inStock: true, category: 'Accessories' },
            { id: 21, name: 'Cascade Portable SSD 1TB', description: 'High-speed NVMe portable SSD with USB-C and rugged casing.', price: 12299.18, imageUrl: 'https://images.unsplash.com/photo-1617182635496-c5c4cc30e596', isFavorite: true, rating: 4.7, ratingsCount: 215, inStock: true, category: 'Storage' },
            { id: 22, name: 'SolarCharge Foldable Panel', description: 'Portable foldable solar panel for outdoor charging with USB outputs.', price: 7339.0, imageUrl: 'https://images.unsplash.com/photo-1591270551371-3401a1a5fb9e', isFavorite: false, rating: 4.0, ratingsCount: 52, inStock: true, category: 'Outdoor' },
            { id: 23, name: 'RetroTurntable Bluetooth', description: 'Vintage-style turntable with Bluetooth output and built-in speakers.', price: 10578.0, imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d', isFavorite: false, rating: 4.2, ratingsCount: 140, inStock: true, category: 'Audio' },
            { id: 24, name: 'Breeze Air Purifier', description: 'Compact HEPA air purifier for small rooms with quiet mode.', price: 7379.18, imageUrl: 'https://images.unsplash.com/photo-1605794398544-53e54dc3a685', isFavorite: false, rating: 4.3, ratingsCount: 98, inStock: true, category: 'Home Appliances' },
            { id: 25, name: 'Voyager VR Headset', description: 'Lightweight VR headset with comfortable straps and 110-degree FOV.', price: 24518.0, imageUrl: 'https://images.unsplash.com/photo-1622979497168-7294157c79c3', isFavorite: false, rating: 4.4, ratingsCount: 321, inStock: true, category: 'VR' },
            { id: 26, name: 'MiTech Smart TV 43"', description: 'Made-for-India smart LED TV with regional language apps and adaptive brightness.', price: 219.0, imageUrl: 'https://images.unsplash.com/photo-1585386959984-a415522c95d0?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=8f2b4c3a6c4a8b1b2c3d4e5f6a7b8c9d', isFavorite: false, rating: 4.2, ratingsCount: 412, inStock: true, category: 'TVs' },
            { id: 27, name: 'Boat Rockerz 550 Pro', description: 'Indian-brand over-ear wireless headphones with long battery life and punchy bass.', price: 3499.0, imageUrl: 'https://images.unsplash.com/photo-1518444021651-0f48c9f0f8ed', isFavorite: true, rating: 4.1, ratingsCount: 2150, inStock: true, category: 'Audio' },
            { id: 28, name: 'Noise ColorFit Pro 3', description: 'Affordable Indian wearable with fitness tracking, SpO2 and customizable watch faces.', price: 2499.0, imageUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6', isFavorite: false, rating: 4.0, ratingsCount: 987, inStock: true, category: 'Wearables' },
            { id: 29, name: 'Realme Narzo 50i', description: 'Budget smartphone with long battery life and optimized performance for Indian apps.', price: 7999.0, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', isFavorite: false, rating: 4.0, ratingsCount: 1320, inStock: true, category: 'Phones' },
            { id: 30, name: 'Ambrane 10000mAh Power Bank', description: 'Reliable Indian-brand power bank with dual USB outputs and compact design.', price: 799.0, imageUrl: 'https://images.unsplash.com/photo-1580910051070-3d7b8b6c9d1f', isFavorite: false, rating: 4.1, ratingsCount: 410, inStock: true, category: 'Accessories' },
            { id: 31, name: 'IFB Front Load Washer 8kg', description: 'Popular Indian washing machine with energy-efficient motor and quick wash modes.', price: 22999.0, imageUrl: 'https://images.unsplash.com/photo-1581579183535-4b0f9f7a1b2b', isFavorite: false, rating: 4.3, ratingsCount: 145, inStock: true, category: 'Home Appliances' },
            { id: 32, name: 'Prestige Induction Cooktop', description: 'Well-known Indian kitchen appliance with multiple preset modes and auto-pan detection.', price: 2499.0, imageUrl: 'https://images.unsplash.com/photo-1604908811995-6a4b3a1b0a23', isFavorite: false, rating: 4.2, ratingsCount: 320, inStock: true, category: 'Kitchen' },
            { id: 33, name: 'BharatBikes Electric Scooter', description: 'Compact Indian electric scooter ideal for city commutes with 60km range.', price: 64999.0, imageUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e', isFavorite: false, rating: 4.0, ratingsCount: 58, inStock: true, category: 'Vehicles' },
            { id: 34, name: 'UpNext Air Purifier (India)', description: 'HEPA filter purifier optimized for Indian air quality and small apartments.', price: 6999.0, imageUrl: 'https://images.unsplash.com/photo-1582719478173-7b6f0a2d5b3b', isFavorite: false, rating: 4.1, ratingsCount: 74, inStock: true, category: 'Home Appliances' },
            { id: 35, name: 'Saregama Carvaan Mini', description: 'Preloaded Indian retro music player with classic songs and Bluetooth connectivity.', price: 2499.0, imageUrl: 'https://images.unsplash.com/photo-1511688878356-9763a6a7a1b9', isFavorite: true, rating: 4.5, ratingsCount: 1890, inStock: true, category: 'Audio' }
        ],
        category: 'all',
        wishlistItems: [],
        cartItems: [],
        isSidebarOpen: true
    }),
    withComputed(({ products, category }) => ({        
        filteredProducts: computed(() => {         
            if (category().toLowerCase() === 'all') {
                return products();
            } else {
                return products().filter(product => product.category.toLowerCase() === category().toLowerCase());
            }
        })
    })),
    withMethods((store,toaster=inject(Toaster)) => ({
        setCategory(newCategory: string) {                   
            patchState(store, { category: newCategory });
        },
        addToWishlist(product: Product) {
            const updatedWishlist = produce(store.wishlistItems(), (draft: Product[]) => {
                if (!draft.find(item => item.id === product.id)) {
                    draft.push(product);
                }
            });
            patchState(store, { wishlistItems: updatedWishlist });
            toaster.success('Added to wishlist');

        },
        removeFromWishlist(product: Product) {
            const updatedWishlist = produce(store.wishlistItems(), (draft: Product[]) => {
                const index = draft.findIndex(item => item.id === product.id);
                if (index !== -1) {
                    draft.splice(index, 1);
                }
            });
            patchState(store, { wishlistItems: updatedWishlist });
            toaster.success('Removed from wishlist');
        },
        addToCart(product: Product) {
            const updatedCart = produce(store.cartItems(), (draft: Product[]) => {
                if (!draft.find(item => item.id === product.id)) {
                    draft.push(product);
                }
            });
            patchState(store, { cartItems: updatedCart });
            toaster.success('Added to cart');

        },
        clearWishlist() {
            patchState(store, { wishlistItems: [] });
            toaster.success('Wishlist cleared');
        },
        issideNavOpened(){
            return store.isSidebarOpen();
        },
        toggleSidebar(){
            const currentState=store.isSidebarOpen();
            patchState(store,{isSidebarOpen:!currentState});
        }  
        
    }))

);
