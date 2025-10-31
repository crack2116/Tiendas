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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Product } from '@/lib/types';
import { useFirestore, useStorage } from '@/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Trash, Upload, Image as ImageIcon } from 'lucide-react';
import { Separator } from '../ui/separator';
import { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';


const imageSchema = z.object({
  id: z.string(),
  url: z.string().url('Debe ser una URL válida.').or(z.literal('')),
  alt: z.string(),
  hint: z.string().optional(),
  file: z.instanceof(File).optional(),
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
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || '',
        slug: product.slug || '',
        category: product.category || '',
        price: product.price || 0,
        originalPrice: product.originalPrice,
        description: product.description || '',
        badge: product.badge || '',
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
        images: [{ id: crypto.randomUUID(), url: '', alt: '', file: undefined }],
      });
    }
  }, [product, form.reset]);


  const { fields: imageFields, append: appendImage, remove: removeImage, update: updateImage } = useFieldArray({
    control: form.control,
    name: 'images',
  });

  const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({
    control: form.control,
    name: 'details',
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const currentImage = imageFields[index];
      const newImage = {
        ...currentImage,
        url: URL.createObjectURL(file), // Use object URL for preview
        file: file,
      };
      updateImage(index, newImage);
    }
  };


  const uploadImage = (file: File, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!storage) {
        reject(new Error("Firebase Storage is not initialized."));
        return;
      }
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(prev => ({ ...prev, [path]: progress }));
        },
        (error) => {
          console.error("Upload error:", error);
          setUploadProgress(prev => ({ ...prev, [path]: -1 })); // Indicate error
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (!firestore || isSubmitting) return;

    setIsSubmitting(true);
    toast({ title: 'Guardando producto...', description: 'Por favor, espera.' });

    try {
      const imageUploadPromises: Promise<{ url: string; alt: string; id: string, hint?: string }>[] = data.images.map(async (image, index) => {
        if (image.file) {
          const filePath = `products/${Date.now()}_${image.file.name}`;
          const downloadURL = await uploadImage(image.file, filePath);
          return { ...image, url: downloadURL };
        }
        // If there's no file, it's an existing image, so we just return its data.
        return Promise.resolve(image);
      });

      const uploadedImages = await Promise.all(imageUploadPromises);
        
      const productDataForFirestore = {
        ...data,
        images: uploadedImages.map(({ file, ...rest }) => rest), // Important: remove the 'file' property before saving to Firestore
        details: data.details?.map(d => d.value).filter(Boolean) || [],
      };

      if (product && product.id) {
        const productRef = doc(firestore, 'products', product.id);
        await updateDoc(productRef, productDataForFirestore);
        toast({ title: 'Éxito', description: 'Producto actualizado correctamente.' });
      } else {
        await addDoc(collection(firestore, 'products'), productDataForFirestore);
        toast({ title: 'Éxito', description: 'Producto añadido correctamente.' });
      }
      onSaveSuccess();
    } catch (error: any) {
      console.error("Error submitting product:", error);
      toast({
        variant: 'destructive',
        title: 'Error al guardar',
        description: error.message || 'Ocurrió un error inesperado al subir las imágenes o guardar los datos.',
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress({});
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
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
                    <Textarea placeholder="Describe el producto..." {...field} rows={5} />
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
                {imageFields.map((field, index) => {
                    const currentFieldValue = form.watch(`images.${index}`);
                    const progressKey = currentFieldValue.file ? `products/${currentFieldValue.file.name}` : field.id;
                    const progress = uploadProgress[progressKey];
                    const previewUrl = currentFieldValue?.url;
                    
                    return (
                    <div key={field.id} className="p-4 border rounded-md space-y-4">
                        <div className="flex gap-4 items-start">
                        <div className="w-24 h-24 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                            {previewUrl ? (
                                <Image src={previewUrl} alt="Vista previa" width={96} height={96} className="object-cover w-full h-full" />
                            ) : (
                                <ImageIcon className="text-muted-foreground" />
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="grid gap-2">
                            <Label htmlFor={`images.${index}.file`}>Subir imagen</Label>
                                <Input
                                    id={`images.${index}.file`}
                                    type="file"
                                    accept="image/png, image/jpeg, image/gif"
                                    className="text-sm"
                                    onChange={(e) => handleFileChange(e, index)}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name={`images.${index}.alt`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Texto Alternativo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Descripción de la imagen" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeImage(index)} disabled={imageFields.length <= 1}>
                            <Trash className="h-4 w-4" />
                        </Button>
                        </div>
                        {progress != null && progress >= 0 && progress < 100 && (
                            <Progress value={progress} className="w-full" />
                        )}
                        {progress === -1 && <p className='text-destructive text-sm'>Error al subir</p>}
                    </div>
                )})}
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => appendImage({ id: crypto.randomUUID(), url: '', alt: '', file: undefined })}
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
