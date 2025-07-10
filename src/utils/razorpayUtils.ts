
// Note: In a production environment, API keys should be stored securely in environment variables
// For demo purposes, we're using them directly in the code
const RAZORPAY_KEY_ID = 'rzp_live_rIoUdRQlcYrX4Y';
// SECRET should never be exposed in frontend code in production
// This should only be used in a backend environment
const RAZORPAY_SECRET_KEY = 'z7jOOaAACegGIR7xQFFbOmrm';

// Define types for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

// Function to load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Function to create a Razorpay payment
export const createRazorpayPayment = async (options: Omit<RazorpayOptions, 'key'>) => {
  const scriptLoaded = await loadRazorpayScript();
  
  if (!scriptLoaded) {
    throw new Error('Failed to load Razorpay SDK');
  }

  const razorpay = new window.Razorpay({
    ...options,
    key: RAZORPAY_KEY_ID,
  });

  razorpay.open();
};

// Function to format the amount for Razorpay (in paise)
export const formatAmountForRazorpay = (amount: number): number => {
  return Math.round(amount * 100);
};
