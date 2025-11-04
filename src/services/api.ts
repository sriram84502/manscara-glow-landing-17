
import axios from "axios";

const BASE_URL = "https://manscaraapi.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;
      
      // Return the error message from the API if available
      const errorMessage = data?.message || "An error occurred";
      return Promise.reject({ status, message: errorMessage, data: data });
    }
    
    return Promise.reject(error);
  }
);

export default api;
