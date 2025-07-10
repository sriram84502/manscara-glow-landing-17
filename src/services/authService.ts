
import api from "./api";

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePicture?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    token: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    addresses: Array<{
      name: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      phone: string;
      isPrimary: boolean;
      _id: string;
    }>;
    profilePicture: string;
    isAdmin: boolean;
    updatedAt: string;
  };
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profilePicture: string;
  };
}

export const authService = {
  async register(userData: RegisterData) {
    try {
      const response = await api.post<AuthResponse>("/auth/register", userData);
      if (response.data.success) {
        // Store authentication data
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("userData", JSON.stringify(response.data.data.user));
        return response.data;
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  async login(credentials: LoginData) {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      if (response.data.success) {
        // Store authentication data
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("userData", JSON.stringify(response.data.data.user));
        return response.data;
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  async logout() {
    try {
      // Call the logout endpoint
      const response = await api.post("/auth/logout");
      
      // Clear local storage regardless of API response
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      
      return response.data;
    } catch (error: any) {
      // Still clear local storage even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      throw error.response?.data || { message: "Logout failed" };
    }
  },

  async getProfile() {
    try {
      const response = await api.get<ProfileResponse>("/users/profile");
      if (response.data.success) {
        // Update local storage with the latest user data
        const userData = {
          id: response.data.data._id,
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          email: response.data.data.email,
          phone: response.data.data.phone,
          profilePicture: response.data.data.profilePicture,
          addresses: response.data.data.addresses.map(addr => ({
            id: addr._id,
            name: addr.name,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            zipCode: addr.zipCode,
            country: addr.country,
            phone: addr.phone,
            isPrimary: addr.isPrimary
          }))
        };
        
        localStorage.setItem("userData", JSON.stringify(userData));
        return userData;
      }
      throw new Error("Failed to fetch profile");
    } catch (error: any) {
      throw error.response?.data || { message: "Failed to fetch profile" };
    }
  },

  async updateProfile(data: UpdateProfileData) {
    try {
      const response = await api.put<ProfileUpdateResponse>("/users/profile", data);
      
      if (response.data.success) {
        // Get current user data
        const userDataString = localStorage.getItem("userData");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          
          // Update with new values
          const updatedUserData = {
            ...userData,
            firstName: response.data.data.firstName,
            lastName: response.data.data.lastName,
            phone: response.data.data.phone,
            profilePicture: response.data.data.profilePicture
          };
          
          // Save updated user data
          localStorage.setItem("userData", JSON.stringify(updatedUserData));
        }
        
        return response.data;
      }
      
      throw new Error(response.data.message || "Failed to update profile");
    } catch (error: any) {
      throw error.response?.data || { message: "Failed to update profile" };
    }
  },

  isAuthenticated() {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    return !!token && !!userData;
  },

  getUserData() {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      try {
        return JSON.parse(userDataString);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};

export default authService;
