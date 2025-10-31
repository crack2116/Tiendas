'use client';

import { useCollection } from '@/firebase';
import type { Order } from '@/lib/types';
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
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminOrdersPage() {
  const { data: orders, loading: ordersLoading, error } = useCollection<Order>(
    'orders',
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

  const isLoading = ordersLoading;

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <h1 className="text-3xl font-bold font-headline mb-6">Todos los Pedidos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pedidos</CardTitle>
           {error && <CardDescription className="text-destructive">Error al cargar los pedidos: {error.message}</CardDescription>}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido ID</TableHead>
                <TableHead>Cliente ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              )}
              {!isLoading && orders && orders.length > 0 && orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-xs">#{order.id.substring(0, 7)}...</TableCell>
                   <TableCell className="font-medium text-xs">#{order.userId.substring(0, 7)}...</TableCell>
                  <TableCell>{format(order.createdAt.toDate(), "d 'de' MMMM, yyyy", { locale: es })}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(order.status) as any}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    S/{order.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && (!orders || orders.length === 0) && (
                 <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No se encontraron pedidos.
                    </TableCell>
                 </TableRow>
               )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
