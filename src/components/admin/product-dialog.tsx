'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductForm } from './product-form';
import type { Product } from '@/lib/types';

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ProductDialog({ isOpen, onClose, product }: ProductDialogProps) {
  const dialogTitle = product ? 'Editar Producto' : 'Añadir Nuevo Producto';
  const dialogDescription = product
    ? 'Edita los detalles de tu producto.'
    : 'Añade un nuevo producto a tu inventario.';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <ProductForm product={product} onSaveSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
