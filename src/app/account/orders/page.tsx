'use client';

import { useCollection } from '@/firebase';
import type { Order } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


export default function OrdersPage() {
  const { user, loading: userLoading } = useAuth();
  
  const { data: orders, loading: ordersLoading, error } = useCollection<Order>(
    user ? `users/${user.uid}/orders` : null,
    {
      orderBy: [['createdAt', 'desc']],
    }
  );

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Entregado':
        return 'default';
      case 'Enviado':
        return 'secondary';
      case 'Cancelado':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const isLoading = userLoading || ordersLoading;

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Historial de Pedidos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tus Pedidos</CardTitle>
           {error && <CardDescription className="text-destructive">Error al cargar los pedidos: {error.message}</CardDescription>}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              )}
              {!isLoading && orders && orders.length > 0 && orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-xs">#{order.id.substring(0, 7)}...</TableCell>
                  <TableCell>{format(order.createdAt.toDate(), "d 'de' MMMM, yyyy", { locale: es })}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(order.status) as any}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    S/{order.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="#">Ver Detalles</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {!isLoading && (!orders || orders.length === 0) && (
             <div className="text-center py-10">
                <p className="text-muted-foreground">Aún no has realizado ningún pedido.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
