import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserData } from "@/types/user";
import { User, MapPin, Package, CreditCard, Heart, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";

interface ProfileSidebarProps {
  userData: UserData;
}

const ProfileSidebar = ({ userData }: ProfileSidebarProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const currentTab = new URLSearchParams(location.search).get('tab') || 'profile';

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4">
            {userData.profilePicture ? (
              <img 
                src={userData.profilePicture} 
                alt={`${userData.firstName} ${userData.lastName}`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                <User size={36} />
              </div>
            )}
          </div>
          <h2 className="text-xl font-medium">{`${userData.firstName} ${userData.lastName}`}</h2>
          <p className="text-gray-500 text-sm mt-1">{userData.email}</p>
        </div>
        
        <nav className="space-y-1">
          <Link to="/profile">
            <Button 
              variant={currentTab === 'profile' ? "default" : "ghost"} 
              className={`w-full justify-start ${currentTab === 'profile' ? 'bg-manscara-black hover:bg-black text-white' : ''}`}
            >
              <User className="mr-2 h-4 w-4" />
              Account
            </Button>
          </Link>
          <Link to="/profile?tab=orders">
            <Button 
              variant={currentTab === 'orders' ? "default" : "ghost"}
              className={`w-full justify-start ${currentTab === 'orders' ? 'bg-manscara-black hover:bg-black text-white' : ''}`}
            >
              <Package className="mr-2 h-4 w-4" />
              Orders
            </Button>
          </Link>
          <Link to="/profile?tab=addresses">
            <Button 
              variant={currentTab === 'addresses' ? "default" : "ghost"}
              className={`w-full justify-start ${currentTab === 'addresses' ? 'bg-manscara-black hover:bg-black text-white' : ''}`}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Addresses
            </Button>
          </Link>
          <Link to="/profile?tab=payment">
            <Button 
              variant={currentTab === 'payment' ? "default" : "ghost"}
              className={`w-full justify-start ${currentTab === 'payment' ? 'bg-manscara-black hover:bg-black text-white' : ''}`}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Payment Methods
            </Button>
          </Link>
          <Link to="/profile?tab=wishlist">
            <Button 
              variant={currentTab === 'wishlist' ? "default" : "ghost"}
              className={`w-full justify-start ${currentTab === 'wishlist' ? 'bg-manscara-black hover:bg-black text-white' : ''}`}
            >
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default ProfileSidebar;
