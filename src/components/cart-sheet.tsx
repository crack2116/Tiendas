'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Input } from './ui/input';

type CartSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { cart, removeFromCart, updateQuantity, totalPrice, itemCount } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative text-foreground/80 font-normal">
            <ShoppingCart className="h-5 w-5 mr-1" />
            Mi Carrito
            {itemCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {itemCount}
            </span>
            )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-headline text-xl">
            Carrito de Compras ({itemCount})
          </SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <ScrollArea className="flex-1 -mx-6">
              <div className="px-6">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-start gap-4 py-4">
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      width={80}
                      height={100}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <Link href={`/products/${item.product.slug}`} className="font-semibold hover:underline" onClick={() => onOpenChange(false)}>
                        {item.product.name}
                      </Link>
                      <p className="text-muted-foreground text-sm">
                        S/{item.product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 0)}
                          className="h-6 w-12 text-center p-0"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto">
              <div className="w-full space-y-4">
                <Separator />
                <div className="flex justify-between items-center font-semibold">
                  <span>Subtotal</span>
                  <span>S/{totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  El envío y los impuestos se calcularán en el checkout.
                </p>
                <div className="flex flex-col gap-2">
                   <Button asChild size="lg" className="w-full">
                    <Link href="/checkout" onClick={() => onOpenChange(false)}>Proceder al Pago</Link>
                  </Button>
                  <SheetClose asChild>
                    <Button variant="outline" size="lg" className="w-full">
                      Seguir Comprando
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h3 className="text-lg font-semibold">Tu carrito está vacío</h3>
            <p className="text-muted-foreground mt-2">
              Parece que aún no has añadido nada.
            </p>
            <SheetClose asChild>
              <Button className="mt-6">Empezar a Comprar</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
