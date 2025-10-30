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

export type Order = {
  id: string;
  date: string;
  status: 'Entregado' | 'Enviado' | 'Cancelado';
  total: number;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
};

export type User = {
    id: string;
    name?: string;
    email: string;
    address?: string;
};
