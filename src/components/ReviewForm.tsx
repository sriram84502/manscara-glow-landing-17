import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { submitReview, ReviewSubmission } from "@/services/reviewService";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/productService";

const ReviewForm = ({ onReviewSubmitted }: { onReviewSubmitted: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<ReviewSubmission, "rating" | "productId">>({
    firstName: "",
    lastName: "",
    comment: "",
  });
  const [selectedProductId, setSelectedProductId] = useState("");
  const { toast } = useToast();
  
  // Fetch products for product selection dropdown
  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => getAllProducts(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Rating is required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedProductId) {
      toast({
        title: "Product is required",
        description: "Please select a product before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const reviewData: ReviewSubmission = {
        ...formData,
        rating,
        productId: selectedProductId, // Changed from product to productId to match the backend expectation
      };
      
      console.log("Submitting review:", reviewData);
      await submitReview(reviewData);
      
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        comment: "",
      });
      setRating(0);
      setSelectedProductId("");
      setOpen(false);
      
      // Refresh reviews list
      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Failed to submit review",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mx-auto block">Write a Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                First Name
              </label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="product" className="block text-sm font-medium mb-1">
              Product
            </label>
            <Select 
              value={selectedProductId} 
              onValueChange={setSelectedProductId}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {productsData?.data?.products?.map(product => (
                  <SelectItem key={product._id} value={product._id}>
                    {product.name} - {product.subtitle}
                  </SelectItem>
                ))}
                {/* Fallback to our sample products if API fails */}
                {(!productsData || !productsData.data?.products?.length) && [
                  { _id: "6812fbf82b9c92f498740804", name: "Face Wash", subtitle: "For Oily & Acne-Prone Skin" },
                  { _id: "6812fc192b9c92f498740807", name: "Face Wash", subtitle: "For Sensitive Skin" },
                  { _id: "6812fc2a2b9c92f498740808", name: "Face Wash", subtitle: "Hydrating Formula" }
                ].map(product => (
                  <SelectItem key={product._id} value={product._id}>
                    {product.name} - {product.subtitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  className={`h-8 w-8 cursor-pointer ${
                    value <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                  } mr-1`}
                  onClick={() => setRating(value)}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-1">
              Your Review
            </label>
            <Textarea
              id="comment"
              name="comment"
              rows={4}
              value={formData.comment}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
