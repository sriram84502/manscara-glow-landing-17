
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { getAllReviews, ReviewResponse } from "@/services/reviewService";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewForm from "./ReviewForm";

const ReviewsSection = ({ className = "" }) => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ReviewResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Helper function to get product name from product field (which could be object or string)
  const getProductName = (product: any): string => {
    if (!product) return "Unknown Product";
    if (typeof product === "string") return product;
    if (product._id && product.name) return product.name;
    return "Unknown Product";
  };
  
  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const reviewsData = await getAllReviews();
      console.log("Fetched reviews:", reviewsData);
      // Ensure reviewsData is an array before setting state
      if (Array.isArray(reviewsData)) {
        setReviews(reviewsData);
        setFilteredReviews(reviewsData);
      } else {
        throw new Error("Invalid reviews data format");
      }
    } catch (err: any) {
      console.error("Failed to fetch reviews:", err);
      setError(err?.response?.data?.message || "Unable to load reviews at this time");
      // Initialize with empty arrays to prevent map errors
      setReviews([]);
      setFilteredReviews([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReviews();
  }, []);
  
  useEffect(() => {
    // Safety check to ensure reviews is an array
    if (!Array.isArray(reviews)) {
      setFilteredReviews([]);
      return;
    }
    
    if (searchTerm.trim() === "") {
      setFilteredReviews(reviews);
      return;
    }
    
    const filtered = reviews.filter(
      (review) => {
        const productName = getProductName(review.product).toLowerCase();
        return review.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          productName.includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      }
    );
    
    setFilteredReviews(filtered);
  }, [searchTerm, reviews]);
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      // If it's within the last 24 hours, show "about X hours ago"
      if (now.getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
        const hours = Math.round((now.getTime() - date.getTime()) / (60 * 60 * 1000));
        return `about ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      }
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className={`section-padding ${className}`}>
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Customer Reviews</h2>
            <div className="max-w-2xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="mb-4">
                  <Skeleton className="h-32 w-full mb-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className={`section-padding ${className}`}>
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Customer Reviews</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Always ensure filteredReviews is an array before mapping
  const reviewsToRender = Array.isArray(filteredReviews) ? filteredReviews : [];

  return (
    <section id="reviews" className={`section-padding ${className}`}>
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Customer Reviews</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what our customers are saying about our products
          </p>
          <div className="mt-6 mb-8">
            <ReviewForm onReviewSubmitted={fetchReviews} />
          </div>
        </div>
        
        <div className="mb-6 max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Search reviews by name, product, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        {reviewsToRender.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No reviews found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewsToRender.map((review) => (
              <Card key={review._id} className="overflow-hidden h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-3">{renderStars(review.rating)}</div>
                  <div className="mb-4 flex-grow">
                    <p className="italic">"{review.comment}"</p>
                  </div>
                  <div className="mt-auto">
                    <div>
                      <p className="font-semibold">
                        {review.user.firstName} {review.user.lastName}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </p>
                        <span className="bg-manscara-offwhite text-muted-foreground px-2 py-1 rounded-full text-xs">
                          {getProductName(review.product)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
