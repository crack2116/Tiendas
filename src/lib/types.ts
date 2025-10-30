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
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
};
