
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileSidebar from "@/components/ProfileSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { UserData } from "@/types/user";
import authService from "@/services/authService";
import AddressTab from "@/Profile/AddressTab";
import OrdersList from "@/components/OrdersList";
import { Order } from "@/types/checkout";
import orderService, { OrderSummaryResponse } from "@/services/orderService";

// Helper function to map OrderSummaryResponse to Order
const mapOrderResponseToOrder = (orderResponse: OrderSummaryResponse): Order => {
  return {
    id: orderResponse._id,
    date: orderResponse.createdAt || new Date().toISOString(),
    status: orderResponse.status,
    total: orderResponse.total,
    items: orderResponse.items.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: '', // API doesn't provide images in the summary
      subtitle: '' // API doesn't provide subtitle in the summary
    })),
    // Default values for required fields not in the API response
    shippingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      region: '',
      postalCode: '',
      country: '',
      phone: ''
    },
    subtotal: orderResponse.total, // Fallback to total if subtotal not available
    shippingCost: 0,
    tax: 0,
    trackingNumber: orderResponse.trackingNumber
  };
};

const Profile = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'profile';
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileData = await authService.getProfile();
        setUserData(profileData);
        setUpdatedUserData({...profileData});
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setIsLoading(false);
        toast({
          title: "Error loading profile",
          description: "Your profile information could not be loaded. Please try again.",
          variant: "destructive",
        });
        navigate("/auth/login");
      }
    };
    
    fetchUserProfile();
  }, [navigate, toast]);

  // Fetch orders when user navigates to orders tab
  useEffect(() => {
    if (currentTab === 'orders' && !ordersLoading && orders.length === 0) {
      const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
          const userOrdersResponse = await orderService.getAllOrders();
          // Map the API response format to our Order interface format
          const mappedOrders = userOrdersResponse.map(mapOrderResponseToOrder);
          setOrders(mappedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
          toast({
            title: "Error loading orders",
            description: "Your orders could not be loaded. Please try again.",
            variant: "destructive",
          });
        } finally {
          setOrdersLoading(false);
        }
      };
      
      fetchOrders();
    }
  }, [currentTab, ordersLoading, orders.length, toast]);

  const handleProfileUpdate = async () => {
    if (!updatedUserData) return;
    
    try {
      await authService.updateProfile({
        firstName: updatedUserData.firstName,
        lastName: updatedUserData.lastName,
        phone: updatedUserData.phone,
      });
      
      // Refresh the profile data
      const updatedProfile = await authService.getProfile();
      setUserData(updatedProfile);
      setEditingProfile(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-manscara-offwhite flex flex-col">
        <Navbar />
        <main className="flex-grow container py-8 md:py-12 px-4 flex items-center justify-center">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h1 className="text-2xl font-medium mb-2">Loading profile...</h1>
                <p className="text-gray-500">Please wait while we load your profile information.</p>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-manscara-offwhite flex flex-col">
        <Navbar />
        <main className="flex-grow container py-8 md:py-12 px-4 flex items-center justify-center">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h1 className="text-2xl font-medium mb-2">Profile not found</h1>
                <p className="text-gray-500">Unable to load your profile information.</p>
                <Button className="mt-4" onClick={() => navigate('/auth/login')}>
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-manscara-offwhite flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8 md:py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <ProfileSidebar userData={userData} />
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue={currentTab} value={currentTab} onValueChange={(value) => {
              navigate(`/profile${value === 'profile' ? '' : `?tab=${value}`}`);
            }}>
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-medium">Personal Information</h2>
                      {!editingProfile ? (
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingProfile(true)}
                          className="flex items-center"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      ) : null}
                    </div>
                    
                    {!editingProfile ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-500">First Name</Label>
                            <p>{userData.firstName}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Last Name</Label>
                            <p>{userData.lastName}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-500">Email</Label>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-500 mr-2" />
                            <p>{userData.email}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-500">Phone</Label>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-500 mr-2" />
                            <p>{userData.phone || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input 
                              id="firstName"
                              value={updatedUserData?.firstName || ""} 
                              onChange={(e) => setUpdatedUserData(prev => prev ? {...prev, firstName: e.target.value} : null)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input 
                              id="lastName"
                              value={updatedUserData?.lastName || ""} 
                              onChange={(e) => setUpdatedUserData(prev => prev ? {...prev, lastName: e.target.value} : null)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email"
                            type="email" 
                            value={updatedUserData?.email || ""} 
                            disabled
                            className="bg-gray-100"
                          />
                          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone"
                            value={updatedUserData?.phone || ""} 
                            onChange={(e) => setUpdatedUserData(prev => prev ? {...prev, phone: e.target.value} : null)}
                          />
                        </div>
                        <div className="flex space-x-3">
                          <Button onClick={handleProfileUpdate} className="bg-manscara-black hover:bg-black">
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => {
                            setEditingProfile(false);
                            setUpdatedUserData({...userData});
                          }}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Addresses Tab */}
              <TabsContent value="addresses">
                <AddressTab />
              </TabsContent>
              
              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-medium mb-6">Order History</h2>
                    <OrdersList orders={orders} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
