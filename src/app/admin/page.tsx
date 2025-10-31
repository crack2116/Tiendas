'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, DollarSign, Users, CreditCard, Activity } from 'lucide-react';
import { useCollection } from '@/firebase';
import type { Order, Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminDashboard() {
  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError,
  } = useCollection<Order>('orders', {
    orderBy: [['createdAt', 'desc']],
    limit: 5,
  });

  const {
    data: products,
    loading: productsLoading,
    error: productsError,
  } = useCollection<Product>('products');

  const isLoading = ordersLoading || productsLoading;

  const totalRevenue = orders?.reduce((acc, order) => acc + order.total, 0) || 0;
  const totalSales = orders?.length || 0;
  const totalProducts = products?.length || 0;

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


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Totales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-24" /> : (
                <>
                  <div className="text-2xl font-bold">S/{totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Basado en las últimas {totalSales} ventas
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               {isLoading ? <Skeleton className="h-8 w-12" /> : (
                <>
                  <div className="text-2xl font-bold">+{totalSales}</div>
                  <p className="text-xs text-muted-foreground">
                    Total de pedidos recibidos
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-12" /> : (
                <>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    Productos en el inventario
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Pedidos Recientes</CardTitle>
                <CardDescription>
                  Un resumen de los últimos 5 pedidos en tu tienda.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/admin/orders">
                  Ver Todos
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
               {ordersError && <p className="text-destructive">Error: {ordersError.message}</p>}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente (ID)</TableHead>
                    <TableHead className="hidden xl:table-cell">
                      Fecha
                    </TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell className="hidden xl:table-column"><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                  {orders?.map(order => (
                    <TableRow key={order.id}>
                        <TableCell>
                            <div className="font-medium text-xs">#{order.userId.substring(0, 12)}...</div>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                            {format(order.createdAt.toDate(), "d MMM, yyyy, HH:mm", { locale: es })}
                        </TableCell>
                         <TableCell>
                            <Badge variant={getBadgeVariant(order.status) as any} className="text-xs" >
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">S/{order.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                   {!isLoading && orders?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24">
                                Aún no hay pedidos.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
  );
}
