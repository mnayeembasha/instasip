export interface UserType {
  _id: string;
  name: string;
  phone: string;
  isAdmin: boolean;
  isPhoneVerified: boolean;
}

export interface ProductType {
  _id: string;
  name: string;
  slug:string;
  price: number;
  description: string;
  image: string;
  stock: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemType {
  product: ProductType;
  quantity: number;
}

export interface OrderItemType {
  _id: string;
  product: ProductType;
  quantity: number;
  price: number;
}

export interface ShippingAddressType {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderType {
  _id: string;
  user: UserType | string;
  items: OrderItemType[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddressType;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderDate: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}
