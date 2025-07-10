
export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isPrimary: boolean;
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture: string;
  addresses: Address[];
}

export interface CartProduct {
  id?: string;
  _id?: string; // Added for compatibility with API
  name: string;
  subtitle: string;
  price: number;
  quantity: number;
  image: string;
  productId?: string; // Added for API compatibility
}

export interface UserCart {
  userId: string;
  products: CartProduct[];
}
