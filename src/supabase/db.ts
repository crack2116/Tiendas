'use client';

import { supabase } from './client';
import type { Product, Order, OrderItem, User } from '@/lib/types';

// --- Products ---
export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  original_price: number | null;
  images: { id: string; url: string; alt: string; hint?: string }[];
  description: string;
  details: string[];
  reviews: { id: string; author: string; rating: number; comment: string; date: string }[];
  badge: string | null;
  created_at: string;
  updated_at: string;
};

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    images: row.images || [],
    description: row.description,
    details: row.details || [],
    reviews: row.reviews || [],
    badge: row.badge ?? undefined,
  };
}

export async function fetchProducts(options?: {
  category?: string;
  search?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
}): Promise<Product[]> {
  let q = supabase.from('products').select('*');
  if (options?.category) {
    q = q.eq('category', options.category);
  }
  if (options?.search) {
    q = q.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%,category.ilike.%${options.search}%`);
  }
  if (options?.orderBy) {
    q = q.order(options.orderBy, { ascending: options?.orderDirection !== 'desc' });
  }
  if (options?.limit) {
    q = q.limit(options.limit);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map(rowToProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToProduct(data as ProductRow) : null;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToProduct(data as ProductRow) : null;
}

export type ProductInsert = Omit<Product, 'id'>;
export type ProductUpdate = Partial<Omit<Product, 'id'>>;

export async function insertProduct(p: ProductInsert): Promise<Product> {
  const row = {
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    original_price: p.originalPrice ?? null,
    images: p.images || [],
    description: p.description,
    details: p.details || [],
    reviews: p.reviews || [],
    badge: p.badge ?? null,
  };
  const { data, error } = await supabase.from('products').insert(row).select().single();
  if (error) throw error;
  return rowToProduct(data as ProductRow);
}

export async function updateProduct(id: string, p: ProductUpdate): Promise<Product> {
  const row: Record<string, unknown> = {};
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.name !== undefined) row.name = p.name;
  if (p.category !== undefined) row.category = p.category;
  if (p.price !== undefined) row.price = p.price;
  if (p.originalPrice !== undefined) row.original_price = p.originalPrice;
  if (p.images !== undefined) row.images = p.images;
  if (p.description !== undefined) row.description = p.description;
  if (p.details !== undefined) row.details = p.details;
  if (p.reviews !== undefined) row.reviews = p.reviews;
  if (p.badge !== undefined) row.badge = p.badge;
  row.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('products').update(row).eq('id', id).select().single();
  if (error) throw error;
  return rowToProduct(data as ProductRow);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// --- Orders ---
export type OrderRow = {
  id: string;
  user_id: string;
  created_at: string;
  status: string;
  total: number;
  items: OrderItem[];
  payment_method: string | null;
  yape_number: string | null;
  yape_verification_code: string | null;
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    userId: row.user_id,
    createdAt: row.created_at,
    status: row.status as Order['status'],
    total: Number(row.total),
    items: row.items || [],
    paymentMethod: row.payment_method ?? undefined,
    yapeNumber: row.yape_number ?? undefined,
    yapeVerificationCode: row.yape_verification_code ?? undefined,
  };
}

export async function fetchOrders(options?: {
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
}): Promise<Order[]> {
  let q = supabase.from('orders').select('*');
  if (options?.orderBy) {
    q = q.order(options.orderBy, { ascending: options?.orderDirection !== 'desc' });
  } else {
    q = q.order('created_at', { ascending: false });
  }
  if (options?.limit) {
    q = q.limit(options.limit);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map((r) => rowToOrder(r as OrderRow));
}

export async function fetchOrdersByUserId(userId: string, options?: { limit?: number }): Promise<Order[]> {
  let q = supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (options?.limit) q = q.limit(options.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map((r) => rowToOrder(r as OrderRow));
}

export type OrderInsert = Omit<Order, 'id'>;

export async function insertOrder(o: OrderInsert): Promise<Order> {
  const row = {
    user_id: o.userId,
    status: o.status,
    total: o.total,
    items: o.items,
    payment_method: o.paymentMethod ?? null,
    yape_number: o.yapeNumber ?? null,
    yape_verification_code: o.yapeVerificationCode ?? null,
  };
  const { data, error } = await supabase.from('orders').insert(row).select().single();
  if (error) throw error;
  return rowToOrder(data as OrderRow);
}

// --- Profiles ---
export type ProfileRow = {
  id: string;
  email: string | null;
  name: string | null;
  address: string | null;
  role: string | null;
};

export async function fetchProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const r = data as ProfileRow;
  return {
    uid: r.id,
    email: r.email || '',
    name: r.name ?? undefined,
    address: r.address ?? undefined,
    role: (r.role as User['role']) ?? undefined,
  };
}

export async function upsertProfile(userId: string, profile: Partial<Pick<User, 'email' | 'name' | 'address' | 'role'>>): Promise<void> {
  const row: Record<string, unknown> = {
    id: userId,
    updated_at: new Date().toISOString(),
  };
  if (profile.email !== undefined) row.email = profile.email;
  if (profile.name !== undefined) row.name = profile.name;
  if (profile.address !== undefined) row.address = profile.address;
  if (profile.role !== undefined) row.role = profile.role;
  const { error } = await supabase.from('profiles').upsert(row, { onConflict: 'id' });
  if (error) throw error;
}
