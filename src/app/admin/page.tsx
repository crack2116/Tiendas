import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Panel de Administración</h1>
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido</CardTitle>
          <CardDescription>
            Desde aquí podrás gestionar los productos y el contenido de la tienda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Selecciona una opción del menú para empezar.</p>
        </CardContent>
      </Card>
    </div>
  );
}
