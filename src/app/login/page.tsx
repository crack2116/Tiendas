'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [dni, setDni] = useState('');
  const [fullName, setFullName] = useState('');
  const [isDniLoading, setIsDniLoading] = useState(false);

  const handleDniBlur = async () => {
    if (dni.length !== 8) return;

    setIsDniLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFullName('Juan Alberto Pérez Diaz');
    setIsDniLoading(false);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setDni('');
    setFullName('');
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
          <div className="grid gap-4">
            {isLogin ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" asChild>
                    <Link href="/account">Entrar</Link>
                </Button>
              </>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input
                    id="dni"
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
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input id="fullName" type="text" placeholder="Tu nombre aparecerá aquí" required value={isDniLoading ? 'Verificando...' : fullName} readOnly={!isDniLoading && fullName !== ''} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input id="email-register" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-register">Contraseña</Label>
                  <Input id="password-register" type="password" required />
                </div>
                <Button type="submit" className="w-full" asChild>
                    <Link href="/account">Registrarse</Link>
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
        </CardContent>
      </Card>
    </div>
  );
}