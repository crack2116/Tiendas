'use client';

// Supabase configuration
export const supabaseConfig = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
};

if (typeof window !== 'undefined' && (!supabaseConfig.supabaseUrl || !supabaseConfig.supabaseAnonKey)) {
  console.warn(
    '⚠️ Supabase no está configurado. Por favor, agrega las variables de entorno:\n' +
    'NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

