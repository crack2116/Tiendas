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
  const [dni, setDni] = useState('');
  const [fullName, setFullName] = useState('');
  const [isDniLoading, setIsDniLoading] = useState(false);

  const handleDniBlur = async () => {
    if (dni.length !== 8) return;

    setIsDniLoading(true);
    // Simulación: Llamada a API para validar DNI de Perú para mayores de 18
    await new Promise(resolve => setTimeout(resolve, 1000));
    // En una aplicación real, esto sería una llamada a un servicio externo.
    // Esto es solo una respuesta de ejemplo.
    setFullName('Juan Alberto Pérez Diaz'); 
    setIsDniLoading(false);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Resetear campos al cambiar de formulario
    setDni('');
    setFullName('');
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
              <div className="grid gap-2">
                <Label htmlFor="dni-dialog">DNI (Perú)</Label>
                <Input
                  id="dni-dialog"
                  type="text"
                  placeholder="12345678"
                  required
                  maxLength={8}
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  onBlur={handleDniBlur}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullName-dialog">Nombre completo</Label>
                <Input 
                  id="fullName-dialog" 
                  type="text" 
                  placeholder="Tu nombre aparecerá aquí" 
                  required 
                  value={isDniLoading ? 'Verificando...' : fullName} 
                  readOnly={!isDniLoading && fullName !== ''} 
                  />
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
