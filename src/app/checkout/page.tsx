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
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/types';
import { insertOrder } from '@/supabase/db';
import jsPDF from 'jspdf';
import { uploadPdfToSupabase } from '@/supabase/storage';


export default function CheckoutPage() {
  const { cart, totalPrice, clearCart, itemCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setSubmitting] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (user === null) {
      router.push('/login?redirect=/checkout');
    }
     if (itemCount === 0 && user) {
        router.push('/');
    }
  }, [user, router, itemCount]);

  const handleWhatsAppVerification = async () => {
    if (cart.length === 0) {
      toast({
        variant: "destructive",
        title: "Carrito vacío",
        description: "Agrega productos al carrito antes de generar el detalle.",
      });
      return;
    }

    setIsGeneratingPdf(true);
    try {
      // Generar PDF
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(18);
      doc.text('DETALLE DE PEDIDO', 105, 20, { align: 'center' });
      
      // Fecha
      doc.setFontSize(10);
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-PE')}`, 20, 30);
      
      // Cliente
      if (user?.name) {
        doc.text(`Cliente: ${user.name}`, 20, 37);
      }
      if (user?.email) {
        doc.text(`Email: ${user.email}`, 20, 44);
      }

      // Línea separadora
      doc.line(20, 50, 190, 50);

      // Productos
      let yPos = 60;
      doc.setFontSize(12);
      doc.text('Productos:', 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      cart.forEach((item, index) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        const subtotal = item.product.price * item.quantity;
        doc.text(`${index + 1}. ${item.product.name}`, 25, yPos);
        yPos += 7;
        doc.text(`   Cantidad: ${item.quantity}`, 25, yPos);
        yPos += 7;
        doc.text(`   Precio unitario: S/.${item.product.price.toFixed(2)}`, 25, yPos);
        yPos += 7;
        doc.text(`   Subtotal: S/.${subtotal.toFixed(2)}`, 25, yPos);
        yPos += 10;
      });

      // Línea separadora
      yPos += 5;
      doc.line(20, yPos, 190, yPos);
      yPos += 10;

      // Total
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`TOTAL: S/.${totalPrice.toFixed(2)}`, 20, yPos);

      // Convertir PDF a Blob
      const pdfBlob = doc.output('blob');
      const pdfFile = new File([pdfBlob], `pedido-${Date.now()}.pdf`, { type: 'application/pdf' });

      // Subir PDF a Supabase
      const pdfUrl = await uploadPdfToSupabase(pdfFile);

      if (!pdfUrl) {
        throw new Error('Error al subir el PDF');
      }

      // Mensaje simple para WhatsApp
      const ownerPhoneNumber = '51942863279'; // Número con código de país (Perú: 51)
      const message = `Detalle de pedido\n\n${pdfUrl}`;

      const whatsappUrl = `https://wa.me/${ownerPhoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      toast({
        title: "PDF generado",
        description: "El detalle de pedido se ha generado y está listo para enviar.",
      });
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al generar el detalle de pedido. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const yapeNumber = formData.get('yapeNumber') as string;
    const yapeVerificationCode = formData.get('yapeVerificationCode') as string;

    const orderData: Omit<Order, 'id'> = {
      userId: user.uid,
      createdAt: new Date().toISOString(),
      status: 'Procesando',
      total: totalPrice,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        imageUrl: item.product.images[0].url,
      })),
      paymentMethod: 'Yape',
      yapeNumber: yapeNumber,
      yapeVerificationCode: yapeVerificationCode,
    };
    
    try {
        await insertOrder(orderData);

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
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8 text-center">Finalizar Compra</h1>
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
                    <Label htmlFor="yapeNumber">Número de Yape</Label>
                    <Input 
                      id="yapeNumber" 
                      name="yapeNumber"
                      type="tel"
                      placeholder="Ej: 987654321" 
                      maxLength={9}
                      required 
                    />
                    <p className="text-xs text-muted-foreground">
                      Ingresa el número de teléfono asociado a tu cuenta Yape que realizará el pago
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yapeVerificationCode">Código de Verificación</Label>
                    <Input 
                      id="yapeVerificationCode" 
                      name="yapeVerificationCode"
                      type="text"
                      placeholder="Ej: 123456" 
                      maxLength={6}
                      required 
                    />
                    <p className="text-xs text-muted-foreground">
                      Ingresa el código de verificación de tu cuenta Yape
                    </p>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Si no puedes pagar por Yape,{' '}
                      <a 
                        href="tel:942863279" 
                        className="text-primary hover:underline font-semibold"
                      >
                        contáctanos
                      </a>
                    </p>

                    <Button
                      type="button"
                      onClick={handleWhatsAppVerification}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      variant="default"
                      disabled={isGeneratingPdf}
                    >
                      {isGeneratingPdf ? 'Generando PDF...' : 'Verificar y Enviar Boleta por WhatsApp'}
                    </Button>
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
