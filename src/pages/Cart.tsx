import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Minus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateCoupon, calculateDiscount } from "@/utils/couponUtils";
import { Coupon } from "@/types/checkout";
import { Skeleton } from "@/components/ui/skeleton";

const Cart = () => {
  const { items, updateQuantity, clearCart, removeItem, isLoading } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [processingItem, setProcessingItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Make sure items exists before trying to reduce it
  const cartTotal = items && items.length > 0 
    ? items.reduce((total, item) => {
        const itemPrice = Number(item.price) || 0;
        return total + (itemPrice * item.quantity);
      }, 0)
    : 0;

  // Load any saved coupon when component mounts
  useState(() => {
    const savedCouponData = localStorage.getItem('checkoutCouponData');
    if (savedCouponData) {
      try {
        const { appliedCoupon, discountAmount } = JSON.parse(savedCouponData);
        if (appliedCoupon) {
          setAppliedCoupon(appliedCoupon);
          setCouponCode(appliedCoupon.code);
          setDiscountAmount(discountAmount);
        }
      } catch (error) {
        console.error("Error parsing saved coupon data:", error);
      }
    }
  });

  const handleQuantityChange = async (itemId: string, change: number) => {
    const item = items.find((i) => (i._id || i.id) === itemId);
    if (!item) return;

    setProcessingItem(itemId);
    
    try {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        await updateQuantity(item.productId || item.id, newQuantity);
      } else {
        await removeItem(item.productId || item.id);
      }
      
      // Recalculate discount if a coupon is applied
      if (appliedCoupon) {
        const updatedCart = items.map(cartItem => 
          (cartItem._id || cartItem.id) === itemId 
            ? { ...cartItem, quantity: newQuantity } 
            : cartItem
        );
        
        const newTotal = updatedCart
          .filter(item => item.quantity > 0)
          .reduce((total, item) => total + (item.price * item.quantity), 0);
        
        const newDiscount = calculateDiscount(newTotal, appliedCoupon.discountPercentage);
        setDiscountAmount(newDiscount);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingItem(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const item = items.find((i) => (i._id || i.id) === itemId);
    if (!item) return;
    
    setProcessingItem(itemId);
    try {
      await removeItem(item.productId || item.id);
      
      toast({
        title: "Item removed",
        description: "Item removed from your cart.",
      });
      
      // Recalculate discount if a coupon is applied
      if (appliedCoupon) {
        const updatedCart = items.filter(cartItem => (cartItem._id || cartItem.id) !== itemId);
        const newTotal = updatedCart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const newDiscount = calculateDiscount(newTotal, appliedCoupon.discountPercentage);
        setDiscountAmount(newDiscount);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingItem(null);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setCouponCode("");
      localStorage.removeItem('checkoutCouponData');
      // Toast notification is now handled in the CartContext
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const result = await validateCoupon(couponCode, cartTotal);
      
      if (result.valid && result.coupon) {
        const discount = calculateDiscount(cartTotal, result.coupon.discountPercentage);
        setAppliedCoupon(result.coupon);
        setDiscountAmount(discount);
        
        // Save the coupon data for checkout
        const couponData = {
          appliedCoupon: result.coupon,
          discountAmount: discount
        };
        localStorage.setItem('checkoutCouponData', JSON.stringify(couponData));
        
        toast({
          title: "Coupon applied",
          description: `${result.coupon.description} has been applied to your order.`,
        });
      } else {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        localStorage.removeItem('checkoutCouponData');
        toast({
          title: "Coupon error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast({
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCheckout = () => {
    // Store coupon data for checkout if there's an applied coupon
    if (appliedCoupon) {
      const checkoutData = {
        appliedCoupon,
        discountAmount
      };
      localStorage.setItem('checkoutCouponData', JSON.stringify(checkoutData));
    }
    
    navigate("/checkout");
  };

  const discountedTotal = cartTotal - discountAmount;
  // Changed: shipping cost is now always 0 (free)
  const shippingCost = 0; 
  // GST is included in the price, but we'll calculate it for display purposes
  const taxRate = 0.18; // 18% GST
  const includedTax = (cartTotal * taxRate) / (1 + taxRate); // Calculate the tax that's already included
  const finalTotal = discountedTotal + shippingCost; // No additional tax is added

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <Skeleton className="h-8 w-1/3 mb-6" />
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 pb-6 border-b">
                      <Skeleton className="h-24 w-24 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div>
              <Card className="p-6">
                <Skeleton className="h-6 w-1/2 mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-full mt-6" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
          <div className="bg-white p-8 rounded-lg shadow-md mb-6">
            <svg 
              className="w-24 h-24 mx-auto mb-4 text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-md hover:bg-black/80 transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-between border-b pb-4 mb-4">
              <h2 className="text-lg font-medium">Cart Items ({items.length})</h2>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </div>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id || item.id} className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b last:border-0">
                  <div className="flex items-center flex-grow mb-4 sm:mb-0">
                    <div className="w-16 h-16 mr-4 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.subtitle}</p>
                      <p className="font-medium mt-1">₹{Number(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className="flex items-center border rounded-md">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="px-2 h-8 rounded-none" 
                        onClick={() => handleQuantityChange(item._id || item.id, -1)}
                        disabled={processingItem === (item._id || item.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">
                        {processingItem === (item._id || item.id) ? "..." : item.quantity}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="px-2 h-8 rounded-none" 
                        onClick={() => handleQuantityChange(item._id || item.id, 1)}
                        disabled={processingItem === (item._id || item.id)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">₹{(Number(item.price) * item.quantity).toFixed(2)}</div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600 p-0 h-auto" 
                        onClick={() => handleRemoveItem(item._id || item.id)}
                        disabled={processingItem === (item._id || item.id)}
                      >
                        {processingItem === (item._id || item.id) ? 
                          "Removing..." : 
                          (<><Trash2 className="h-4 w-4 mr-1" /> Remove</>)
                        }
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Link 
                to="/" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <h2 className="text-lg font-medium border-b pb-4 mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon.discountPercentage}%)</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">GST (Included)</span>
                <span className="font-medium">₹{includedTax.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="coupon" className="block text-sm font-medium mb-2">Coupon Code</label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-grow"
                />
                <Button 
                  onClick={handleApplyCoupon} 
                  variant="outline"
                >
                  Apply
                </Button>
              </div>
              
              {appliedCoupon && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                  {appliedCoupon.description} applied!
                </div>
              )}
            </div>
            
            <Button 
              className="w-full bg-black text-white hover:bg-black/80" 
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
