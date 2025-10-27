export interface UserType {
  _id: string;
  name: string;
  phone: string;
  email: string;
  isAdmin: boolean;
  isEmailVerified: boolean;
}

export interface ProductType {
  _id: string;
  name: string;
  slug: string;
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
  gstAmount: number;
  gstPercentage: number;
  deliveryCharge: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddressType;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  razorpayOrderId: string;
  razorpayPaymentId: string;
//  razorpaySignature: string;
  orderDate: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartType {
  _id: string;
  user: string;
  items: CartItemType[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentType {
  _id: string;
  user: UserType;
  order: OrderType | null;
  razorpayOrderId: string;
  razorpayPaymentId: string;
 // razorpaySignature: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
  method?: string;
  email?: string;
  contact?: string;
  errorCode?: string;
  errorDescription?: string;
  refundId?: string;
  refundAmount?: number;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStatsType {
  totalPayments: number;
  totalAmount: number;
  capturedPayments: number;
  capturedAmount: number;
  failedPayments: number;
  refundedPayments: number;
  refundedAmount: number;
}

export interface DailyStatsType {
  date: string;
  transactions: number;
  revenue: number;
  successful: number;
  failed: number;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): {
        open: () => void;
        on: (event: string, callback: () => void) => void;
      };
    };
  }
}
