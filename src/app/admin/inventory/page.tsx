'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useProducts } from '@/hooks/use-products';
import type { Product } from '@/lib/types';
import { deleteProduct } from '@/supabase/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, PlusCircle, Trash } from 'lucide-react';
import { ProductDialog } from '@/components/admin/product-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';

export default function InventoryPage() {
  const { data: products, loading, error, refetch } = useProducts();
  const { toast } = useToast();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      toast({
        title: 'Producto Eliminado',
        description: `El producto "${productToDelete.name}" ha sido eliminado.`,
      });
      refetch();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al eliminar',
        description: error.message,
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="flex flex-col h-full w-full p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold font-headline">Inventario de Productos</h1>
            <Button onClick={handleAddProduct}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Producto
            </Button>
        </div>
      
      {error && <p className="text-destructive">Error: {error.message}</p>}

      {/* Vista de tabla para pantallas grandes (md y superior) */}
      <Card className="hidden md:flex flex-col flex-1">
        <CardHeader className="pt-4 px-4 sm:px-6 md:px-7">
          <CardTitle>Productos</CardTitle>
          <CardDescription>
            Gestiona los productos de tu tienda.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px] pl-8">Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Detalles</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right pr-8">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-8"><Skeleton className="h-24 w-24 rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-16 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-12 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex gap-2 justify-end">
                      <Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="pl-8 align-top py-4">
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="100"
                      src={product.images[0]?.url || '/placeholder.svg'}
                      width="100"
                    />
                  </TableCell>
                  <TableCell className="font-medium align-top py-4">{product.name}</TableCell>
                   <TableCell className="text-sm text-muted-foreground align-top max-w-xs py-4">
                    <div className="whitespace-pre-wrap">{product.description}</div>
                  </TableCell>
                   <TableCell className="text-sm text-muted-foreground align-top py-4">
                    <ul className='list-disc list-inside space-y-1'>
                      {product.details?.map((detail, i) => <li key={i}>{detail}</li>)}
                    </ul>
                  </TableCell>
                  <TableCell className="align-top py-4">
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right align-top py-4">S/{product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right pr-8 align-top py-4">
                    <div className="flex gap-2 justify-end">
                       <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteDialog(product)} className="text-destructive hover:text-destructive">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Vista de tarjetas para pantallas pequeñas (menos de md) */}
      <div className="grid gap-4 md:hidden">
        {loading && Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Skeleton className="h-24 w-24 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 p-4 pt-0">
               <Skeleton className="h-9 w-20" />
               <Skeleton className="h-9 w-20" />
            </CardFooter>
          </Card>
        ))}
        {products?.map((product) => (
           <Card key={product.id}>
             <CardContent className="p-4 flex gap-4">
               <Image
                 alt={product.name}
                 className="aspect-square rounded-md object-cover"
                 height="100"
                 src={product.images[0]?.url || '/placeholder.svg'}
                 width="100"
               />
               <div className="flex-1">
                 <h3 className="font-semibold">{product.name}</h3>
                 <p className="text-sm text-muted-foreground">{product.category}</p>
                 <p className="font-semibold mt-2">S/{product.price.toFixed(2)}</p>
               </div>
             </CardContent>
             <CardFooter className="flex justify-end gap-2 p-4 pt-0">
               <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                 <Pencil className="mr-2 h-4 w-4" />
                 Editar
               </Button>
               <Button variant="outline" size="sm" onClick={() => handleOpenDeleteDialog(product)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                 <Trash className="mr-2 h-4 w-4" />
                 Eliminar
               </Button>
             </CardFooter>
           </Card>
        ))}
      </div>

      <ProductDialog 
        isOpen={isDialogOpen} 
        onClose={handleDialogClose}
        product={selectedProduct}
      />
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el producto de tu base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>
              Sí, eliminar producto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}