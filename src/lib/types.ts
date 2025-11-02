import { Timestamp } from 'firebase/firestore';

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: { id: string; url: string; alt: string; hint: string; }[];
  description: string;
  details: string[];
  reviews: Review[];
  badge?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string;
};

export type Order = {
  id: string;
  userId: string;
  createdAt: Timestamp;
  status: 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado';
  total: number;
  items: OrderItem[];
  paymentMethod?: string;
  yapeNumber?: string;
  yapeVerificationCode?: string;
};

export type User = {
    uid: string;
    email: string;
    name?: string;
    address?: string;
    role?: 'admin' | 'customer';
};
