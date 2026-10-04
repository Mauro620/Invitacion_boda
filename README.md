# Invitación de Boda Digital

Una experiencia inmersiva de invitación web personalizada para cada invitado. Diseñada como abrir una carta escrita a mano: íntima, cinematográfica, con confirmación de asistencia integrada y panel de administración.

## Stack

- **App**: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- **Animación**: Motion + microinteracciones suaves
- **Base de datos**: PostgreSQL 16
- **ORM**: Drizzle ORM + migraciones automáticas
- **Autenticación admin**: iron-session + bcryptjs (sin proveedor externo)
- **Validación**: Zod
- **Contenedores**: Docker + docker-compose (paridad local ↔ Railway)

## Inicio rápido

### Local (sin Docker)

```bash
# Clonar y instalar dependencias
git clone <repo> && cd invitacion-boda
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales de tu BD local PostgreSQL

# Ejecutar migraciones y seedear (opcional)
npm run db:migrate
npm run db:seed

# Servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000):
- `/i/demo` — invitación en modo demostración (sin BD, con datos ficticios)
- `/admin` — panel de administración (requiere login)
- `/api/health` — estado de la aplicación

### Local (con Docker)

```bash
# Clonar y configurar
git clone <repo> && cd invitacion-boda
cp .env.example .env

# Construir y ejecutar
docker compose up --build

# Opcional: correr seeds
docker compose exec app npm run db:seed
```

Variables de entorno útiles en `docker-compose.yml`:
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `APP_PORT` (puerto de la app, por defecto 3000)
- `SEED=1` (ejecuta seeds al arrancar; solo primera vez)

## Variables de entorno

| Variable | Ejemplo | Propósito |
|----------|---------|-----------|
| `DATABASE_URL` | `postgres://user:pass@localhost:5432/invitacion` | Conexión a PostgreSQL |
| `SESSION_SECRET` | 32+ caracteres aleatorios | Cifrado de cookies |
| `ADMIN_USERS` | `novio@mail.com:hash,novia@mail.com:hash` | Credenciales admin (ver abajo) |
| `PUBLIC_BASE_URL` | `http://localhost:3000` | URL pública para generar links |
| `NODE_ENV` | `development` o `production` | Entorno |

### Generar hash de contraseña para admin

```bash
node scripts/hash-password.mjs 'tu_contraseña'
```

Copia el hash y añade a `.env`:

```
ADMIN_USERS=novia@correo.com:$2a$12$...,novio@correo.com:$2b$12$...
```

**Nota para Docker Compose**: Si la contraseña contiene `$`, escápalo como `\$` en el archivo `.env` (Docker lo interpreta como variable).

## Scripts disponibles

| Script | Propósito |
|--------|-----------|
| `npm run dev` | Servidor local con hot reload (Turbopack) |
| `npm run build` | Compilar para producción |
| `npm run start` | Ejecutar servidor compilado |
| `npm run lint` | Revisar código |
| `npm run typecheck` | Verificar tipos TypeScript |
| `npm run check:content` | Listar todos los `TODO:` pendientes en `wedding.ts` |
| `npm run test` | Ejecutar tests (Vitest) |
| `npm run format` | Formatear código (Prettier) |
| `npm run db:generate` | Generar esquema de Drizzle |
| `npm run db:migrate` | Ejecutar migraciones |
| `npm run db:seed` | Cargar datos de demostración |

## Estructura

```
.
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing
│   │   ├── i/
│   │   │   ├── [token]/page.tsx        # Invitación personalizada
│   │   │   ├── [token]/opengraph-image.tsx
│   │   │   └── demo/page.tsx           # Demo sin BD
│   │   ├── admin/
│   │   │   ├── (auth)/login/
│   │   │   └── (panel)/               # Dashboard, importar, ver respuestas
│   │   └── api/
│   │       ├── health/                 # Healthcheck
│   │       └── actions/               # Server Actions
│   ├── components/
│   │   ├── sections/                  # Una carpeta por sección de la invitación
│   │   ├── motion/                    # Primitivas de animación
│   │   └── ui/                        # Componentes genéricos
│   ├── content/
│   │   └── wedding.ts                 # ⭐ Único lugar con textos, fechas, fotos
│   ├── db/
│   │   ├── schema.ts                  # Esquema de la BD
│   │   ├── index.ts                   # Pool de conexiones
│   │   └── seed.ts                    # Datos iniciales
│   ├── lib/                           # Utilidades (tokens, session, ics, whatsapp)
│   └── styles/
│       └── tokens.css                 # Tokens de diseño
├── public/
│   ├── photos/                        # Fotos de la invitación
│   └── audio/                         # Canción de fondo
├── docker-compose.yml
├── Dockerfile
├── docker/entrypoint.sh
└── scripts/
    ├── hash-password.mjs              # Generar bcrypt hash
    └── check-content.mjs              # Verificar TODOs
```

## Cómo funcionan las invitaciones

1. **Crear invitación** en el admin o importar CSV con la lista de invitados.
2. **Generar token único** (nanoid 10–12 caracteres) por grupo.
3. **Enviar enlace** `https://tudominio.com/i/TOKEN` por WhatsApp, email, etc.
4. Al abrir, se registra la primera apertura y se renderiza la invitación personalizada (nombre, grupo, etc.).
5. **RSVP** dentro de la misma invitación: confirmar asistencia, grupos familiares, restricciones alimentarias.
6. El admin ve todas las respuestas en tiempo real.

## Login de administración

1. Accede a `/admin/login`.
2. Email + contraseña definida en `ADMIN_USERS`.
3. Dentro del admin:
   - **Dashboard**: totales, confirmados, pendientes.
   - **Invitaciones**: crear, editar, enviar por WhatsApp.
   - **Importar**: cargar lista de invitados desde CSV (ver formato en `docs/example-invitations.csv`).
   - **Respuestas**: ver confirmaciones, restricciones dietarias, mensajes personales.

## Despliegue

Ver `docs/DEPLOY.md` para instrucciones completas de Railway, volúmenes, variables y dominio.

Checklist:
- [ ] Reemplazar contenido en `src/content/wedding.ts` (ver `docs/CONTENIDO.md`).
- [ ] Fotos en `/public/photos`.
- [ ] Canción de fondo en `/public/audio`.
- [ ] Prueba local: `npm run dev` o `docker compose up --build`.
- [ ] Deploy a Railway con Postgres, variables de entorno y dominio.
- [ ] Enviar primeras invitaciones de prueba.

## Testing

```bash
npm run test              # Tests unitarios
npx playwright test       # E2E móvil (iPhone 13 / Pixel 7)
npx lighthouse <url>      # Auditoría de rendimiento
```

## Licencia

Proyecto privado.
