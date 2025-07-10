
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
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition border border-gray-100 cursor-pointer"
      onClick={() => onSelectProduct(product)}
    >
      <div className="relative h-64">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        {discountPercentage > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discountPercentage}% OFF
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-serif text-xl font-semibold">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.subtitle}</p>
        <div className="flex items-baseline mb-4">
          {product.discountPrice ? (
            <>
              <span className="text-xl font-bold">₹{product.discountPrice.toFixed(2)}</span>
              <span className="text-sm text-gray-500 line-through ml-2">₹{product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-xl font-bold">₹{product.price.toFixed(2)}</span>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            className="bg-white border border-black text-black hover:bg-gray-100 py-2 rounded font-medium flex items-center justify-center"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <span className="animate-pulse">Adding...</span>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </>
            )}
          </Button>
          
          <Button 
            className="bg-black text-white py-2 rounded font-medium hover:bg-black/80 flex items-center justify-center"
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
