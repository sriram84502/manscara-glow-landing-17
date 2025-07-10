
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, ExternalLink, AlertTriangle, Link, Loader } from "lucide-react";
import { Order } from "@/types/checkout";
import { getUserOrders, getOrderDetails } from "@/utils/addressUtils";
import { useToast } from "@/hooks/use-toast";

interface OrdersListProps {
  orders?: Order[];
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'processing':
    case 'pending':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'out for delivery':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OrdersList = ({ orders: propOrders }: OrdersListProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const { toast } = useToast();
  
  // Fetch orders if not provided via props
  useEffect(() => {
    if (propOrders) {
      setOrders(propOrders);
    } else {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const userOrders = await getUserOrders();
          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
          toast({
            title: "Error",
            description: "Failed to load orders. Please try again later.",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchOrders();
    }
  }, [propOrders, toast]);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const viewOrderDetails = async (order: Order) => {
    setSelectedOrder(order);
    setLoadingOrderDetails(true);
    
    try {
      // If we have a basic order, fetch its full details
      const orderDetails = await getOrderDetails(order.id);
      if (orderDetails) {
        setSelectedOrderDetails(orderDetails);
      } else {
        setSelectedOrderDetails(order); // Fall back to the basic order data
      }
    } catch (error) {
      console.error(`Error fetching details for order ${order.id}:`, error);
      toast({
        title: "Error",
        description: "Failed to load order details. Please try again later.",
        variant: "destructive"
      });
      setSelectedOrderDetails(order); // Fall back to the basic order data
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const isOutForDelivery = (status: string) => {
    return status.toLowerCase() === 'out for delivery';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader className="h-6 w-6 animate-spin text-gray-500 mr-2" />
        <span className="text-gray-500">Loading orders...</span>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-10">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No orders yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Your order history will appear here once you make a purchase.
        </p>
        <div className="mt-6">
          <Button 
            onClick={() => window.location.href="/"} 
            className="bg-manscara-black hover:bg-black text-white"
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">Placed on {formatDate(order.date)}</p>
                </div>
                <Badge className={`${getStatusColor(order.status)} mt-2 sm:mt-0`}>
                  {order.status}
                </Badge>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                {order.items.slice(0, 2).map((item, idx) => (
                  <div key={item.id || idx} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">₹{item.price.toFixed(2)}</p>
                  </div>
                ))}
                
                {order.items.length > 2 && (
                  <p className="text-sm text-gray-500">
                    +{order.items.length - 2} more items
                  </p>
                )}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">Total: ₹{order.total.toFixed(2)}</p>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => viewOrderDetails(order)}
                    >
                      <ExternalLink className="mr-1 h-4 w-4" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
                      <DialogDescription>
                        {selectedOrder ? (
                          <>Placed on {formatDate(selectedOrder.date)} • Status: {selectedOrder.status}</>
                        ) : 'Loading...'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    {loadingOrderDetails ? (
                      <div className="flex items-center justify-center py-10">
                        <Loader className="h-6 w-6 animate-spin text-gray-500 mr-2" />
                        <span className="text-gray-500">Loading order details...</span>
                      </div>
                    ) : selectedOrderDetails ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div>
                            <h4 className="text-sm font-medium">Shipping Address</h4>
                            <div className="mt-2 text-sm">
                              <p>{selectedOrderDetails.shippingAddress?.firstName} {selectedOrderDetails.shippingAddress?.lastName}</p>
                              <p>{selectedOrderDetails.shippingAddress?.address}</p>
                              <p>{selectedOrderDetails.shippingAddress?.city}, {selectedOrderDetails.shippingAddress?.region} {selectedOrderDetails.shippingAddress?.postalCode}</p>
                              <p>{selectedOrderDetails.shippingAddress?.country}</p>
                              <p>{selectedOrderDetails.shippingAddress?.phone}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium">Payment Method</h4>
                            <div className="mt-2 text-sm">
                              {selectedOrderDetails.paymentMethod ? (
                                <>
                                  {selectedOrderDetails.paymentMethod.cardNumber && (
                                    <p>Card ending in {selectedOrderDetails.paymentMethod.cardNumber?.slice(-4)}</p>
                                  )}
                                  {selectedOrderDetails.paymentMethod.nameOnCard && (
                                    <p>{selectedOrderDetails.paymentMethod.nameOnCard}</p>
                                  )}
                                  {selectedOrderDetails.paymentMethod.razorpayPaymentId && (
                                    <p className="text-gray-500">Razorpay ID: {selectedOrderDetails.paymentMethod.razorpayPaymentId}</p>
                                  )}
                                </>
                              ) : (
                                <p>Payment information not available</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Tracking information */}
                        {isOutForDelivery(selectedOrderDetails.status) && selectedOrderDetails.trackingNumber && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <h4 className="text-sm font-medium flex items-center">
                              <Package className="mr-1 h-4 w-4" />
                              Tracking Information
                            </h4>
                            <div className="mt-2 text-sm">
                              <p>Tracking Number: {selectedOrderDetails.trackingNumber}</p>
                              {selectedOrderDetails.trackingUrl && (
                                <a 
                                  href={selectedOrderDetails.trackingUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 hover:underline flex items-center mt-1"
                                >
                                  <Link className="mr-1 h-4 w-4" />
                                  Track Package
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <Separator className="my-4" />
                        
                        <h4 className="text-sm font-medium mb-2">Order Items</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedOrderDetails.items.map((item, idx) => (
                              <TableRow key={item.id || idx}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>₹{item.price.toFixed(2)}</TableCell>
                                <TableCell>₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{selectedOrderDetails.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>₹{selectedOrderDetails.shippingCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>GST (18%)</span>
                            <span>₹{selectedOrderDetails.tax.toFixed(2)}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>₹{selectedOrderDetails.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-10 text-center">
                        <AlertTriangle className="mx-auto h-10 w-10 text-yellow-500" />
                        <p className="mt-2">Order details could not be loaded</p>
                      </div>
                    )}

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrdersList;
