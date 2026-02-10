# Noemia – Tienda (Next.js + Supabase)

Tienda moderna con Next.js y Supabase (auth, base de datos, storage).

## Configuración

### 1. Variables de entorno

Copia `.env.example` a `.env` (o crea `.env`) y rellena:

- `NEXT_PUBLIC_SUPABASE_URL` – URL del proyecto en Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – clave pública (anon)
- `SUPABASE_SERVICE_ROLE_KEY` – clave de servicio (solo para scripts/seed; **no** exponer en el frontend)
- `GEMINI_API_KEY` – opcional, para flujos de IA

### 2. Base de datos en Supabase

En el **SQL Editor** de Supabase, ejecuta el contenido de:

`supabase/migrations/001_initial_schema.sql`

Así se crean las tablas `profiles`, `products`, `orders` y las políticas RLS.

### 3. Seed de productos

```bash
npm run db:seed
```

Requiere `SUPABASE_SERVICE_ROLE_KEY` en `.env` (Dashboard → Project Settings → API → service_role).

### 4. Primer usuario admin

Después de registrarte en la app, en Supabase SQL Editor:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';
```

### 5. Storage (imágenes y PDFs)

En Supabase: **Storage** → crear bucket **`images`** (público si quieres URLs públicas).

Para subir desde la app con la clave anon, añade una política en **Storage → images → Policies**:

- **INSERT**: `auth.role() = 'authenticated'` (o restringir a admins si prefieres)
- **SELECT**: `true` si el bucket es público

### 6. Auth (opcional en desarrollo)

En **Authentication → Providers → Email**: puedes desactivar “Confirm email” en desarrollo para no depender del correo de verificación.

---

## Scripts

- `npm run dev` – desarrollo
- `npm run build` / `npm run start` – producción
- `npm run db:seed` – seed de productos (usa `SUPABASE_SERVICE_ROLE_KEY`)
