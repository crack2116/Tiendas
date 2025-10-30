'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string || formData.get('email-register') as string;
    const name = formData.get('fullName') as string || 'Usuario de Prueba';
    const address = formData.get('address') as string || '';
    
    // Simple mock login
    login({ id: '1', email, name, address });
    router.push('/account/orders');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <div className="inline-block mx-auto mb-4">
            <Link href="/" className="flex items-center space-x-2">
                <Logo className="h-12 w-12" />
            </Link>
          </div>
          <CardTitle className="text-2xl font-headline">
            {isLogin ? 'Bienvenido de vuelta' : 'Crear una cuenta'}
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Ingresa tus credenciales para acceder a tu cuenta' : 'Completa tus datos para registrarte'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {isLogin ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required defaultValue="test@example.com" />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Contraseña</Label>
                      <Link href="#" className="ml-auto inline-block text-sm underline">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <Input id="password" name="password" type="password" required defaultValue="password" />
                  </div>
                  <Button type="submit" className="w-full">Entrar</Button>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="dni">DNI</Label>
                        <Input id="dni" name="dni" type="text" placeholder="12345678" required maxLength={8} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="age">Edad</Label>
                        <Input id="age" name="age" type="number" placeholder="25" required />
                      </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Nombre y Apellidos</Label>
                    <Input id="fullName" name="fullName" type="text" placeholder="Juan Pérez Diaz" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" name="address" type="text" placeholder="Av. Siempre Viva 123" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input id="email-register" name="email-register" type="email" placeholder="m@example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password-register">Contraseña</Label>
                    <Input id="password-register" name="password-register" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">Registrarse</Button>
                </>
              )}
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            <Button variant="link" onClick={toggleForm} className="p-1">
              {isLogin ? 'Regístrate' : 'Entrar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
