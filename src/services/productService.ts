
import api from './api';

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface Product {
  _id: string;
  id?: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  discountPrice?: number;
  volume: string;
  stock: number;
  images: string[];
  ingredients: string[];
  advantages: string[];
  skinType: string[];
  uses: string[];
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest';
  skinType?: string;
  query?: string;
}

export const getAllProducts = async (params?: ProductsQueryParams): Promise<ProductsResponse> => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<ProductResponse> => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};
