
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  discountPrice?: number;
  volume: string;
  stock: number;
  images: string[];
  ingredients: string[];
  advantages: string[];
  skinType: string[];
  uses: string[];
}

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

const ProductCard = ({ product, onSelectProduct }: ProductCardProps) => {
  const { addToCart, isLoading } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setIsAddingToCart(true);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        subtitle: product.subtitle,
        price: product.discountPrice || product.price,
        quantity: 1,
        image: product.images[0]
      });
      
      toast({
        title: "Added to cart",
        description: `${product.name} added to your cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setIsAddingToCart(true);
    try {
      // Add to cart first
      await addToCart({
        id: product.id,
        name: product.name,
        subtitle: product.subtitle,
        price: product.discountPrice || product.price,
        quantity: 1,
        image: product.images[0]
      });
      
      // Then navigate to checkout
      navigate("/checkout");
    } catch (error) {
      console.error("Error with buy now:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const discountPercentage = product.discountPrice ? 
    Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 cursor-pointer group"
      onClick={() => onSelectProduct(product)}
    >
      <div className="relative h-72 overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discountPercentage > 0 && (
          <span className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            {discountPercentage}% OFF
          </span>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-serif text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
        <p className="text-muted-foreground mb-4 leading-relaxed">{product.subtitle}</p>
        <div className="flex items-baseline mb-6">
          {product.discountPrice ? (
            <>
              <span className="text-2xl font-bold text-primary">₹{product.discountPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground line-through ml-2">₹{product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-2xl font-bold text-primary">₹{product.price.toFixed(2)}</span>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline"
            className="py-2.5 rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <span className="animate-pulse">Adding...</span>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add
              </>
            )}
          </Button>
          
          <Button 
            className="py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
            onClick={handleBuyNow}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? "Adding..." : "Buy Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
