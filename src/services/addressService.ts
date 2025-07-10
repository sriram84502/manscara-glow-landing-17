
import api from "./api";
import { Address } from "@/types/user";

interface AddressResponse {
  success: boolean;
  message?: string;
  data?: Address | Address[];
}

const addressService = {
  /**
   * Get all addresses for the current user
   */
  async getAddresses(): Promise<Address[]> {
    try {
      const response = await api.get<{ success: boolean; data: any[] }>("/users/addresses");
      
      if (response.data.success) {
        // Transform the API response to match our Address type
        return response.data.data.map(addr => ({
          id: addr._id,
          name: addr.name,
          street: addr.street,
          city: addr.city,
          state: addr.state,
          zipCode: addr.zipCode,
          country: addr.country,
          phone: addr.phone,
          isPrimary: addr.isPrimary
        }));
      }
      
      return [];
    } catch (error: any) {
      console.error("Failed to get addresses:", error);
      throw error.response?.data || { message: "Failed to get addresses" };
    }
  },
  
  /**
   * Add a new address for the user
   */
  async addAddress(address: Omit<Address, "id">): Promise<Address> {
    try {
      const response = await api.post<AddressResponse>("/users/addresses", address);
      
      if (response.data.success && response.data.data) {
        const data = response.data.data as any;
        // Convert API response to our Address format
        return {
          id: data._id || data.id,
          name: data.name,
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          phone: data.phone,
          isPrimary: data.isPrimary
        };
      }
      
      throw new Error(response.data.message || "Failed to add address");
    } catch (error: any) {
      console.error("Failed to add address:", error);
      throw error.response?.data || { message: "Failed to add address" };
    }
  },
  
  /**
   * Update an existing address
   */
  async updateAddress(addressId: string, addressData: Partial<Address>): Promise<Address> {
    try {
      const response = await api.put<AddressResponse>(`/users/addresses/${addressId}`, addressData);
      
      if (response.data.success && response.data.data) {
        const data = response.data.data as any;
        // Convert API response to our Address format
        return {
          id: data._id || data.id,
          name: data.name,
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          phone: data.phone,
          isPrimary: data.isPrimary
        };
      }
      
      throw new Error(response.data.message || "Failed to update address");
    } catch (error: any) {
      console.error("Failed to update address:", error);
      throw error.response?.data || { message: "Failed to update address" };
    }
  },
  
  /**
   * Delete an address
   */
  async deleteAddress(addressId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(`/users/addresses/${addressId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to delete address:", error);
      throw error.response?.data || { message: "Failed to delete address" };
    }
  },
  
  /**
   * Set an address as primary
   */
  async setPrimaryAddress(addressId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.put<{ success: boolean; message: string }>(
        `/users/addresses/${addressId}/set-primary`
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to set primary address:", error);
      throw error.response?.data || { message: "Failed to set address as primary" };
    }
  }
};

export default addressService;
