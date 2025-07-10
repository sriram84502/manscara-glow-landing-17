
import { ShippingAddress, BillingAddress, PaymentMethod, OrderSummary, Order } from "@/types/checkout";
import orderService from "@/services/orderService";

type AddressType = 'shipping' | 'billing';

export interface Address {
  firstName: string;
  lastName: string;
  address: string; // House Number, building name
  city: string;
  state: string;
  zipCode: string; // Pin code
  country: string; // Default: India
  phone: string;
}

export interface UserAddress {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isPrimary: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  nameOnCard: string;
  cardNumber: string;
  expiryDate: string;
  lastFour: string;
  isDefault: boolean;
}

export const getUserAddresses = () => {
  // Get addresses from localStorage instead of static JSON
  const userData = localStorage.getItem('userData');
  if (!userData) {
    return [];
  }
  
  try {
    const parsedData = JSON.parse(userData);
    return parsedData.addresses || [];
  } catch (error) {
    console.error('Error parsing user data:', error);
    return [];
  }
};

export const getSavedAddresses = () => {
  // This will use the existing getUserAddresses function
  const addresses = getUserAddresses();
  
  // Convert from userData format to ShippingAddress format expected by the checkout
  return addresses.map(address => ({
    firstName: address.name?.split(' ')[0] || '',
    lastName: address.name?.split(' ')[1] || '',
    address: address.street || '',
    city: address.city || '',
    region: address.state || '', // Using region as it's expected in the component
    postalCode: address.zipCode || '', // Using postalCode as it's expected in the component
    country: address.country || '',
    phone: address.phone || ''
  }));
};

// Modified to accept ShippingAddress and convert it to Address format
export const saveAddress = (shippingAddress: ShippingAddress) => {
  // Convert ShippingAddress to Address format by mapping the fields
  const address: Address = {
    firstName: shippingAddress.firstName,
    lastName: shippingAddress.lastName,
    address: shippingAddress.address, // House Number, building name
    city: shippingAddress.city,
    state: shippingAddress.region, // Road name, area, colony
    zipCode: shippingAddress.postalCode, // Pin code
    country: shippingAddress.country || 'India', // Default to India
    phone: shippingAddress.phone
  };

  // In a real app, this would make an API call to save the address
  console.log('Saving address:', address);
  
  // For demo purposes, we'll return a success status
  return {
    success: true,
    message: 'Address saved successfully'
  };
};

export const saveUserAddress = (address: Address, type: AddressType, saveForLater: boolean = false) => {
  if (saveForLater) {
    // Save address to user profile in localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        
        // Create formatted address for user profile
        const userAddress: UserAddress = {
          id: `addr_${Date.now()}`,
          name: `${address.firstName} ${address.lastName}`,
          street: address.address,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
          phone: address.phone,
          isPrimary: false
        };
        
        // Add to addresses array
        const addresses = parsedData.addresses || [];
        addresses.push(userAddress);
        
        // Save updated user data back to localStorage
        parsedData.addresses = addresses;
        localStorage.setItem('userData', JSON.stringify(parsedData));
        
        console.log(`Saved ${type} address to user profile:`, userAddress);
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  }
  
  return {
    success: true,
    message: saveForLater 
      ? `${type.charAt(0).toUpperCase() + type.slice(1)} address saved to your profile.`
      : `${type.charAt(0).toUpperCase() + type.slice(1)} address used for this order only.`
  };
};

export const convertUserAddressToCheckoutFormat = (address: any) => {
  return {
    firstName: address.name?.split(' ')[0] || '',
    lastName: address.name?.split(' ')[1] || '',
    address: address.street || '', // House Number, building name
    city: address.city || '',
    region: address.state || '', // Road name, area, colony
    postalCode: address.zipCode || '', // Pin code
    country: address.country || 'India', // Default to India
    phone: address.phone || '',
  };
};

// Function to save a payment method
export const savePaymentMethod = (paymentMethod: any, saveForLater: boolean = false) => {
  if (saveForLater) {
    // Save payment method to user profile in localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        
        // Format payment method for storage
        const savedPaymentMethod = {
          id: `pm_${Date.now()}`,
          nameOnCard: paymentMethod.nameOnCard,
          cardNumber: `****-****-****-${paymentMethod.cardNumber.slice(-4)}`,
          expiryDate: paymentMethod.expiryDate,
          lastFour: paymentMethod.cardNumber.slice(-4),
          isDefault: !getSavedPaymentMethods().length // First card is default
        };
        
        // Add payment method to user data
        const paymentMethods = parsedData.paymentMethods || [];
        paymentMethods.push(savedPaymentMethod);
        
        // Save updated user data back to localStorage
        parsedData.paymentMethods = paymentMethods;
        localStorage.setItem('userData', JSON.stringify(parsedData));
        
        console.log('Payment method saved to user profile:', savedPaymentMethod);
      } catch (error) {
        console.error('Error saving payment method:', error);
      }
    }
  }
  
  return {
    success: true,
    message: saveForLater 
      ? 'Payment method saved to your profile.'
      : 'Payment method used for this order only.'
  };
};

// Function to save an order to the user profile
export const saveOrder = async (orderSummary: OrderSummary): Promise<{ success: boolean; order?: Order }> => {
  try {
    if (!orderSummary.shippingAddress || !orderSummary.paymentMethod) {
      return { success: false };
    }

    const orderData = {
      shippingAddress: orderSummary.shippingAddress,
      saveShippingAddress: false, // By default, don't save it again as we already have a separate function for this
      paymentMethod: orderSummary.paymentMethod,
      couponCode: orderSummary.appliedCoupon?.code
    };

    // Send the order to the API
    const response = await orderService.createOrder(orderData);
    
    if (response.success) {
      // Create an Order object from the response
      const newOrder: Order = {
        id: response.data._id,
        date: response.data.createdAt || new Date().toISOString(),
        status: response.data.status,
        shippingAddress: orderSummary.shippingAddress,
        items: orderSummary.items,
        subtotal: orderSummary.subtotal,
        shippingCost: orderSummary.shippingCost,
        tax: orderSummary.tax,
        total: response.data.total,
        trackingNumber: response.data.trackingNumber,
        paymentMethod: {
          nameOnCard: orderSummary.paymentMethod.nameOnCard,
          cardNumber: orderSummary.paymentMethod.cardNumber,
          razorpayPaymentId: orderSummary.paymentMethod.razorpayPaymentId
        }
      };
      
      return { success: true, order: newOrder };
    }
    
    return { success: false };
  } catch (error) {
    console.error("Error saving order:", error);
    return { success: false };
  }
};

// Function to get saved payment methods from user profile
export const getSavedPaymentMethods = () => {
  const userData = localStorage.getItem('userData');
  if (!userData) {
    return [];
  }
  
  try {
    const parsedData = JSON.parse(userData);
    return parsedData.paymentMethods || [];
  } catch (error) {
    console.error('Error parsing payment methods:', error);
    return [];
  }
};

// Function to get orders from user profile
export const getUserOrders = async (): Promise<Order[]> => {
  try {
    // Get orders from the API
    const apiOrders = await orderService.getAllOrders();
    
    // Transform the API response to match our Order type
    const orders: Order[] = apiOrders.map(apiOrder => ({
      id: apiOrder._id,
      date: apiOrder.createdAt || new Date().toISOString(),
      status: apiOrder.status,
      shippingAddress: {} as ShippingAddress, // Will be populated when viewing order details
      items: apiOrder.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: '', // This will be populated when viewing order details
        id: `${apiOrder._id}-${item.name}`, // Generate a temporary ID
        subtitle: '' // Add the missing subtitle field required by CartProduct
      })),
      subtotal: apiOrder.total, // This is approximate without knowing the specific costs
      shippingCost: 0,
      tax: 0,
      total: apiOrder.total,
      trackingNumber: apiOrder.trackingNumber
    }));
    
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    
    // Fallback to local storage for demo or offline functionality
    const savedOrders = localStorage.getItem('userOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  }
};

export const getOrderDetails = async (orderId: string): Promise<Order | null> => {
  try {
    // Get order details from the API
    const apiOrder = await orderService.getOrderById(orderId);
    
    // Transform the API response to match our Order type
    const order: Order = {
      id: apiOrder._id,
      date: apiOrder.createdAt,
      status: apiOrder.status,
      shippingAddress: apiOrder.shippingAddress,
      items: apiOrder.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: '', // This might need to be populated from elsewhere
        id: `${apiOrder._id}-${item.name}`, // Generate a temporary ID
        subtitle: '' // Add the missing subtitle field required by CartProduct
      })),
      subtotal: apiOrder.total - 0, // We don't have the breakdown, so this is approximate
      shippingCost: 0,
      tax: 0,
      total: apiOrder.total,
      trackingNumber: apiOrder.trackingNumber,
      paymentMethod: {
        nameOnCard: '',
        cardNumber: '',
        razorpayPaymentId: apiOrder.paymentMethod?.razorpayPaymentId
      }
    };
    
    return order;
  } catch (error) {
    console.error(`Error fetching order details for ${orderId}:`, error);
    
    // Fallback to local storage for demo or offline functionality
    const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const order = savedOrders.find((o: Order) => o.id === orderId);
    return order || null;
  }
};
