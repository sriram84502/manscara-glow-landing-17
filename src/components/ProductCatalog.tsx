import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart, Eye, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import ProductCard from "./ProductCard";
import { getAllProducts, getProductById, Product } from "@/services/productService";
import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCatalogProps {
  className?: string;
}

const ProductCatalog = ({ className = "" }: ProductCatalogProps) => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const { toast } = useToast();
  const { addToCart } = useCart();

  // Fetch all products
  const { 
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError 
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => getAllProducts({ limit: 12, sort: 'newest' }),
  });

  // Fetch selected product details when a product is selected
  const { 
    data: selectedProductData,
    isLoading: isLoadingProduct,
    error: productError,
    refetch: refetchProduct
  } = useQuery({
    queryKey: ['product', selectedProductId],
    queryFn: () => selectedProductId ? getProductById(selectedProductId) : null,
    enabled: !!selectedProductId, // Only run query if we have a selectedProductId
  });

  const selectedProduct = selectedProductData?.data;

  const handleIncrement = () => {
    if (selectedProduct && quantity < selectedProduct.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSelectProduct = (product: Product) => {
    // If the product already has all the required fields, we can set it directly
    setSelectedProductId(product._id);
    setQuantity(1);
  };

  const handleAddToCart = (product: Product, qty: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    addToCart({
      id: product._id,
      name: product.name,
      subtitle: product.subtitle,
      price: product.discountPrice || product.price,
      quantity: qty,
      image: product.images[0]
    });

    toast({
      title: "Added to cart",
      description: `${qty} × ${product.name} added to your cart`,
    });
  };

  const discountPercentage = selectedProduct && selectedProduct.discountPrice ? 
    Math.round(((selectedProduct.price - selectedProduct.discountPrice) / selectedProduct.price) * 100) : 0;
  
  // Function to go back to all products view
  const handleBackToProducts = () => {
    setSelectedProductId(null);
  };

  // Loading and error states for product list
  if (isLoadingProducts) {
    return (
      <section id="catalog-section" className={`section-padding ${className}`}>
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 p-4">
                <Skeleton className="w-full h-64 mb-4" />
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-1/2 h-4 mb-4" />
                <Skeleton className="w-1/4 h-6 mb-6" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (productsError) {
    return (
      <section id="catalog-section" className={`section-padding ${className}`}>
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center">Our Products</h2>
          <div className="p-8 text-center">
            <p className="text-red-500 mb-4">Failed to load products. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </div>
        </div>
      </section>
    );
  }

  const products = productsData?.data.products || [];
  const isSingleProduct = products.length === 1;

  return (
    <section id="catalog-section" className={`section-padding ${className}`}>
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center">Our Products</h2>
        
        {selectedProductId ? (
          <div className="max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              className="mb-6 text-sm hover:bg-manscara-beige flex items-center gap-2"
              onClick={handleBackToProducts}
            >
              <ArrowLeft className="h-4 w-4" /> Back to all products
            </Button>
            
            {isLoadingProduct ? (
              <Card className="bg-white shadow-md overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
                    <Skeleton className="w-full h-96" />
                  </div>
                  <CardContent className="p-8 lg:p-10 space-y-6">
                    <div className="space-y-3">
                      <Skeleton className="w-3/4 h-8 mb-2" />
                      <Skeleton className="w-1/2 h-6 mb-4" />
                      <Skeleton className="w-1/4 h-6 mb-6" />
                    </div>
                    <Skeleton className="w-full h-24 mb-4" />
                    <Skeleton className="w-full h-12 mb-4" />
                    <Skeleton className="w-full h-16" />
                  </CardContent>
                </div>
              </Card>
            ) : productError ? (
              <div className="p-8 text-center bg-white rounded-lg shadow-md">
                <p className="text-red-500 mb-4">Failed to load product details. Please try again later.</p>
                <Button onClick={() => refetchProduct()}>Try Again</Button>
                <Button variant="outline" className="ml-4" onClick={handleBackToProducts}>
                  Back to Products
                </Button>
              </div>
            ) : selectedProduct ? (
              <Card className="bg-white shadow-md overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Product Image */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center relative h-[500px]">
                    {discountPercentage > 0 && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center rounded-full bg-red-500 text-white px-3 py-1.5 text-xs font-medium">
                          {discountPercentage}% OFF
                        </span>
                      </div>
                    )}
                    <img 
                      src={selectedProduct.images[0]} 
                      alt={selectedProduct.name} 
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <CardContent className="p-8 lg:p-10 space-y-6 bg-gradient-to-b from-white to-gray-50">
                    <div className="space-y-1">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-lg text-gray-600 italic">
                        {selectedProduct.subtitle}
                      </p>
                      <div className="flex items-baseline mt-4">
                        {selectedProduct.discountPrice ? (
                          <>
                            <h4 className="text-3xl font-bold text-manscara-black">
                              ₹{selectedProduct.discountPrice.toFixed(2)}
                            </h4>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ₹{selectedProduct.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <h4 className="text-3xl font-bold text-manscara-black">
                            ₹{selectedProduct.price.toFixed(2)}
                          </h4>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {selectedProduct.volume} • {selectedProduct.stock} in stock
                        </span>
                      </div>
                    </div>
                    
                    {/* Product Advantages */}
                    <div className="space-y-3 bg-manscara-offwhite p-4 rounded-lg">
                      <h5 className="font-medium">Key Benefits</h5>
                      <div className="grid grid-cols-2 gap-y-2">
                        {selectedProduct.advantages.map((advantage, i) => (
                          <div key={i} className="flex items-start space-x-2">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-manscara-black text-white text-xs">✓</span>
                            <span className="text-sm">{advantage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Skin Type */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2 font-medium">Suitable for:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.skinType.map((type, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 bg-manscara-beige rounded-full text-xs font-medium shadow-sm"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Add to Cart */}
                    <div className="pt-4">
                      <div className="flex items-center flex-wrap gap-4">
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleDecrement}
                            disabled={quantity <= 1}
                            className="text-gray-500 hover:text-black h-10 w-10 rounded-none"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center font-medium">{quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleIncrement}
                            disabled={quantity >= selectedProduct.stock}
                            className="text-gray-500 hover:text-black h-10 w-10 rounded-none"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-1 gap-2">
                          <Button 
                            onClick={() => handleAddToCart(selectedProduct, quantity)}
                            className="flex-1 bg-manscara-black text-white py-3 rounded font-medium hover:opacity-90 transition-opacity flex items-center justify-center shadow-md"
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add to Cart
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="flex-1 border-black text-black hover:bg-black hover:text-white py-3 shadow-sm"
                          >
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
                
                {/* Product Description and Additional Details */}
                <div className="px-8 pb-8 pt-0 lg:px-10 lg:pb-10">
                  <Separator className="my-6" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h4 className="font-serif font-medium mb-4 text-lg text-manscara-black inline-block border-b-2 border-manscara-black pb-1">Description</h4>
                      <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                      
                      <h4 className="font-serif font-medium mb-4 text-lg mt-8 text-manscara-black inline-block border-b-2 border-manscara-black pb-1">Recommended Uses</h4>
                      <ul className="text-gray-600 space-y-3">
                        {selectedProduct.uses.map((use, i) => (
                          <li key={i} className="flex items-start">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-manscara-beige text-manscara-black font-medium text-xs mr-3 mt-0.5">{i+1}</span>
                            <span className="flex-1">{use}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h4 className="font-serif font-medium mb-4 text-lg text-manscara-black inline-block border-b-2 border-manscara-black pb-1">Ingredients</h4>
                      <div className="text-gray-600 leading-relaxed space-y-2">
                        {selectedProduct.ingredients.map((ingredient, i) => (
                          <div key={i} className="flex items-center py-1.5 border-b border-gray-100 last:border-0">
                            <span className="w-2 h-2 bg-manscara-black rounded-full mr-3"></span>
                            <span>{ingredient}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 p-4 bg-manscara-blue bg-opacity-30 rounded-lg">
                        <h5 className="font-medium mb-2 text-sm">Product Guarantee</h5>
                        <p className="text-sm text-gray-600">Our products are cruelty-free, vegan, and made with sustainably sourced ingredients. We offer a 30-day satisfaction guarantee.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : null}
          </div>
        ) : (
          <div className="relative py-10">
            {isSingleProduct ? (
              <div className="max-w-md mx-auto">
                {products.length > 0 && (
                  <div className="transform transition-all hover:scale-105 duration-300">
                    <ProductCard 
                      product={{
                        id: products[0]._id,
                        name: products[0].name,
                        subtitle: products[0].subtitle,
                        description: products[0].description,
                        price: products[0].price,
                        discountPrice: products[0].discountPrice,
                        volume: products[0].volume,
                        stock: products[0].stock,
                        images: products[0].images,
                        ingredients: products[0].ingredients,
                        advantages: products[0].advantages,
                        skinType: products[0].skinType,
                        uses: products[0].uses
                      }} 
                      onSelectProduct={() => handleSelectProduct(products[0])} 
                    />
                  </div>
                )}
              </div>
            ) : (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                  slidesToScroll: 1
                }}
                className="w-full"
              >
                <CarouselContent>
                  {products.length === 0 ? (
                    <CarouselItem className="basis-full pl-4">
                      <div className="p-8 text-center bg-white rounded-lg shadow-md">
                        <p className="text-gray-500">No products available at this time.</p>
                      </div>
                    </CarouselItem>
                  ) : (
                    products.map((product) => (
                      <CarouselItem key={product._id} className="basis-full md:basis-1/2 lg:basis-1/3 pl-4">
                        <ProductCard 
                          product={{
                            id: product._id,
                            name: product.name,
                            subtitle: product.subtitle,
                            description: product.description,
                            price: product.price,
                            discountPrice: product.discountPrice,
                            volume: product.volume,
                            stock: product.stock,
                            images: product.images,
                            ingredients: product.ingredients,
                            advantages: product.advantages,
                            skinType: product.skinType,
                            uses: product.uses
                          }} 
                          onSelectProduct={() => handleSelectProduct(product)} 
                        />
                      </CarouselItem>
                    ))
                  )}
                </CarouselContent>
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center pointer-events-none">
                  <div className="flex gap-4">
                    <CarouselPrevious className="pointer-events-auto bg-white border border-gray-200 shadow-md hover:bg-gray-50 text-gray-700 h-10 w-10 rounded-full" />
                    <CarouselNext className="pointer-events-auto bg-white border border-gray-200 shadow-md hover:bg-gray-50 text-gray-700 h-10 w-10 rounded-full" />
                  </div>
                </div>
              </Carousel>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
