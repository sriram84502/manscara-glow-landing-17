
import api from '@/services/api';
import { Coupon } from '@/types/checkout';

export interface CouponValidationResponse {
  valid: boolean;
  coupon?: Coupon;
  message?: string;
  discountAmount?: number;
}

export interface AvailableCoupon extends Coupon {
  _id: string;
  isOneTimeUse: boolean;
  isActive: boolean;
}

export const validateCoupon = async (code: string, totalAmount: number): Promise<CouponValidationResponse> => {
  if (!code) {
    return { valid: false, message: "Please enter a coupon code." };
  }

  try {
    const response = await api.post('/coupons/validate', {
      code,
      subtotal: totalAmount
    });
    
    if (response.data.success) {
      return response.data.data;
    } else {
      return { 
        valid: false, 
        message: response.data.message || "Invalid coupon code."
      };
    }
  } catch (error: any) {
    console.error("Error validating coupon:", error);
    return { 
      valid: false, 
      message: error.message || "Error validating coupon. Please try again."
    };
  }
};

export const getAvailableCoupons = async (): Promise<AvailableCoupon[]> => {
  try {
    const response = await api.get('/coupons');
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching available coupons:", error);
    return [];
  }
};

export const calculateDiscount = (amount: number, discountPercentage: number): number => {
  return (amount * discountPercentage) / 100;
};
