'use client';

import { supabase } from './client';
import { supabaseConfig } from './config';

/**
 * Sube una imagen a Supabase Storage
 * @param file - El archivo de imagen a subir
 * @param bucket - El nombre del bucket (por defecto 'images')
 * @param path - La ruta donde se guardará la imagen (opcional)
 * @returns La URL pública de la imagen o null si hay error
 */
export async function uploadImageToSupabase(
  file: File,
  bucket: string = 'images',
  path?: string
): Promise<string | null> {
  // Validar que Supabase esté configurado
  if (!supabaseConfig.supabaseUrl || !supabaseConfig.supabaseAnonKey) {
    console.error('Supabase no está configurado');
    throw new Error('Supabase no está configurado. Por favor, agrega las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  try {
    // Generar un nombre único para el archivo
    const fileExtension = file.name.split('.').pop();
    const fileName = path || `products/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    
    // Subir el archivo
    // Si el bucket es público y RLS está desactivado, esto funcionará con anon key
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'image/jpeg'
      });

    if (error) {
      console.error('Error uploading to Supabase:', error);
      
      // Mensaje más específico para errores de RLS
      if (error.message?.includes('row-level security') || error.message?.includes('RLS')) {
        throw new Error(
          'Error de seguridad: El bucket tiene RLS activado. ' +
          'Por favor, crea políticas en Supabase Dashboard → Storage → images → Policies ' +
          'o desactiva RLS en el bucket si debe ser público.'
        );
      }
      
      throw error;
    }

    // Obtener la URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading image to Supabase:', error);
    throw error;
  }
}

/**
 * Elimina una imagen de Supabase Storage
 * @param path - La ruta de la imagen a eliminar
 * @param bucket - El nombre del bucket (por defecto 'images')
 * @returns true si se eliminó correctamente
 */
export async function deleteImageFromSupabase(path: string, bucket: string = 'images'): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Error deleting image from Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image from Supabase:', error);
    return false;
  }
}

/**
 * Obtiene la URL pública de una imagen en Supabase Storage
 * @param path - La ruta de la imagen
 * @param bucket - El nombre del bucket (por defecto 'images')
 * @returns La URL pública de la imagen
 */
export function getSupabaseImageUrl(path: string, bucket: string = 'images'): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

