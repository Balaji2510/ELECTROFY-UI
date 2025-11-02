export interface ShippingAddress {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  addressType?: 'home' | 'work' | 'other';
}

