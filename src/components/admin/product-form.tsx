'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Product } from '@/lib/types';
import { insertProduct, updateProduct } from '@/supabase/db';
import { uploadImageToSupabase } from '@/supabase/storage';
import { useToast } from '@/hooks/use-toast';
import { Trash, Image as ImageIcon } from 'lucide-react';
import { Separator } from '../ui/separator';
import { useState, useEffect, type ReactElement } from 'react';
import Image from 'next/image';

const imageSchema = z.object({
  id: z.string(),
  url: z.string().url('Debe ser una URL válida.').or(z.literal('')),
  alt: z.string().min(1, 'El texto alternativo es requerido.'),
  hint: z.string().optional(),
  file: z.any().optional(), // File object, no validado por zod
});

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres.'),
  category: z.string().min(2, 'La categoría es requerida.'),
  price: z.coerce.number().min(0, 'El precio debe ser un número positivo.'),
  originalPrice: z.coerce.number().optional(),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  badge: z.string().optional(),
  details: z.array(z.object({ value: z.string() })).optional(),
  images: z.array(imageSchema).min(1, 'Se requiere al menos una imagen.'),
});

type ProductFormValues = z.infer<typeof formSchema>;

export function ProductForm({ product, onSaveSuccess }: { product: Product | null, onSaveSuccess: () => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({});

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      category: '',
      price: 0,
      originalPrice: undefined,
      description: '',
      badge: '',
      details: [{ value: '' }],
      images: [],
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || '',
        slug: product.slug || '',
        category: product.category || '',
        price: product.price || 0,
        originalPrice: product.originalPrice ?? undefined,
        description: product.description || '',
        badge: product.badge ?? '',
        details: product.details?.map(d => ({ value: d })) || [{ value: '' }],
        images: product.images || [],
      });
    } else {
      form.reset({
        name: '',
        slug: '',
        category: '',
        price: 0,
        originalPrice: undefined,
        description: '',
        badge: '',
        details: [{ value: '' }],
        images: [{ id: crypto.randomUUID(), url: '', alt: '' }],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);


  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: 'images',
  });

  const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({
    control: form.control,
    name: 'details',
  });

  const handleImageUpload = async (file: File, imageId: string, index: number) => {
    setUploadingImages(prev => ({ ...prev, [imageId]: true }));
    
    try {
      // Subir la imagen a Supabase Storage
      const imageUrl = await uploadImageToSupabase(file, 'images', `products/${imageId}-${Date.now()}`);
      
      if (!imageUrl) {
        throw new Error('No se pudo obtener la URL de la imagen');
      }
      
      // Actualizar el campo en el formulario
      form.setValue(`images.${index}.url`, imageUrl);
      form.setValue(`images.${index}.file`, undefined);
      
      toast({
        title: 'Imagen cargada',
        description: 'La imagen se ha cargado correctamente a Supabase.',
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        variant: 'destructive',
        title: 'Error al cargar imagen',
        description: error.message || 'Ocurrió un error al cargar la imagen a Supabase.',
      });
    } finally {
      setUploadingImages(prev => ({ ...prev, [imageId]: false }));
    }
  };

  const renderImageField = (field: (typeof imageFields)[number], index: number): ReactElement => {
    const previewUrl = field.url || '';
    const hasValidUrl = previewUrl.trim() !== '';
    
    const previewElement = hasValidUrl ? (
      <Image src={previewUrl} alt="Vista previa" width={96} height={96} className="object-cover w-full h-full" />
    ) : (
      <ImageIcon className="text-muted-foreground" />
    );
    
    return (
      <div key={field.id} className="p-4 border rounded-md space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-24 h-24 rounded-md bg-muted flex items-center justify-center overflow-hidden">
            {previewElement}
          </div>
          <div className="flex-1 space-y-2">
            <FormField
              control={form.control}
              name={`images.${index}.alt`}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Texto Alternativo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Camisa blanca de algodón" {...formField} value={formField.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Describe la imagen. Se usa como texto alternativo y para accesibilidad.
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`images.${index}.file`}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Imagen</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            formField.onChange(file);
                            handleImageUpload(file, field.id, index);
                          }
                        }}
                        disabled={uploadingImages[field.id]}
                        className="cursor-pointer"
                      />
                      {uploadingImages[field.id] && (
                        <p className="text-sm text-muted-foreground">Cargando imagen...</p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Selecciona una imagen para subir. Se cargará automáticamente a Supabase Storage.
                  </p>
                </FormItem>
              )}
            />
          </div>
          <Button 
            type="button" 
            variant="destructive" 
            size="icon" 
            onClick={() => removeImage(index)} 
            disabled={imageFields.length <= 1}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    toast({ title: 'Guardando producto...', description: 'Por favor, espera.' });

    try {
        // Verificar si hay imágenes subiéndose
        const hasUploadingImages = Object.values(uploadingImages).some(uploading => uploading);
        if (hasUploadingImages) {
            toast({
                variant: 'destructive',
                title: 'Espera',
                description: 'Por favor espera a que terminen de cargarse las imágenes.',
            });
            setIsSubmitting(false);
            return;
        }

        // Procesar imágenes: eliminar la propiedad file y generar placeholder si no hay URL
        const processedImages = data.images.map(image => {
            const { file, ...imageWithoutFile } = image;
            
            if (!imageWithoutFile.url) {
                return {
                    ...imageWithoutFile,
                    url: `https://placehold.co/600x600?text=${encodeURIComponent(image.alt)}`,
                    hint: image.alt,
                };
            }
            
            return imageWithoutFile;
        });

        const payload = {
            slug: data.slug,
            name: data.name,
            category: data.category,
            price: data.price,
            originalPrice: data.originalPrice,
            description: data.description,
            badge: data.badge || undefined,
            images: processedImages,
            details: data.details?.map(d => d.value).filter(Boolean) || [],
            reviews: product?.reviews ?? [],
        };

        if (product && product.id) {
            await updateProduct(product.id, payload);
            toast({ title: 'Éxito', description: 'Producto actualizado correctamente.' });
        } else {
            await insertProduct(payload);
            toast({ title: 'Éxito', description: 'Producto añadido correctamente.' });
        }
        onSaveSuccess();
    } catch (error: any) {
        console.error("Error submitting product:", error);
        toast({
            variant: 'destructive',
            title: 'Error al guardar',
            description: error.message || 'Ocurrió un error inesperado al guardar los datos.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Camisa de Lino" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="ej: camisa-de-lino" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Tops" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="badge"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Badge (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Nuevo, Oferta" {...field} value={field.value ?? ''}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Precio Original (Opcional)</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.valueAsNumber || undefined)} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe el producto..." {...field} rows={5} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting} className='mt-4'>
            {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
            </Button>
        </div>

        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-4">Imágenes</h3>
                <div className="space-y-4">
                    {imageFields.map((field, index) => renderImageField(field, index))}
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => appendImage({ id: crypto.randomUUID(), url: '', alt: '' })}
                >
                    Añadir Imagen
                </Button>
            </div>

            <Separator />

            <div>
            <h3 className="text-lg font-medium mb-2">Detalles del producto</h3>
            {detailFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mb-2">
                    <FormField
                        control={form.control}
                        name={`details.${index}.value`}
                        render={({ field: formField }) => (
                            <FormItem className='flex-1'>
                                <FormLabel className="sr-only">Detalle</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: 100% Algodón" {...formField} value={formField.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeDetail(index)} disabled={detailFields.length <=1}>
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => appendDetail({ value: '' })}
                >
                    Añadir Detalle
                </Button>
            </div>
        </div>

      </form>
    </Form>
  );
}
