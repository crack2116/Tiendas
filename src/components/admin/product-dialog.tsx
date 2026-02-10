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
import { ScrollArea } from '../ui/scroll-area';

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSaveSuccess?: () => void;
}

export function ProductDialog({ isOpen, onClose, product, onSaveSuccess }: ProductDialogProps) {
  const dialogTitle = product ? 'Editar Producto' : 'Añadir Nuevo Producto';
  const dialogDescription = product
    ? 'Edita los detalles de tu producto.'
    : 'Añade un nuevo producto a tu inventario.';

  const handleSaveSuccess = () => {
    onSaveSuccess?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <ScrollArea className='flex-1'>
            <div className='pr-6'>
                <ProductForm product={product} onSaveSuccess={handleSaveSuccess} />
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
