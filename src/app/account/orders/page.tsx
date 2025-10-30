import { orders } from "@/lib/data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OrdersPage() {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Entregado":
        return "default";
      case "Enviado":
        return "secondary";
      case "Cancelado":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Historial de Pedidos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tus Pedidos</CardTitle>
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
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(order.status) as any}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">S/{order.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="#">Ver Detalles</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
