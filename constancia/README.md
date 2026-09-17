# Constancia — gestor de hábitos

Aplicación web para llevar el registro de hábitos personales: crearlos, marcarlos como cumplidos cada día y ver tu racha. Frontend en React + TypeScript (Vite), backend en Supabase (Postgres + API REST autogenerada).

## Stack

- **Frontend:** React 18, TypeScript, Vite
- **Backend / base de datos:** Supabase (Postgres, con Row Level Security)
- **Despliegue:** Vercel (frontend) + Supabase (backend, ya en la nube)

## Estructura

```
src/
  components/     HabitForm, HabitItem, HabitList
  lib/
    supabaseClient.ts   cliente de Supabase (lee las env vars)
    habitsApi.ts        funciones CRUD tipadas (GET/POST/PUT/DELETE)
  types.ts        interfaces del modelo de datos (Habit, NewHabit)
  App.tsx         estado global: loading / error / éxito
supabase/
  schema.sql      SQL para crear la tabla y las políticas de acceso
```

---

## 1. Requisitos

- Node.js 18 o superior
- Una cuenta gratuita en [supabase.com](https://supabase.com)
- Una cuenta gratuita en [vercel.com](https://vercel.com)
- Una cuenta en [github.com](https://github.com)

---

## 2. Configurar Supabase (el backend)

1. Entra a [supabase.com](https://supabase.com) → **New project**.
2. Elige un nombre, una contraseña de base de datos (guárdala de forma segura) y una región cercana.
3. Cuando el proyecto termine de crearse, ve a **SQL Editor** (ícono de la izquierda) → **New query**.
4. Copia y pega el contenido de `supabase/schema.sql` (está en este repo) y dale **Run**. Esto crea la tabla `habits` y las políticas de acceso.
5. Ve a **Project Settings → API**. Ahí vas a ver dos datos que necesitas:
   - **Project URL** → esto es tu `VITE_SUPABASE_URL`
   - **anon public key** → esto es tu `VITE_SUPABASE_ANON_KEY`

Guárdalos, los vas a usar en el paso siguiente y en Vercel.

---

## 3. Correr el proyecto en local

```bash
npm install
cp .env.example .env
```

Abre `.env` y pega tus valores reales de Supabase:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

Luego:

```bash
npm run dev
```

Abre `http://localhost:5173`. Deberías poder crear un hábito, marcarlo como cumplido y verlo reflejado en la tabla `habits` desde el **Table Editor** de Supabase.

---

## 4. Subir el proyecto a GitHub

Si el proyecto todavía no es un repositorio git:

```bash
git init
git add .
git commit -m "Proyecto inicial: gestor de hábitos con React, TS y Supabase"
```

Crea el repositorio en GitHub:

1. Entra a [github.com/new](https://github.com/new).
2. Ponle un nombre (por ejemplo `constancia`), déjalo **público o privado** según pida tu curso, y **no** marques "Add a README" (ya tienes uno).
3. Click en **Create repository**.

GitHub te va a mostrar unos comandos; usa estos (reemplaza `TU-USUARIO`):

```bash
git branch -M main
git remote add origin https://github.com/TU-USUARIO/constancia.git
git push -u origin main
```

Recuerda: tu archivo `.env` **no se sube** (ya está en `.gitignore`), así que tu anon key no queda expuesta en el repo. Eso es correcto y esperado.

### Flujo de ramas por feature (lo que pide la guía)

Para trabajar por feature en vez de directo en `main`:

```bash
git checkout -b feature/nombre-de-la-funcionalidad
# ... haces tus cambios ...
git add .
git commit -m "Agrega X"
git push -u origin feature/nombre-de-la-funcionalidad
```

Luego abres un Pull Request en GitHub de esa rama hacia `main` y lo mergeas ahí. Si quieres proteger `main` para que no se pueda hacer push directo: **Settings del repo → Branches → Add branch protection rule** → pones `main` como patrón y activas "Require a pull request before merging".

---

## 5. Desplegar el frontend en Vercel

1. Entra a [vercel.com](https://vercel.com) y haz login con tu cuenta de GitHub.
2. Click en **Add New... → Project**.
3. Busca y selecciona el repositorio `constancia` que acabas de subir → **Import**.
4. Vercel detecta automáticamente que es un proyecto Vite (Framework Preset: Vite). No cambies nada ahí.
5. Antes de darle deploy, abre la sección **Environment Variables** y agrega las mismas dos variables que tienes en tu `.env`:

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | tu Project URL de Supabase |
   | `VITE_SUPABASE_ANON_KEY` | tu anon public key de Supabase |

6. Click en **Deploy**. En 1-2 minutos te da una URL tipo `https://constancia-tuusuario.vercel.app`.

Cada vez que hagas `git push` a `main`, Vercel vuelve a desplegar automáticamente. Los pushes a otras ramas generan "preview deployments" con su propia URL, útiles para revisar un feature antes de mergearlo.

---

## 6. Checklist de entrega

- [ ] Repo en GitHub con `main` y al menos una rama de feature usada durante el desarrollo
- [ ] Tabla `habits` creada en Supabase con RLS habilitado
- [ ] URL de Vercel funcionando en producción (probarla en una pestaña de incógnito, no solo en local)
- [ ] Variables de entorno configuradas tanto en `.env` local como en Vercel
- [ ] Demo en vivo: crear un hábito, marcarlo cumplido, ver la racha subir, eliminarlo

---

## Notas de diseño

- El CRUD completo vive en `src/lib/habitsApi.ts`: cada función corresponde a un endpoint (GET/POST/PUT/DELETE) contra la tabla `habits`.
- `App.tsx` maneja tres estados de la petición por separado (`loading`, `error`, datos) para que la UI nunca se quede en un estado ambiguo.
- Las políticas de Supabase en `schema.sql` dan acceso público de lectura/escritura porque el proyecto no tiene autenticación. Si en una siguiente iteración agregas login de usuarios, ese es el archivo que hay que actualizar para filtrar por `auth.uid()`.
