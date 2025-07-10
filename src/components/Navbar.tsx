
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Get current pathname
  const pathname = location.pathname;
  const isHomePage = pathname === "/";
  const isCheckoutPage = pathname === "/checkout";
  const isCartPage = pathname === "/cart";

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

        {/* Right side: Cart and Guest Mode indicator */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          {!isCheckoutPage && (
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

          {/* Guest Mode Indicator */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <span>Guest Mode</span>
          </div>

          {/* Mobile menu button */}
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-white shadow-lg z-40 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col p-4 space-y-4">
            <Link 
              to="/" 
              className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100" 
              onClick={closeMenu}
            >
              <span>Home</span>
            </Link>
            <a 
              href="#catalog-section" 
              className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100" 
              onClick={(e) => handleAnchorClick(e, "catalog-section")}
            >
              <span>Products</span>
            </a>
            <a 
              href="#features-section" 
              className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100" 
              onClick={(e) => handleAnchorClick(e, "features-section")}
            >
              <span>Features</span>
            </a>
            <a 
              href="#benefits-section" 
              className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100" 
              onClick={(e) => handleAnchorClick(e, "benefits-section")}
            >
              <span>Benefits</span>
            </a>
            <a 
              href="#testimonials-section" 
              className="flex items-center space-x-2 py-3 px-4 rounded-md hover:bg-gray-100" 
              onClick={(e) => handleAnchorClick(e, "testimonials-section")}
            >
              <span>Testimonials</span>
            </a>
            <div className="py-3 px-4 text-sm text-gray-600 border-t">
              Guest Mode
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
