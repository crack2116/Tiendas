'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';

export function LoginDialog({ children }: { children: React.ReactNode }) {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center items-center">
           <div className="inline-block mx-auto mb-4">
            <Link href="/" className="flex items-center space-x-2">
                <Logo className="h-12 w-12" />
            </Link>
          </div>
          <DialogTitle className="text-2xl font-headline">
            {isLogin ? 'Bienvenido de vuelta' : 'Crear una cuenta'}
          </DialogTitle>
          <DialogDescription>
            {isLogin ? 'Ingresa tus credenciales para acceder a tu cuenta' : 'Completa tus datos para registrarte'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isLogin ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email-dialog">Email</Label>
                <Input id="email-dialog" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password-dialog">Contraseña</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input id="password-dialog" type="password" required />
              </div>
              <Button type="submit" className="w-full" asChild>
                  <Link href="/account/orders">Entrar</Link>
              </Button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dni-dialog">DNI</Label>
                  <Input id="dni-dialog" type="text" placeholder="12345678" required maxLength={8} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="age-dialog">Edad</Label>
                  <Input id="age-dialog" type="number" placeholder="25" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullName-dialog">Nombre y Apellidos</Label>
                <Input id="fullName-dialog" type="text" placeholder="Juan Pérez Diaz" required />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="address-dialog">Dirección</Label>
                  <Input id="address-dialog" type="text" placeholder="Av. Siempre Viva 123" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email-register-dialog">Email</Label>
                <Input id="email-register-dialog" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password-register-dialog">Contraseña</Label>
                <Input id="password-register-dialog" type="password" required />
              </div>
              <Button type="submit" className="w-full" asChild>
                  <Link href="/account/orders">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
        <div className="mt-4 text-center text-sm">
          {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          <Button variant="link" onClick={toggleForm} className="p-1">
            {isLogin ? 'Regístrate' : 'Entrar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
