import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserData } from "@/types/user";
import { useCart } from "@/context/CartContext";
import { User, ShoppingCart, Home, Package, LogOut, MapPin, CreditCard, Heart, Menu, X, ShoppingBag, Info } from "lucide-react";
import authService from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const { cartCount } = useCart();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Get current pathname
  const pathname = location.pathname;
  const isHomePage = pathname === "/";
  const isCheckoutPage = pathname === "/checkout";
  const isProfilePage = pathname.startsWith("/profile");
  const isCartPage = pathname === "/cart";
  const isAuthPage = pathname.startsWith("/auth/");

  // Check if user is logged in
  useEffect(() => {
    const userData = authService.getUserData();
    setUser(userData);
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const response = await authService.logout();
      
      toast({
        title: "Logout Successful",
        description: response.message || "You have been logged out successfully.",
      });
      
      // Update the user state to reflect logout
      setUser(null);
      
      // Optionally redirect to home page
      window.location.href = "/";
    } catch (error: any) {
      toast({
        title: "Logout Error",
        description: error.message || "An error occurred during logout.",
        variant: "destructive",
      });
      
      // Still update the user state to reflect logout
      setUser(null);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Function to handle anchor links with smooth scrolling
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, sectionId: string) => {
    e.preventDefault();
    closeMenu();
    
    // Only scroll if on homepage
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on homepage, navigate to homepage with the section as hash
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo - Mobile shows only logo, desktop shows logo and text */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/lovable-uploads/619af646-e154-42b0-91d9-8b80937da07b.png"
            alt="Manscara Logo"
            className="h-10 w-auto"
            width="40"
            height="40"
          />
          <span className="text-2xl font-serif font-bold hidden md:inline">Manscara</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm font-medium hover:text-gray-600 transition-colors ${
              isHomePage ? "text-black" : "text-gray-500"
            }`}
          >
            Home
          </Link>
          
          {/* Match with Homepage sections */}
          <a 
            href="#catalog-section" 
            className="text-sm font-medium text-gray-500 hover:text-gray-600 transition-colors"
            onClick={(e) => handleAnchorClick(e, "catalog-section")}
          >
            Products
          </a>
          <a
            href="#features-section"
            className="text-sm font-medium text-gray-500 hover:text-gray-600 transition-colors"
            onClick={(e) => handleAnchorClick(e, "features-section")}
          >
            Features
          </a>
          <a
            href="#benefits-section"
            className="text-sm font-medium text-gray-500 hover:text-gray-600 transition-colors"
            onClick={(e) => handleAnchorClick(e, "benefits-section")}
          >
            Benefits
          </a>
          <a
            href="#testimonials-section"
            className="text-sm font-medium text-gray-500 hover:text-gray-600 transition-colors"
            onClick={(e) => handleAnchorClick(e, "testimonials-section")}
          >
            Testimonials
          </a>
        </nav>

        {/* Right side: Cart, Account */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon - adjusted for better mobile spacing */}
          {!isCheckoutPage && !isAuthPage && (
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="sm" className="rounded-full p-1 sm:p-2">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-manscara-black text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          )}

          {/* User Menu */}
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
          ) : (
            <Link to="/auth/login">
              <Button variant="default" size="sm" className="bg-manscara-black hover:bg-black">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile menu button - improved with animation */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 transition-all duration-200" />
            ) : (
              <Menu className="h-5 w-5 transition-all duration-200" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu - fixed positioning to ensure it appears correctly */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-white shadow-lg z-40 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col p-4 space-y-4">
            <Link 
              to="/" 
              className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100" 
              onClick={closeMenu}
            >
              <Home className="h-5 w-5" /> 
              <span>Home</span>
            </Link>
            <a 
              href="#catalog-section" 
              className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100" 
              onClick={(e) => handleAnchorClick(e, "catalog-section")}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Products</span>
            </a>
            <a 
              href="#features-section" 
              className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100" 
              onClick={(e) => handleAnchorClick(e, "features-section")}
            >
              <Package className="h-5 w-5" />
              <span>Features</span>
            </a>
            <a 
              href="#benefits-section" 
              className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100" 
              onClick={(e) => handleAnchorClick(e, "benefits-section")}
            >
              <Heart className="h-5 w-5" />
              <span>Benefits</span>
            </a>
            <a 
              href="#testimonials-section" 
              className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100" 
              onClick={(e) => handleAnchorClick(e, "testimonials-section")}
            >
              <User className="h-5 w-5" />
              <span>Testimonials</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
