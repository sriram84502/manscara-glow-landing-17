import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShippingAddress, PaymentMethod, OrderSummary, Coupon } from "@/types/checkout";
import { UserData } from "@/types/user";
import { Home, Package, LogOut, MapPin, CreditCard, Heart, User, Plus, Minus, Trash2, ArrowLeft, Wallet, CheckCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { validateCoupon, calculateDiscount } from "@/utils/couponUtils";
import { Separator } from "@/components/ui/separator";
import { getSavedAddresses, saveAddress, saveUserAddress, savePaymentMethod, saveOrder, getSavedPaymentMethods } from "@/utils/addressUtils";
import { createRazorpayPayment, formatAmountForRazorpay, RazorpayResponse } from "@/utils/razorpayUtils";
import { AvailableCoupons } from "@/components/AvailableCoupons";
import orderService from "@/services/orderService";

const shippingAddressSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  region: z.string().min(2, {
    message: "Region must be at least 2 characters.",
  }),
  postalCode: z.string().min(5, {
    message: "Postal code must be at least 5 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  email: z.string().email("Please enter a valid email address"),
});

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const Checkout = () => {
  const { items, clearCart, cartCount } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<
    "shipping" | "order" | "payment"
  >("shipping");
  const [isCartEmpty, setIsCartEmpty] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showSaveAddressDialog, setShowSaveAddressDialog] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [isProcessingCoupon, setIsProcessingCoupon] = useState(false);

  // New state variables to track section completion
  const [shippingCompleted, setShippingCompleted] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        if (parsedUser.email) {
          setCustomerEmail(parsedUser.email);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      setUser(null);
    }
    
    // Load saved addresses
    const addresses = getSavedAddresses();
    setSavedAddresses(addresses);
    
    // Load saved coupon data
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
  }, []);

  useEffect(() => {
    if (cartCount === 0) {
      setIsCartEmpty(true);
    } else {
      setIsCartEmpty(false);
    }
  }, [cartCount]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUser(null);
    window.location.href = "/";
  };

  const shippingForm = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      region: "",
      postalCode: "",
      country: "India", // Default country set to India
      phone: "",
      email: user?.email || "",
    },
  });

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [order, setOrder] = useState<OrderSummary | null>(null);

  const fillFormWithSavedAddress = (address: ShippingAddress) => {
    shippingForm.reset({
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      city: address.city,
      region: address.region,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      email: address.email,
    });
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = 0;
  const taxRate = 0.18; // GST 18%
  const tax = subtotal * taxRate;
  const total = subtotal - discountAmount + shippingCost;

  const handleApplyCoupon = async () => {
    setIsProcessingCoupon(true);
    
    try {
      const result = await validateCoupon(couponCode, subtotal);
      
      if (result.valid && result.coupon) {
        const discount = calculateDiscount(subtotal, result.coupon.discountPercentage);
        setAppliedCoupon(result.coupon);
        setDiscountAmount(discount);
        
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
      setAppliedCoupon(null);
      setDiscountAmount(0);
      toast({
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingCoupon(false);
    }
  };

  const handleShippingSubmit = (values: z.infer<typeof shippingAddressSchema>) => {
    const shippingData: ShippingAddress = {
      firstName: values.firstName,
      lastName: values.lastName,
      address: values.address,
      city: values.city,
      region: values.region,
      postalCode: values.postalCode,
      country: values.country,
      phone: values.phone,
      email: values.email,
    };
    
    setShippingAddress(shippingData);
    setShippingCompleted(true);
    setActiveSection("order");
    
    const addressExists = savedAddresses.some(
      addr => addr.address === shippingData.address && 
              addr.postalCode === shippingData.postalCode
    );
    
    if (!addressExists) {
      setShowSaveAddressDialog(true);
    }
  };

  const handleSaveAddress = () => {
    if (shippingAddress) {
      saveAddress(shippingAddress);
      setSavedAddresses(getSavedAddresses());
      toast({
        title: "Address saved",
        description: "Your address has been saved for future use."
      });
    }
    setShowSaveAddressDialog(false);
  };

  const handleOrderConfirm = () => {
    setOrderCompleted(true);
    setActiveSection("payment");
    
    if (shippingAddress) {
      const orderSummary: OrderSummary = {
        shippingAddress,
        billingAddress: null,
        paymentMethod: null,
        items,
        subtotal,
        shippingCost,
        tax,
        total,
        appliedCoupon,
        discountAmount,
      };
      
      setOrder(orderSummary);
    }
  };

  const handlePlaceOrder = (values: z.infer<typeof emailSchema>) => {
    setIsProcessingPayment(true);
    
    if (shippingAddress && order) {
      createRazorpayPayment({
        amount: formatAmountForRazorpay(total),
        currency: "INR",
        name: "Manscara",
        description: `Order for ${shippingAddress.firstName} ${shippingAddress.lastName}`,
        prefill: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          email: values.email,
          contact: shippingAddress.phone,
        },
        theme: {
          color: "#000000"
        },
        handler: async function(response: RazorpayResponse) {
          setPaymentSuccess(true);
          setPaymentId(response.razorpay_payment_id);
          
          try {
            const paymentData: PaymentMethod = {
              nameOnCard: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
              cardNumber: `razorpay_${response.razorpay_payment_id.slice(-4)}`,
              expiryDate: "NA",
              cvv: "NA",
              razorpayPaymentId: response.razorpay_payment_id
            };
            
            if (order) {
              order.paymentMethod = paymentData;
              
              const orderData = {
                shippingAddress,
                saveShippingAddress: false,
                couponCode: appliedCoupon?.code,
                paymentMethod: paymentData,
                customerEmail: values.email,
                items,
                subtotal,
                tax,
                total,
                discountAmount
              };
              
              const orderResult = await orderService.createOrder(orderData);
              
              if (orderResult) {
                clearCart();
                localStorage.removeItem('checkoutCouponData');
                
                navigate("/");
                
                toast({
                  title: "Order placed",
                  description: `Your order has been placed successfully. Receipt sent to ${values.email}.`
                });
              } else {
                toast({
                  title: "Order Error",
                  description: "There was an issue saving your order. Please contact support.",
                  variant: "destructive"
                });
              }
            }
          } catch (error) {
            console.error("Error processing order after payment:", error);
            toast({
              title: "Order processing error",
              description: "Your payment was successful, but there was an issue processing your order.",
              variant: "destructive"
            });
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false);
            toast({
              title: "Payment cancelled",
              description: "You have cancelled the payment.",
              variant: "destructive"
            });
          }
        }
      }).catch(error => {
        console.error("Razorpay error:", error);
        setIsProcessingPayment(false);
        toast({
          title: "Payment error",
          description: "There was an error processing your payment.",
          variant: "destructive"
        });
      });
    }
  };

  const canAccessOrderSection = shippingCompleted;
  const canAccessPaymentSection = shippingCompleted && orderCompleted;

  return (
    <div className="bg-manscara-offwhite min-h-screen">
      <div className="container py-12">
        <header className="flex items-center justify-between mb-8">
          <Link to="/" className="text-2xl font-serif font-bold">
            Manscara
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    {user.profilePicture ? (
                      <AvatarImage src={user.profilePicture} alt={user.firstName} />
                    ) : null}
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {user.firstName?.charAt(0)}
                      {user.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs font-normal text-gray-500">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/profile?tab=orders">
                  <DropdownMenuItem className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    <span>Orders</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/profile?tab=addresses">
                  <DropdownMenuItem className="cursor-pointer">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>Addresses</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/profile?tab=payment">
                  <DropdownMenuItem className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Payment Methods</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/profile?tab=wishlist">
                  <DropdownMenuItem className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Wishlist</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </header>

        {isCartEmpty ? (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Your cart is empty</CardTitle>
              <CardDescription>
                Looks like you haven't added anything to your cart yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:order-1">
              <Accordion
                type="single"
                value={activeSection}
                collapsible={false}
                className="w-full"
              >
                <AccordionItem value="shipping">
                  <AccordionTrigger 
                    className={`${activeSection === "shipping" ? "bg-accent" : ""} ${shippingCompleted ? "text-green-600" : ""}`}
                    disabled={activeSection !== "shipping"}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">1. Shipping Address</span>
                      {shippingCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="shadow-sm">
                      <CardContent className="pt-6">
                        {savedAddresses.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-sm font-medium mb-3">Saved Addresses</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {savedAddresses.map((address, index) => (
                                <div 
                                  key={index}
                                  className="border rounded-md p-3 cursor-pointer hover:border-black transition-colors"
                                  onClick={() => fillFormWithSavedAddress(address)}
                                >
                                  <p className="font-medium">{address.firstName} {address.lastName}</p>
                                  <p className="text-sm text-gray-600">{address.address}</p>
                                  <p className="text-sm text-gray-600">
                                    {address.city}, {address.region} {address.postalCode}
                                  </p>
                                  <p className="text-sm text-gray-600">{address.country}</p>
                                </div>
                              ))}
                            </div>
                            <Separator className="my-6" />
                            <p className="text-sm font-medium mb-3">Or enter a new address:</p>
                          </div>
                        )}
                        
                        <Form {...shippingForm}>
                          <form
                            onSubmit={shippingForm.handleSubmit(handleShippingSubmit)}
                            className="space-y-4"
                          >
                            <FormField
                              control={shippingForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="John"
                                      {...field}
                                      className="rounded-md"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={shippingForm.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Doe"
                                      {...field}
                                      className="rounded-md"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={shippingForm.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>House Number, Building Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="123 Main St, Apartment 4B"
                                      {...field}
                                      className="rounded-md"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={shippingForm.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Mumbai"
                                      {...field}
                                      className="rounded-md"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={shippingForm.control}
                              name="region"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Road Name, Area, Colony</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="MG Road, Bandra West"
                                      {...field}
                                      className="rounded-md"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={shippingForm.control}
                              name="postalCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Pin Code</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="400001"
                                      {...field}
                                      className="rounded-md"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={shippingForm.control}
                              name="country"
                              render={({ field }) => (
                                <input type="hidden" {...field} />
                              )}
                            />
                            <FormField
                              control={shippingForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="+91 9876543210"
                                      {...field}
                                      className="rounded-md"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={shippingForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="your@email.com"
                                      {...field}
                                      className="rounded-md"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="submit"
                              className="bg-manscara-black text-white rounded-md hover:bg-gray-800 transition-colors"
                            >
                              Continue to Order Summary
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="order">
                  <AccordionTrigger 
                    className={`${activeSection === "order" ? "bg-accent" : ""} ${!canAccessOrderSection ? "opacity-50 cursor-not-allowed" : ""} ${orderCompleted ? "text-green-600" : ""}`}
                    disabled={!canAccessOrderSection || activeSection !== "order"}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">2. Order Summary</span>
                      {orderCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="shadow-sm">
                      <CardContent className="pt-6">
                        {shippingAddress && (
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                              Shipping Address
                            </h3>
                            <div className="bg-gray-50 p-3 rounded-md">
                              <div>{shippingAddress.firstName} {shippingAddress.lastName}</div>
                              <div>{shippingAddress.address}</div>
                              <div>{shippingAddress.city}, {shippingAddress.region} {shippingAddress.postalCode}</div>
                              <div>{shippingAddress.country}</div>
                              <div>{shippingAddress.phone}</div>
                            </div>

                            <h3 className="text-lg font-semibold">
                              Order Items
                            </h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Product</TableHead>
                                  <TableHead>Quantity</TableHead>
                                  <TableHead>Price</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {items.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>₹{item.price}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>

                            <div className="space-y-2 pt-4">
                              <div className="flex justify-between">
                                <div>Subtotal</div>
                                <div>₹{Number(subtotal).toFixed(2)}</div>
                              </div>
                              
                              {appliedCoupon && (
                                <div className="flex justify-between text-green-600">
                                  <div>Discount ({appliedCoupon.discountPercentage}%)</div>
                                  <div>-₹{Number(discountAmount).toFixed(2)}</div>
                                </div>
                              )}
                              
                              <div className="flex justify-between">
                                <div>Shipping</div>
                                <div className="text-green-600">Free</div>
                              </div>
                              <div className="flex justify-between">
                                <div>GST (18% Included)</div>
                                <div>₹{Number(tax).toFixed(2)}</div>
                              </div>
                              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                <div>Total</div>
                                <div>₹{Number(total).toFixed(2)}</div>
                              </div>
                            </div>

                            <div className="mt-6">
                              <label htmlFor="checkout-coupon" className="block text-sm font-medium mb-2">Coupon Code</label>
                              <div className="flex gap-2">
                                <Input
                                  id="checkout-coupon"
                                  value={couponCode}
                                  onChange={(e) => setCouponCode(e.target.value)}
                                  placeholder="Enter coupon code"
                                  className="flex-grow"
                                  disabled={isProcessingCoupon}
                                />
                                <Button 
                                  onClick={handleApplyCoupon}
                                  variant="outline"
                                  disabled={isProcessingCoupon}
                                >
                                  {isProcessingCoupon ? (
                                    <div className="flex items-center">
                                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Applying...
                                    </div>
                                  ) : "Apply"}
                                </Button>
                              </div>
                              
                              {appliedCoupon && (
                                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                                  {appliedCoupon.description} applied!
                                </div>
                              )}
                              
                              <div className="mt-6">
                                <AvailableCoupons 
                                  onSelectCoupon={(code) => {
                                    setCouponCode(code);
                                    handleApplyCoupon();
                                  }} 
                                  currentSubtotal={subtotal}
                                  appliedCouponCode={appliedCoupon?.code}
                                />
                              </div>
                            </div>

                            <Button
                              onClick={handleOrderConfirm}
                              className="bg-manscara-black text-white rounded-md hover:bg-gray-800 transition-colors w-full mt-6"
                            >
                              Proceed to Payment
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payment">
                  <AccordionTrigger 
                    className={`${activeSection === "payment" ? "bg-accent" : ""} ${!canAccessPaymentSection ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!canAccessPaymentSection || activeSection !== "payment"}
                  >
                    3. Payment
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="shadow-sm">
                      <CardContent className="pt-6">
                        {paymentSuccess ? (
                          <div className="text-center p-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Payment Successful!</h3>
                            <p className="text-sm text-gray-500 mt-1">Payment ID: {paymentId}</p>
                            <div className="mt-6">
                              <Button
                                onClick={() => navigate("/profile?tab=orders")}
                                className="bg-manscara-black text-white rounded-md hover:bg-gray-800 transition-colors"
                              >
                                View Orders
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Form {...emailForm}>
                            <form
                              onSubmit={emailForm.handleSubmit(handlePlaceOrder)}
                              className="space-y-4"
                            >
                              <div className="bg-gray-50 p-4 rounded-md border mb-4">
                                <div className="flex items-center gap-3 mb-2">
                                  <Wallet className="h-5 w-5 text-gray-700" />
                                  <h3 className="font-medium text-gray-800">Pay with Razorpay</h3>
                                </div>
                                <p className="text-sm text-gray-600">Secure payment processing by Razorpay. You'll be redirected to complete the payment.</p>
                              </div>
                              
                              <FormField
                                control={emailForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="your@email.com"
                                        {...field}
                                        className="rounded-md"
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Receipt will be sent to this email
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <Button
                                type="submit"
                                className="bg-manscara-black text-white rounded-md hover:bg-gray-800 transition-colors w-full"
                                disabled={isProcessingPayment}
                              >
                                {isProcessingPayment ? (
                                  <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                  </div>
                                ) : `Place Order & Pay ₹${Number(total).toFixed(2)}`}
                              </Button>
                              
                              <div className="flex justify-center mt-4">
                                <div className="flex items-center gap-2">
                                  <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-4 h-4" />
                                  <span className="text-sm text-gray-500">Secured by Razorpay</span>
                                </div>
                              </div>
                            </form>
                          </Form>
                        )}
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="md:order-2">
              <Card className="shadow-md sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>
                    Review your order details before checkout.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={2}>Subtotal</TableCell>
                        <TableCell className="text-lg font-bold">₹{Number(subtotal).toFixed(2)}</TableCell>
                      </TableRow>
                      
                      {appliedCoupon && (
                        <TableRow>
                          <TableCell colSpan={2}>Discount ({appliedCoupon.discountPercentage}%)</TableCell>
                          <TableCell className="text-green-600">-₹{Number(discountAmount).toFixed(2)}</TableCell>
                        </TableRow>
                      )}
                      
                      <TableRow>
                        <TableCell colSpan={2}>Shipping</TableCell>
                        <TableCell className="text-green-600">Free</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>GST (18% Included)</TableCell>
                        <TableCell>₹{Number(tax).toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell className="text-lg font-bold">₹{Number(total).toFixed(2)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                  
                  {activeSection === "shipping" && (
                    <Button
                      onClick={() => shippingForm.handleSubmit(handleShippingSubmit)()}
                      className="bg-manscara-black text-white rounded-md hover:bg-gray-800 transition-colors w-full mt-6"
                    >
                      Continue to Order Summary
                    </Button>
                  )}
                  
                  {activeSection === "order" && canAccessOrderSection && (
                    <Button
                      onClick={handleOrderConfirm}
                      className="bg-manscara-black text-white rounded-md hover:bg-gray-800 transition-colors w-full mt-6"
                    >
                      Proceed to Payment
                    </Button>
                  )}
                  
                  {activeSection === "payment" && canAccessPaymentSection && !paymentSuccess && (
                    <Button
                      onClick={() => emailForm.handleSubmit(handlePlaceOrder)()}
                      className="bg-manscara-black text-white rounded-md hover:bg-gray-800 transition-colors w-full mt-6"
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? "Processing..." : `Place Order & Pay ₹${Number(total).toFixed(2)}`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      <AlertDialog open={showSaveAddressDialog} onOpenChange={setShowSaveAddressDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Address</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to save this address for future use?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, don't save</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveAddress}>Yes, save address</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Checkout;
