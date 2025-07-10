
import axios from "axios";

const BASE_URL = "https://manscaraapi.onrender.com/api";

// Hardcoded guest user token
const GUEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmI3N2VlYWE5NWFkZWI5ZmZkOWFlZSIsImlhdCI6MTc1MTg3MzUxOX0.gp6-KEU_sWJ6qYHo3FG9woRZ90tCyvZeEYcg8Tocq_c";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request interceptor to add the guest token to all requests
api.interceptors.request.use(
  (config) => {
    // Always use the guest token for all requests
    config.headers["Authorization"] = `Bearer ${GUEST_TOKEN}`;
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
      
      // Return the error message from the API if available
      const errorMessage = data?.message || "An error occurred";
      return Promise.reject({ status, message: errorMessage, data: data });
    }
    
    return Promise.reject(error);
  }
);

export default api;
