
import api from './api';
import { ShippingAddress, PaymentMethod } from '@/types/checkout';

interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  saveShippingAddress: boolean;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  customerEmail?: string; // This will be used as fallback, but shippingAddress.email takes priority
  items?: any[];
  subtotal?: number;
  tax?: number;
  total?: number;
  discountAmount?: number;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderSummaryResponse {
  _id: string;
  status: string;
  trackingNumber?: string;
  total: number;
  items: OrderItem[];
  createdAt?: string;
}

export interface OrderDetailResponse extends OrderSummaryResponse {
  shippingAddress: ShippingAddress;
  paymentMethod: {
    razorpayPaymentId?: string;
  };
  createdAt: string;
}

const orderService = {
  createOrder: async (orderData: CreateOrderRequest) => {
    try {
      // Use email from shipping address if available, otherwise fall back to customerEmail
      const emailToUse = orderData.shippingAddress.email || orderData.customerEmail;
      console.log('Creating order with email:', emailToUse);
      
      const response = await api.post('/orders', {
        ...orderData,
        customerEmail: emailToUse
      });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getAllOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data.data as OrderSummaryResponse[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getOrderById: async (orderId: string) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.data as OrderDetailResponse;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  }
};

export default orderService;
