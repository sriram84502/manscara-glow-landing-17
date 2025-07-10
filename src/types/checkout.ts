import { CartProduct } from './user';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string; // House Number, building name
  city: string;
  region: string; // Road name, area, colony
  postalCode: string; // Pin code
  country: string; // Default: India
  phone: string;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  address: string; // House Number, building name
  city: string;
  region: string; // Road name, area, colony
  postalCode: string; // Pin code
  country: string; // Default: India
  phone: string;
}

export interface PaymentMethod {
  nameOnCard: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveCard?: boolean;
  razorpayPaymentId?: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  description: string;
  expiryDate: string;
  minimumPurchase: number;
  isActive: boolean;
}

export interface OrderSummary {
  shippingAddress: ShippingAddress | null;
  billingAddress: BillingAddress | null;
  paymentMethod: PaymentMethod | null;
  items: CartProduct[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  appliedCoupon?: Coupon | null;
  discountAmount?: number;
}

export interface Order {
  id: string;
  date: string;
  status: string;
  shippingAddress: ShippingAddress;
  items: CartProduct[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  trackingUrl?: string;
  paymentMethod?: {
    nameOnCard: string;
    cardNumber: string;
    razorpayPaymentId?: string;
  };
}
