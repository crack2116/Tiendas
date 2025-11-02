'use client';

import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './config';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseConfig.supabaseUrl || 'https://placeholder.supabase.co',
  supabaseConfig.supabaseAnonKey || 'placeholder-key'
);

