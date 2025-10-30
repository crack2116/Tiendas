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
import { useFirestore } from '@/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Trash } from 'lucide-react';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres.'),
  category: z.string().min(2, 'La categoría es requerida.'),
  price: z.coerce.number().min(0, 'El precio debe ser un número positivo.'),
  originalPrice: z.coerce.number().optional(),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  badge: z.string().optional(),
  details: z.array(z.object({ value: z.string() })).optional(),
  images: z.array(z.object({
    id: z.string(),
    url: z.string().url('Debe ser una URL válida.'),
    alt: z.string(),
    hint: z.string().optional(),
  })).min(1, 'Se requiere al menos una imagen.'),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  product: Product | null;
  onSaveSuccess: () => void;
}

export function ProductForm({ product, onSaveSuccess }: ProductFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const defaultValues = {
    name: product?.name || '',
    slug: product?.slug || '',
    category: product?.category || '',
    price: product?.price || 0,
    originalPrice: product?.originalPrice,
    description: product?.description || '',
    badge: product?.badge || '',
    details: product?.details?.map(d => ({ value: d })) || [{ value: '' }],
    images: product?.images || [{ id: '', url: '', alt: '', hint: '' }],
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: 'images',
  });

  const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({
    control: form.control,
    name: 'details',
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore no está disponible.' });
      return;
    }
    
    const productData = {
        ...data,
        details: data.details?.map(d => d.value).filter(Boolean) || [],
    };

    try {
      if (product && product.id) {
        // Update existing product
        const productRef = doc(firestore, 'products', product.id);
        await updateDoc(productRef, productData);
        toast({ title: 'Éxito', description: 'Producto actualizado correctamente.' });
      } else {
        // Add new product
        await addDoc(collection(firestore, 'products'), productData);
        toast({ title: 'Éxito', description: 'Producto añadido correctamente.' });
      }
      onSaveSuccess();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al guardar',
        description: error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Camisa de Lino" {...field} />
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
                    <Input placeholder="ej: camisa-de-lino" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Categoría</FormLabel>
                <FormControl>
                    <Input placeholder="Ej: Tops" {...field} />
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
                    <Input placeholder="Ej: Nuevo, Oferta" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                    <Input type="number" step="0.01" {...field} />
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
                    <Input type="number" step="0.01" {...field} />
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
                <Textarea placeholder="Describe el producto..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-2">Imágenes</h3>
           {imageFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end mb-2">
                <FormField
                    control={form.control}
                    name={`images.${index}.url`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={index !== 0 ? 'sr-only' : ''}>URL de Imagen</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`images.${index}.alt`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={index !== 0 ? 'sr-only' : ''}>Texto Alternativo</FormLabel>
                            <FormControl>
                                <Input placeholder="Descripción de la imagen" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <Button type="button" variant="destructive" size="icon" onClick={() => removeImage(index)} disabled={imageFields.length <= 1}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
           ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
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
                    render={({ field }) => (
                         <FormItem className='flex-1'>
                            <FormLabel className="sr-only">Detalle</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: 100% Algodón" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <Button type="button" variant="destructive" size="icon" onClick={() => removeDetail(index)}>
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


        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Guardando...' : 'Guardar Producto'}
        </Button>
      </form>
    </Form>
  );
}
