export interface OrderItem {
  _id?: string;
  product: {
    _id?: string;
    id?: string;
    name: string;
    images?: string[];
  };
  variant?: {
    _id?: string;
    attributes?: Record<string, string>;
  };
  productName: string;
  variantAttributes?: Record<string, string>;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

export interface Order {
  _id?: string;
  id?: string;
  orderNumber: string;
  user?: string;
  items: OrderItem[];
  shippingAddress: any;
  payment?: any;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  currency: string;
  shippingMethod?: string;
  trackingNumber?: string;
  notes?: string;
  cancelledAt?: Date;
  cancelledReason?: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

