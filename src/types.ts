export interface Product {
  id: string;
  title: string;
  description: string;
  basePrice?: number;
  category: string;
  images: string[];
  owner?: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  email?: string;
}
