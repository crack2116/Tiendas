import type { Order } from '@/lib/types';

// Hardcoded products are removed and will be fetched from Firestore.
// The initial data is now seeded into Firestore via `scripts/seed.ts`.
// You can run `npx tsx scripts/seed.ts` to re-seed the database if needed.
export const products: any[] = [];


export const orders: Order[] = [
  {
    id: 'MV-1025',
    date: '2023-06-15',
    status: 'Entregado',
    total: 119.98,
    items: [
      { productName: 'Classic White Tee', quantity: 1, price: 29.99 },
      { productName: 'Slim Dark Denim', quantity: 1, price: 89.99 },
    ],
  },
  {
    id: 'MV-1024',
    date: '2023-05-02',
    status: 'Enviado',
    total: 249.99,
    items: [
      { productName: 'Leather Biker Jacket', quantity: 1, price: 249.99 },
    ],
  },
  {
    id: 'MV-1023',
    date: '2023-04-20',
    status: 'Entregado',
    total: 99.98,
    items: [
      { productName: 'Classic White Tee', quantity: 2, price: 29.99 },
      { productName: 'Linen Shirt', quantity: 1, price: 69.99 },
    ],
  },
];
