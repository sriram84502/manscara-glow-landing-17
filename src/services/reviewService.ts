
import api from "./api";

export interface ReviewResponse {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
  };
  product: {
    _id: string;
    name: string;
  } | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewSubmission {
  firstName: string;
  lastName: string;
  productId: string; // Changed from 'product' to 'productId' to match backend expectation
  rating: number;
  comment: string;
}

export const getAllReviews = async (): Promise<ReviewResponse[]> => {
  try {
    const response = await api.get("/reviews");
    console.log("Reviews API response:", response.data);
    
    // Check if response has the expected structure
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("Reviews data is not in expected format:", response.data);
      return []; // Return empty array if data is not in expected format
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error; // Throw the error to be handled by the component
  }
};

export const submitReview = async (review: ReviewSubmission): Promise<ReviewResponse | null> => {
  try {
    console.log("Submitting review to API:", review);
    const response = await api.post("/reviews", review);
    return response.data;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error; // Re-throw error to be caught by the form component
  }
};
