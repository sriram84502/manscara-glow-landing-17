
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Cart, CartResponse } from '@/services/cartService';
import cartService from '@/services/cartService';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: { id: string, name: string, subtitle: string, price: number, quantity: number, image: string }) => Promise<CartResponse | void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  cartCount: number;
  clearCart: () => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  items: CartItem[]; // Add this to make it compatible with existing code
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Fetch cart from API when component mounts
  useEffect(() => {
    async function fetchCart() {
      setIsLoading(true);
      try {
        const response = await cartService.getCart();
        setCart(response.data.items);
      } catch (error: any) {
        console.error('Failed to fetch cart:', error);
        // If unauthorized, use an empty cart
        if (error.status === 401) {
          setCart([]);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to load your cart. Please try again.',
            variant: 'destructive',
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchCart();
  }, [toast]);

  const addToCart = async (product: { id: string, name: string, subtitle: string, price: number, quantity: number, image: string }) => {
    setIsLoading(true);
    try {
      const response = await cartService.addToCart(product);
      setCart(response.data.items);
      toast({
        title: 'Success',
        description: 'Item added to cart successfully.',
      });
      return response;
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add item to cart.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const response = await cartService.updateCartItem(productId, quantity);
      setCart(response.data.items);
    } catch (error: any) {
      console.error('Error updating cart quantity:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update item quantity.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await cartService.removeFromCart(productId);
      setCart(response.data.items);
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove item from cart.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearCart = async () => {
    setIsLoading(true);
    try {
      await cartService.clearCart();
      setCart([]);
      toast({
        title: 'Success',
        description: 'Your cart has been cleared.',
      });
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to clear your cart.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Alias removeFromCart as removeItem for compatibility with existing code
  const removeItem = removeFromCart;

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount,
      removeItem,
      items: cart, // Add this to make it compatible with existing code
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
