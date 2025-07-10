
import guestUserData from "@/data/guestUser.json";
import { UserData } from "@/types/user";

export const guestService = {
  // Always return the guest user data
  getUserData(): UserData {
    return guestUserData as UserData;
  },

  // Always return true for guest mode
  isAuthenticated(): boolean {
    return true;
  },

  // Get guest user email
  getEmail(): string {
    return guestUserData.email;
  },

  // Get guest user ID
  getUserId(): string {
    return guestUserData.id;
  }
};

export default guestService;
