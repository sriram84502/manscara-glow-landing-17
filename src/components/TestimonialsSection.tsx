
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getAllReviews, ReviewResponse } from "@/services/reviewService";
import { Skeleton } from "@/components/ui/skeleton";

const TestimonialsSection = ({ className = "" }) => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await getAllReviews();
        if (Array.isArray(reviewsData)) {
          // Filter reviews with rating 4 or above for testimonials
          const highRatedReviews = reviewsData.filter(review => review.rating >= 4);
          setReviews(highRatedReviews);
        }
      } catch (error) {
        console.error("Failed to fetch reviews for testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Helper function to get product name from product field (which could be object or string)
  const getProductName = (product: any): string => {
    if (!product) return "Unknown Product";
    if (typeof product === "string") return product;
    if (product._id && product.name) return product.name;
    return "Unknown Product";
  };

  if (isLoading) {
    return (
      <section className={`section-padding ${className}`}>
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Customer Testimonials
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what men who use Manscara have to say.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full md:w-1/2 lg:w-1/3 p-2">
                <Skeleton className="h-48 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no reviews yet, return nothing instead of showing empty section
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className={`section-padding ${className}`}>
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Customer Testimonials
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what men who use our products have to say.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem key={review._id} className="md:basis-1/2 lg:basis-1/3 p-2">
                <div className="bg-manscara-offwhite border border-manscara-beige rounded-lg p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    {Array(5).fill(0).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="flex-grow mb-4">
                    <p className="italic text-muted-foreground">"{review.comment}"</p>
                  </blockquote>
                  <div>
                    <p className="font-semibold">{review.user.firstName} {review.user.lastName}</p>
                    <p className="text-sm text-muted-foreground">{getProductName(review.product)}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-6 gap-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
