'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useAuth } from '@/hooks/use-auth';

export function LoginDialog({ children }: { children: React.ReactNode }) {
  const [isLogin, setIsLogin] = useState(true);
  const [open, setOpen] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email-dialog') as string || formData.get('email-register-dialog') as string;
    const name = formData.get('fullName-dialog') as string || 'Usuario de Prueba';
    const address = formData.get('address-dialog') as string || '';

    login({ id: '1', email, name, address });
    setOpen(false);
    router.push('/account/orders');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center items-center">
           <div className="inline-block mx-auto mb-6">
            <Link href="/" onClick={() => setOpen(false)}>
                <Logo className="h-20 w-auto" />
            </Link>
          </div>
          <DialogTitle className="text-2xl font-headline">
            {isLogin ? 'Bienvenido de vuelta' : 'Crear una cuenta'}
          </DialogTitle>
          <DialogDescription>
            {isLogin ? 'Ingresa tus credenciales para acceder a tu cuenta' : 'Completa tus datos para registrarte'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
            {isLogin ? (
                <>
                <div className="grid gap-2">
                    <Label htmlFor="email-dialog">Email</Label>
                    <Input id="email-dialog" name="email-dialog" type="email" placeholder="m@example.com" required defaultValue="test@example.com" />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                    <Label htmlFor="password-dialog">Contraseña</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                        ¿Olvidaste tu contraseña?
                    </Link>
                    </div>
                    <Input id="password-dialog" name="password-dialog" type="password" required defaultValue="password" />
                </div>
                <Button type="submit" className="w-full">Entrar</Button>
                </>
            ) : (
                <>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="dni-dialog">DNI</Label>
                    <Input id="dni-dialog" name="dni-dialog" type="text" placeholder="12345678" required maxLength={8} />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="age-dialog">Edad</Label>
                    <Input id="age-dialog" name="age-dialog" type="number" placeholder="25" required />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="fullName-dialog">Nombre y Apellidos</Label>
                    <Input id="fullName-dialog" name="fullName-dialog" type="text" placeholder="Juan Pérez Diaz" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="address-dialog">Dirección</Label>
                    <Input id="address-dialog" name="address-dialog" type="text" placeholder="Av. Siempre Viva 123" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email-register-dialog">Email</Label>
                    <Input id="email-register-dialog" name="email-register-dialog" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password-register-dialog">Contraseña</Label>
                    <Input id="password-register-dialog" name="password-register-dialog" type="password" required />
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
      </DialogContent>
    </Dialog>
  );
}
