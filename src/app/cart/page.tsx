'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, CreditCard, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, itemCount } = useCart();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">Your Shopping Cart</h1>
      
      {itemCount > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <Card key={item.product.id} className="overflow-hidden">
                <CardContent className="p-4 flex items-start gap-4">
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    width={100}
                    height={125}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <Link href={`/products/${item.product.slug}`} className="font-semibold text-lg hover:underline">
                      {item.product.name}
                    </Link>
                    <p className="text-muted-foreground">
                      S/{item.product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 0)}
                        className="h-8 w-14 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      S/{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive mt-4"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>S/{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>S/{totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">
                    <CreditCard className="mr-2 h-5 w-5" /> Proceed to Checkout
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground mt-2">Add some items to get started.</p>
          <Button asChild className="mt-6">
            <Link href="/">
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
