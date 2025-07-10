
import api from './api';

export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  quantity: number;
  id?: string; // Added for compatibility with existing code
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
  message?: string;
}

export const cartService = {
  async getCart(): Promise<CartResponse> {
    try {
      const response = await api.get('/cart');
      // Map _id to id for backward compatibility
      if (response.data.data.items) {
        response.data.data.items = response.data.data.items.map(item => ({
          ...item,
          id: item._id // Add id property that points to _id for compatibility
        }));
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  async addToCart(product: { 
    id: string, 
    name: string, 
    subtitle: string, 
    price: number, 
    quantity: number, 
    image: string 
  }): Promise<CartResponse> {
    try {
      const response = await api.post('/cart/items', {
        productId: product.id,
        name: product.name,
        subtitle: product.subtitle,
        price: product.price,
        quantity: product.quantity,
        image: product.image
      });
      
      // Map _id to id for backward compatibility
      if (response.data.data.items) {
        response.data.data.items = response.data.data.items.map(item => ({
          ...item,
          id: item._id // Add id property that points to _id for compatibility
        }));
      }
      return response.data;
    } catch (error) {
      console.error('Error adding product to cart:', error);
      throw error;
    }
  },

  async updateCartItem(productId: string, quantity: number): Promise<CartResponse> {
    try {
      const response = await api.put(`/cart/items/${productId}`, {
        quantity
      });
      // Map _id to id for backward compatibility
      if (response.data.data.items) {
        response.data.data.items = response.data.data.items.map(item => ({
          ...item,
          id: item._id // Add id property that points to _id for compatibility
        }));
      }
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  async removeFromCart(productId: string): Promise<CartResponse> {
    try {
      const response = await api.delete(`/cart/items/${productId}`);
      // Map _id to id for backward compatibility
      if (response.data.data.items) {
        response.data.data.items = response.data.data.items.map(item => ({
          ...item,
          id: item._id // Add id property that points to _id for compatibility
        }));
      }
      return response.data;
    } catch (error) {
      console.error('Error removing product from cart:', error);
      throw error;
    }
  },
  
  async clearCart(): Promise<CartResponse> {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};

export default cartService;
