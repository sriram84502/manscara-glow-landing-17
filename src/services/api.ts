
import axios from "axios";

const BASE_URL = "https://manscaraapi.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle unauthorized errors (401)
      if (status === 401) {
        // Clear auth data
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      }
      
      // Return the error message from the API if available
      const errorMessage = data?.message || "An error occurred";
      return Promise.reject({ status, message: errorMessage, data: data });
    }
    
    return Promise.reject(error);
  }
);

export default api;
