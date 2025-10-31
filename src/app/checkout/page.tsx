'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/types';


export default function CheckoutPage() {
  const { cart, totalPrice, clearCart, itemCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user === null) {
      router.push('/login?redirect=/checkout');
    }
     if (itemCount === 0 && user) {
        router.push('/');
    }
  }, [user, router, itemCount]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user || isSubmitting) return;

    setSubmitting(true);

    const orderData: Omit<Order, 'id'> = {
      userId: user.uid,
      createdAt: serverTimestamp() as any, // Firestore will set the date
      status: 'Procesando',
      total: totalPrice,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        imageUrl: item.product.images[0].url,
      })),
    };
    
    try {
        const batch = writeBatch(firestore);

        // Add to general orders collection (for admin)
        const newOrderRef = doc(collection(firestore, 'orders'));
        batch.set(newOrderRef, orderData);

        // Add to user-specific orders subcollection
        const userOrderRef = doc(collection(firestore, `users/${user.uid}/orders`, newOrderRef.id));
        batch.set(userOrderRef, orderData);
        
        await batch.commit();

        toast({
            title: "¡Pedido realizado con éxito!",
            description: "Gracias por tu compra. Puedes ver los detalles en tu cuenta.",
        });
        
        clearCart();
        router.push('/account/orders');

    } catch (error) {
        console.error("Error creating order: ", error);
        toast({
            variant: "destructive",
            title: "Error al realizar el pedido",
            description: "Hubo un problema al procesar tu pedido. Por favor, inténtalo de nuevo.",
        });
        setSubmitting(false);
    }
  };

  if (!user || itemCount === 0) {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12 text-center">
            <p>Cargando...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8 text-center">Checkout</h1>
      <form onSubmit={handlePlaceOrder}>
        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Información de Envío</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" required defaultValue={user.name?.split(' ')[0]} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos</Label>
                      <Input id="lastName" required defaultValue={user.name?.split(' ').slice(1).join(' ')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" required defaultValue={user.address} />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input id="city" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Provincia</Label>
                      <Input id="state" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">Código Postal</Label>
                      <Input id="zip" required />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Detalles de Pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                    <Input id="cardNumber" placeholder="**** **** **** ****" required />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="expiry">Fecha de Caducidad</Label>
                      <Input id="expiry" placeholder="MM / AA" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="***" required />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-headline">Tu Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          width={48}
                          height={60}
                          className="rounded-md object-cover"
                        />
                        <div>
                          <p className="font-semibold">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">Cant: {item.quantity}</p>
                        </div>
                      </div>
                      <p>S/{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>S/{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button size="lg" className="w-full mt-6" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Procesando...' : 'Realizar Pedido'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
