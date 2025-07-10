
import api from './api';
import { ShippingAddress, PaymentMethod } from '@/types/checkout';

interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  saveShippingAddress: boolean;
  couponCode?: string;
  paymentMethod: PaymentMethod;
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
      const response = await api.post('/orders', orderData);
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
