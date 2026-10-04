# Invitación de Boda Inmersiva — Plan de Construcción con Claude Code

> **Objetivo:** una invitación web *mobile first*, personalizada por invitado, que se sienta como abrir una carta escrita a mano: íntima, cinematográfica y con el sentimiento de la pareja. Incluye confirmación de asistencia (RSVP) y panel de administración para los novios.
>
> **Estado de los datos:** aún no hay fecha, lugar ni fotos → se construye primero **la plantilla/mockup completa con placeholders** y un modo demo que funciona sin base de datos. Cuando llegue la información, solo se reemplaza contenido.

---

## 0. Cómo usar este archivo

1. Crear la carpeta del proyecto y copiar este archivo como `PLAN.md` en la raíz.
2. Abrir Claude Code en esa carpeta y pegar el **Prompt de arranque** (sección 10).
3. Claude Code (modelo principal = orquestador) ejecuta fase por fase, lanza **subagentes Sonnet/Haiku** y usa **git worktrees** donde hay trabajo paralelo.
4. Al final de cada fase: checklist ✅, commit y merge de worktrees a `main`.

**Leyenda de cada tarea**

| Marca | Significado |
|---|---|
| 🧠 **Orquestador** | El modelo principal (Opus) decide, integra y revisa |
| 🟣 **Sonnet** | Subagente para construcción con criterio (UI, backend, copy emotivo, QA) |
| 🟡 **Haiku** | Subagente para tareas mecánicas (seeds, placeholders, lint, docs, optimización de assets) |
| 🌳 **Worktree** | Corre en un git worktree aislado, en paralelo con otros |
| 🧩 **Skill** | Skill que debe cargarse antes de la tarea |

---

## 1. Stack (sin Supabase ni Vercel)

| Capa | Elección | Notas |
|---|---|---|
| App | **Next.js 15 (App Router) + TypeScript**, `output: "standalone"` | Front + API + Server Actions en un solo contenedor |
| Estilos | **Tailwind CSS v4** + CSS variables (design tokens) | Tokens definidos por la skill del proyecto |
| Animación | **Motion** (`motion/react`) + **Lenis** (scroll suave) | Respetar `prefers-reduced-motion` |
| Base de datos | **PostgreSQL 16** | Contenedor en local; servicio Postgres en Railway |
| ORM / migraciones | **Drizzle ORM + drizzle-kit** | Migraciones al arrancar el contenedor |
| Auth admin | **iron-session** (cookie cifrada) + credenciales de los novios en variables de entorno (hash bcrypt) | Sin proveedor externo |
| Validación | **Zod** | Formularios RSVP y admin |
| Imágenes | `next/image` + `sharp` · fotos en `/public/photos` (luego volumen de Railway si se suben desde admin) | |
| OG personalizada | `next/og` (ImageResponse) | Vista previa de WhatsApp con el nombre del invitado |
| Contenedores | **Dockerfile multi-stage** + **docker-compose** (app + db) | Paridad local ↔ Railway |
| Hosting | **Railway** | Servicio app desde Dockerfile + servicio Postgres |
| Tests | Vitest (unit) + Playwright (e2e móvil) | Chromium en viewport iPhone/Android |

---

## 2. Skills necesarias

Instalar **antes de la Fase 1** (a nivel de proyecto para que los subagentes también las vean):

```bash
# Dirección estética anti "diseño genérico de IA" (oficial Anthropic)
npx skills add anthropics/skills --skill frontend-design
# Motion y microinteracciones pulidas
npx skills add emilkowalski/skill
# Calidad: accesibilidad/UX + rendimiento React/Next
npx skills add vercel-labs/agent-skills
# (Opcional) catálogo de paletas, tipografías y estilos para explorar la estética
# /plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
# Para crear la skill propia del proyecto
npx skills add anthropics/skills --skill skill-creator
```

| Skill | ID corto en este plan | Se usa en |
|---|---|---|
| `frontend-design` (Anthropic) | **🧩 FD** | Dirección de arte, design system, todas las secciones |
| Emil Kowalski skill | **🧩 EK** | Apertura del sobre, transiciones, microinteracciones, cierre |
| `web-design-guidelines` (Vercel) | **🧩 WDG** | Auditoría de accesibilidad/UX (fase QA y admin) |
| `react-best-practices` (Vercel) | **🧩 RBP** | Arquitectura Next.js, rendimiento, server components |
| `composition-patterns` (Vercel) | **🧩 CP** | Componentes de sección reutilizables |
| `skill-creator` (Anthropic) | **🧩 SC** | Crear la skill propia `invitacion-estilo` |
| **`invitacion-estilo`** (propia, Fase 1) | **🧩 IE** | **Todas** las tareas de UI y copy: tokens, voz, reglas de motion |

> La skill propia **IE** es la pieza clave para que varios subagentes en worktrees distintos produzcan una experiencia coherente: contiene paleta, tipografías, escalas, curvas de animación, tono de voz y reglas de "qué nunca hacer".

---

## 3. Subagentes (`.claude/agents/`)

Crear estos archivos en la Fase 0. Ejemplo de formato:

```markdown
---
name: ui-section-builder
description: Construye secciones de la invitación siguiendo la skill invitacion-estilo. Usar para cualquier sección visual del lado del invitado.
model: sonnet
tools: Read, Write, Edit, Glob, Grep, Bash
---
Antes de escribir código carga las skills invitacion-estilo, frontend-design y la de Emil Kowalski.
Cada sección vive en src/components/sections/<Nombre>/ con su index.tsx, consume datos solo desde
src/content/wedding.ts y la invitación activa (props), es mobile first (diseña a 390px y luego escala),
respeta prefers-reduced-motion y no agrega dependencias sin justificarlo.
Al terminar: npm run lint && npm run typecheck && captura Playwright 390x844 de la sección.
```

| Agente | Modelo | Responsabilidad |
|---|---|---|
| `ui-section-builder` | 🟣 sonnet | Secciones de la invitación (UI + motion) |
| `motion-specialist` | 🟣 sonnet | Apertura del sobre, transiciones entre capítulos, efectos de partículas/pétalos |
| `copywriter-es` | 🟣 sonnet | Textos emotivos en español (placeholders bellos, no lorem ipsum) |
| `backend-builder` | 🟣 sonnet | Esquema, migraciones, server actions, auth admin, API |
| `admin-ui-builder` | 🟣 sonnet | Panel de administración |
| `qa-reviewer` | 🟣 sonnet | Auditoría WDG/RBP, Playwright móvil, Lighthouse, accesibilidad |
| `devops-docker` | 🟣 sonnet | Dockerfile, compose, entrypoint, guía de Railway |
| `seed-and-fixtures` | 🟡 haiku | Seeds de invitaciones demo, CSV de ejemplo, fixtures de tests |
| `placeholder-assets` | 🟡 haiku | SVG/gradientes placeholder para fotos, íconos, favicon, manifest |
| `lint-fixer` | 🟡 haiku | Arreglar errores de lint/typecheck después de merges |
| `docs-writer` | 🟡 haiku | README, guía de "cómo reemplazar contenido", guía de deploy |
| `image-optimizer` | 🟡 haiku | (Fase 6) Redimensionar/convertir fotos reales a AVIF/WebP |

**Regla de orquestación:** el orquestador nunca delega decisiones estéticas globales; las fija en la skill IE y los subagentes las ejecutan.

---

## 4. Estructura del repositorio

```
.
├── PLAN.md
├── CLAUDE.md                     # Reglas del proyecto (ver sección 9)
├── .claude/
│   ├── agents/*.md
│   └── skills/invitacion-estilo/SKILL.md
├── Dockerfile
├── docker-compose.yml
├── docker/entrypoint.sh          # migra y arranca
├── .env.example
├── drizzle.config.ts
├── public/
│   ├── photos/                   # placeholders → fotos reales
│   ├── audio/                    # canción (placeholder silencioso)
│   └── textures/                 # papel, grano, sello de cera
└── src/
    ├── app/
    │   ├── page.tsx              # landing neutra (sin datos privados)
    │   ├── i/[token]/page.tsx    # invitación personalizada
    │   ├── i/[token]/opengraph-image.tsx
    │   ├── i/demo/page.tsx       # modo demo sin BD
    │   ├── admin/(auth)/login/page.tsx
    │   ├── admin/(panel)/...
    │   └── api/health/route.ts
    ├── components/
    │   ├── sections/             # una carpeta por sección
    │   ├── motion/               # primitivas: Reveal, Parallax, SplitText, Petals
    │   └── ui/
    ├── content/wedding.ts        # ⭐ ÚNICO lugar con textos, fechas, lugares, fotos
    ├── db/schema.ts · db/index.ts
    ├── lib/ (session, ics, whatsapp, tokens, rate-limit)
    └── styles/tokens.css
```

---

## 5. Contenido con placeholders (`src/content/wedding.ts`)

Todo el contenido real entra por **un solo archivo**. Durante el mockup se usan valores marcados con `TODO:` para que `npm run check:content` liste lo pendiente.

```ts
export const wedding = {
  couple: { partnerA: "Violeta", partnerB: "David", hashtag: "#TODO" },
  date: { iso: "2027-01-01T16:00:00-05:00", /* TODO: fecha real */ timezone: "America/Bogota" },
  quote: "Y de pronto, todo tuvo sentido.",          // copy placeholder emotivo
  story: [ { year: "TODO", title: "Cómo nos conocimos", text: "…", photo: "/photos/story-1.svg" } ],
  events: [
    { kind: "ceremonia", name: "TODO:Lugar", address: "TODO", time: "16:00", mapsUrl: "TODO" },
    { kind: "recepcion", name: "TODO:Lugar", address: "TODO", time: "18:00", mapsUrl: "TODO" },
  ],
  itinerary: [ { time: "16:00", label: "Ceremonia" }, { time: "17:30", label: "Cóctel" } /* … */ ],
  dressCode: { label: "Formal / Etiqueta", palette: ["#…"], avoid: ["blanco", "marfil"], notes: "…" },
  gifts: { mode: "lluvia-de-sobres", text: "…", bank: null },
  rsvpDeadline: "TODO",
  music: { src: "/audio/placeholder.mp3", title: "TODO" },
  gallery: ["/photos/g-1.svg" /* … */],
} as const;
```

**Fotos requeridas (lista para pedir a los novios):** 1 portada vertical (9:16), 1 foto para el sobre/intro, 3–5 fotos de historia, 6–12 fotos de galería, 1 foto horizontal para la imagen OG (1200×630). Ideal: originales sin compresión de WhatsApp.

---

## 6. Secciones de la experiencia (el corazón del proyecto)

Narrativa en **capítulos**: cada sección es un "momento", con transición propia, ocupando al menos una pantalla en móvil. Ritmo: emoción → información → acción → despedida.

| # | Sección | Qué siente el invitado | Detalle de implementación | Skills |
|---|---|---|---|---|
| 00 | **Apertura del sobre** | "Esto es para mí" | Pantalla completa con textura de papel, sobre con **sello de cera** y el texto "Para *Familia Pérez*". Al tocar: el sello se rompe, la solapa se abre en 3D, la carta sube. Ese gesto **activa la música** (los navegadores bloquean el autoplay). Vibración ligera (`navigator.vibrate`) si existe | FD · EK · IE |
| 01 | **Portada / Hero** | Asombro | Nombres en tipografía display con revelado letra a letra, foto vertical con parallax suave y Ken Burns, fecha en romanos o caligrafía, indicador de scroll animado | FD · EK · IE |
| 02 | **Introducción: celebrar el amor** | Ternura | Texto corto y poético revelado por líneas con el scroll ("Hay amores que se eligen todos los días…"). Fondo con grano y luz cálida | FD · IE + copywriter |
| 03 | **Nuestra historia** | Complicidad | Línea de tiempo vertical con 3–5 hitos; cada foto entra con máscara/clip-path; hilo dorado que se dibuja (SVG `pathLength`) mientras se hace scroll | FD · EK · CP |
| 04 | **Mensaje personal** | "Me tienen en cuenta" | Si la invitación tiene `personal_message`, aparece como nota manuscrita (fuente script) firmada por los novios. Si no, mensaje genérico cálido | IE |
| 05 | **Fecha y hora** | Expectativa | Calendario del mes con el día marcado por un corazón dibujado, **cuenta regresiva** viva (días/horas/min), botón **Agregar al calendario** (.ics + Google Calendar) | FD · EK |
| 06 | **Lugar(es)** | Orientación | Tarjetas de ceremonia y recepción con ilustración/foto del lugar, dirección, hora, botones **Cómo llegar** (Google Maps / Waze) | FD · CP |
| 07 | **Itinerario del día** | Tranquilidad | Timeline horizontal deslizable con íconos de línea (anillos, copa, plato, pista de baile) | FD · CP |
| 08 | **Código de vestimenta** | Claridad con estilo | Etiqueta del dress code, **paleta de colores sugerida** en círculos de tela, colores a evitar (blanco/marfil), siluetas ilustradas (SVG lineal) para él/ella | FD · IE |
| 09 | **Galería** | Cercanía | Carrusel con *snap* táctil o mosaico con lightbox; lazy loading y blur placeholder | FD · RBP |
| 10 | **Regalos / Lluvia de sobres** | Comodidad | Texto delicado, opción de datos bancarios con botón **copiar** (oculto hasta tocar) | FD · IE |
| 11 | **Recomendaciones** | Cuidado | Hospedaje, transporte, si es solo adultos, clima y hashtag | CP |
| 12 | **Confirmación (RSVP)** | Acción fácil | Lista de las personas del grupo con selector Asiste / No asiste por persona, restricciones alimentarias y mensaje para los novios. Fecha límite visible. Estado optimista + Server Action. Si ya respondió: muestra su respuesta y permite editar hasta la fecha límite | FD · RBP · WDG |
| 13 | **Cierre / despedida** | Emoción final | Si confirma: lluvia de **pétalos** (canvas, máximo 60 partículas) y "Te esperamos". Si no: "Te llevaremos en el corazón". Frase final con las iniciales en monograma | EK · IE |
| — | **Controles globales** | Control | Botón flotante de música (play/mute), barra de progreso fina por capítulos, botón "Confirmar" fijo tras pasar la sección 05 | EK · WDG |

**Reglas de inmersión (van en la skill IE):**

- Diseñar a **390×844** primero; desktop = la misma carta centrada sobre un fondo de mesa o tela.
- Máximo **2 familias tipográficas** (display serif o script + serif de lectura) y paleta de 4–5 tonos con un acento metálico.
- Motion con **curvas suaves y duraciones de 600–1200 ms** para revelados; nada de rebotes. Todo desactivable con `prefers-reduced-motion`.
- Textura sutil (grano/papel) en lugar de colores planos; sombras cálidas, nunca grises puros.
- El nombre del invitado aparece al menos **3 veces**: sobre, mensaje personal y RSVP.
- Rendimiento: LCP < 2.5 s en 4G, JS de la invitación < 200 KB gzip, la música carga solo después de abrir el sobre.

**3 direcciones estéticas para el mockup** (el orquestador genera las tres en la sección 00 + 01 y los novios eligen):

1. **Romántico clásico**: crema, dorado viejo, verde salvia; Cormorant Garamond + Pinyon Script.
2. **Jardín boho**: terracota, arena, flores secas ilustradas; Playfair Display + Mrs Saint Delafield.
3. **Minimal editorial**: marfil, negro tinta, un acento borgoña; tipografía display grande, mucho aire.

---

## 7. Modelo de datos (Drizzle / Postgres)

```ts
invitations: id (uuid), token (text, único, 10–12 chars nanoid), display_name, max_guests,
             phone, tag ('familia'|'amigos'|'trabajo'|…), personal_message (nullable),
             sent_at, first_opened_at, last_opened_at, open_count, responded_at,
             note_to_couple, created_at, updated_at
guests:      id, invitation_id (FK, cascade), name, is_plus_one (bool),
             attending (bool | null), dietary_notes, updated_at
audit_log:   id, invitation_id, action ('open'|'rsvp'|'edit'), meta (jsonb), created_at
```

El contenido general vive en `wedding.ts` (versionado en git), no en la BD. Si más adelante los novios quieren editar textos desde el admin, se agrega `settings (key, value jsonb)`.

**Seguridad**

- El token es la única llave del invitado. `notFound()` si no existe, sin dar pistas.
- La Server Action del RSVP valida token + `guest.invitation_id` y aplica rate limit (en memoria por IP+token).
- El admin usa iron-session con `ADMIN_USERS` en el entorno (`correo:hashBcrypt,correo:hashBcrypt`) y middleware en `/admin/(panel)`.
- `robots: noindex` en `/i/*` y `/admin/*`.

---

## 8. Fases

### Fase 0 — Preparación del repo · 🧠 Orquestador (secuencial)

| Tarea | Agente | Skill |
|---|---|---|
| `git init`, Next.js + TS + Tailwind, ESLint/Prettier, scripts `typecheck`, `check:content` | 🧠 | RBP |
| Instalar skills (sección 2) | 🧠 | — |
| Crear `.claude/agents/*.md` (sección 3) y `CLAUDE.md` (sección 9) | 🧠 | — |
| `.env.example`, `.gitignore`, estructura de carpetas | 🟡 `docs-writer` | — |

✅ **Salida:** `npm run dev` funciona, commit `chore: bootstrap`.

---

### Fase 1 — Identidad y design system · 🧠 + 🟣 (secuencial: todo depende de esto)

| Tarea | Agente | Skill |
|---|---|---|
| Definir las 3 direcciones estéticas como tokens (`tokens.css`), tipografías y escala | 🧠 | **FD** (+ UI/UX Pro Max opcional) |
| Crear la skill **`invitacion-estilo`**: tokens, voz (cálida, poética, tuteo/usted según la pareja), reglas de motion, checklist de inmersión y "nunca hacer" | 🧠 | **SC** · FD · EK |
| Primitivas de motion: `Reveal`, `SplitText`, `Parallax`, `DrawPath`, `Petals`, hook `useReducedMotion` | 🟣 `motion-specialist` | **EK** · IE |
| Copy placeholder emotivo para todas las secciones (en `wedding.ts`) | 🟣 `copywriter-es` | IE |
| Placeholders visuales: SVG con gradientes y siluetas para fotos, textura de papel, sello de cera SVG | 🟡 `placeholder-assets` | IE |

✅ **Salida:** página `/styleguide` con tokens, tipografías y primitivas en las 3 direcciones. **Checkpoint con los novios: elegir dirección.**

---

### Fase 2 — Infraestructura Docker + backend base · 🌳 en paralelo con Fase 3

**Worktree `wt-backend`** (🟣 `backend-builder` y 🟣 `devops-docker`):

| Tarea | Agente | Skill |
|---|---|---|
| `docker-compose.yml`: `app` (build local, puerto 3000) + `db` (postgres:16-alpine, volumen, healthcheck) | 🟣 `devops-docker` | — |
| `Dockerfile` multi-stage (deps → build → runner `node:22-alpine`, usuario no root, `standalone`), `entrypoint.sh` que ejecuta `drizzle-kit migrate` y luego `node server.js` | 🟣 `devops-docker` | RBP |
| `/api/health` (verifica la BD) | 🟣 `devops-docker` | — |
| Esquema Drizzle, migración inicial, `db/index.ts` con pool | 🟣 `backend-builder` | RBP |
| `lib/tokens.ts` (nanoid), `lib/ics.ts`, `lib/whatsapp.ts` (`wa.me` con mensaje prellenado) | 🟣 `backend-builder` | — |
| Server Actions: `recordOpen(token)`, `submitRsvp(token, payload)` con Zod y rate limit | 🟣 `backend-builder` | RBP |
| Seeds: 10 invitaciones demo con distintos casos (1 persona, familia de 5, con mensaje personal, ya respondida) + CSV de ejemplo | 🟡 `seed-and-fixtures` | — |

✅ **Salida:** `docker compose up --build` levanta la app + BD migrada + seeds, y `/api/health` responde 200.

---

### Fase 3 — Mockup de la invitación (todas las secciones) · 🌳🌳🌳 worktrees en paralelo

Requiere la Fase 1 mergeada. Cada worktree trabaja **solo** en sus carpetas de `components/sections/*` para evitar conflictos; la página `i/demo` la compone el orquestador.

| Worktree | Secciones | Agente | Skills |
|---|---|---|---|
| `wt-opening` | 00 Apertura del sobre · 01 Hero · controles globales (música, progreso) | 🟣 `motion-specialist` | **FD · EK · IE** |
| `wt-story` | 02 Introducción · 03 Historia · 04 Mensaje personal · 09 Galería | 🟣 `ui-section-builder` | **FD · EK · CP · IE** |
| `wt-details` | 05 Fecha y hora · 06 Lugares · 07 Itinerario · 08 Dress code | 🟣 `ui-section-builder` | **FD · CP · IE** |
| `wt-action` | 10 Regalos · 11 Recomendaciones · 12 RSVP (UI con action mock) · 13 Cierre | 🟣 `ui-section-builder` | **FD · EK · RBP · IE** |

Después de los merges:

| Tarea | Agente | Skill |
|---|---|---|
| Componer `/i/demo` (datos falsos, **sin BD**) en el orden narrativo, con transiciones entre capítulos | 🧠 | FD · EK |
| Arreglar lint/typecheck después de los merges | 🟡 `lint-fixer` | — |
| Capturas Playwright 390×844 de cada sección → `docs/mockup/*.png` para mostrar a los novios | 🟡 `seed-and-fixtures` | — |

✅ **Salida:** **mockup navegable completo** en `/i/demo` con placeholders. Se puede desplegar ya en Railway para que los novios lo vean en su celular.

---

### Fase 4 — Invitación real conectada · 🧠 + 🟣 (secuencial, corto)

| Tarea | Agente | Skill |
|---|---|---|
| `i/[token]/page.tsx`: carga la invitación y sus invitados (server component), registra la apertura y pasa props a las secciones | 🟣 `backend-builder` | RBP |
| Conectar el RSVP real (UI optimista, estados de error, edición hasta la fecha límite) | 🟣 `ui-section-builder` | RBP · WDG · IE |
| `opengraph-image.tsx` personalizada: "Querida *Familia Pérez*…" sobre la foto de portada | 🟣 `ui-section-builder` | FD · IE |
| Metadata `noindex`, título personalizado, `theme-color`, manifest | 🟡 `placeholder-assets` | — |

✅ **Salida:** e2e de abrir invitación con token → confirmar → ver la respuesta guardada.

---

### Fase 5 — Panel de administración · 🌳 `wt-admin` (puede correr en paralelo con la Fase 4)

| Tarea | Agente | Skill |
|---|---|---|
| Login (iron-session), middleware y logout | 🟣 `backend-builder` | RBP |
| Dashboard: totales de personas, confirmados, no asisten, pendientes, abiertas sin responder; barra de progreso hacia la fecha límite | 🟣 `admin-ui-builder` | FD · WDG |
| Lista de invitaciones: búsqueda, filtros por etiqueta y estado, detalle con invitados y mensaje | 🟣 `admin-ui-builder` | CP · WDG |
| Crear/editar invitación (grupo, cupos, teléfono, mensaje personal) y regenerar token | 🟣 `admin-ui-builder` | CP |
| Importar CSV (`nombre_grupo, telefono, etiqueta, invitados separados por \|`) con vista previa | 🟣 `backend-builder` | — |
| Botón **Enviar por WhatsApp** (abre `wa.me` con mensaje + enlace y marca `sent_at`) y **Copiar enlace** | 🟣 `admin-ui-builder` | — |
| Exportar CSV (para catering: nombres + restricciones alimentarias) | 🟡 `seed-and-fixtures` | — |
| Muro de mensajes de los invitados (`note_to_couple`) | 🟣 `admin-ui-builder` | FD · IE |

✅ **Salida:** los novios pueden cargar la lista, enviar y seguir respuestas desde el celular (el admin también es mobile first).

---

### Fase 6 — QA, rendimiento y despliegue en Railway · 🟣 + 🟡

| Tarea | Agente | Skill |
|---|---|---|
| Auditoría de accesibilidad y UX de invitación y admin | 🟣 `qa-reviewer` | **WDG** |
| Auditoría de rendimiento (bundle, imágenes, server/client components) | 🟣 `qa-reviewer` | **RBP** |
| Playwright e2e en iPhone 13 / Pixel 7 + Lighthouse móvil (meta ≥ 90 en Performance y Accesibilidad) | 🟣 `qa-reviewer` | — |
| Revisión de "inmersión": recorrer `/i/demo` contra el checklist de la skill IE | 🧠 | FD · EK · IE |
| Guía de deploy en Railway (`docs/DEPLOY.md`) | 🟡 `docs-writer` | — |

**Despliegue en Railway**

1. Nuevo proyecto → **Add Postgres** (servicio gestionado) → copiar `DATABASE_URL`.
2. **New Service → GitHub repo** → Railway detecta el `Dockerfile`.
3. Variables: `DATABASE_URL=${{Postgres.DATABASE_URL}}`, `SESSION_SECRET`, `ADMIN_USERS`, `PUBLIC_BASE_URL`, `NODE_ENV=production`.
4. Healthcheck path: `/api/health`. Dejar **App Sleeping desactivado** para que la invitación responda siempre al instante.
5. Dominio: el `*.up.railway.app` gratuito o un dominio propio (CNAME).
6. Si se suben fotos desde el admin: montar un **Volume** en `/app/uploads`.

> `docker-compose.yml` es para desarrollo local y paridad; en Railway, app y BD van como servicios separados del mismo proyecto.

---

### Fase 7 — Contenido real (cuando lleguen los datos) · 🟡 + 🟣

| Tarea | Agente | Skill |
|---|---|---|
| Optimizar fotos reales (AVIF/WebP, 3 tamaños, blur placeholder) | 🟡 `image-optimizer` | — |
| Reemplazar los `TODO:` de `wedding.ts` → `npm run check:content` en 0 | 🟡 `seed-and-fixtures` | — |
| Ajustar el copy con la voz real de la pareja (anécdotas, frases propias) | 🟣 `copywriter-es` | IE |
| Ajuste fino de encuadres y paleta según las fotos reales | 🧠 | FD |
| Prueba final: invitación enviada a los novios por WhatsApp → abrir → confirmar → ver en el admin | 🧠 | — |

---

## 9. `CLAUDE.md` (reglas del proyecto)

```markdown
# Invitación de boda — reglas
- Lee PLAN.md antes de cada fase. Marca las tareas completadas con [x].
- Todo el contenido sale de src/content/wedding.ts. Nunca hardcodees textos, fechas o lugares en componentes.
- Mobile first: diseña a 390px. Prueba con Playwright 390x844.
- Toda UI del invitado carga las skills invitacion-estilo + frontend-design; el motion, también la de Emil Kowalski.
- Respeta prefers-reduced-motion en todo componente animado.
- No agregues dependencias sin justificarlo en el commit.
- Delegación: tareas mecánicas → subagentes haiku; UI, backend y QA → subagentes sonnet; decisiones estéticas globales → orquestador.
- Trabajo paralelo → git worktrees (un worktree por grupo de secciones; no tocar carpetas de otro worktree).
- Antes de mergear: npm run lint && npm run typecheck && npm run test.
- Docker: los cambios deben funcionar con `docker compose up --build`.
- Español neutro-colombiano, cálido. Sin lorem ipsum: los placeholders también deben emocionar.
```

---

## 10. Prompt de arranque para Claude Code

```text
Lee PLAN.md completo. Vamos a construir la invitación de boda descrita ahí.
Ejecuta la Fase 0 y la Fase 1 tú mismo (eres el orquestador), creando los subagentes de .claude/agents
y la skill invitacion-estilo. Detente al terminar la Fase 1 y muéstrame /styleguide con las 3 direcciones
estéticas para que elijamos una.

Después de que elija:
- Lanza la Fase 2 en un worktree (subagentes sonnet backend-builder y devops-docker; seeds con haiku).
- En paralelo, lanza la Fase 3 con 4 worktrees (wt-opening, wt-story, wt-details, wt-action) usando
  los subagentes indicados y las skills marcadas en cada fila.
- Integra, compón /i/demo y deja el mockup corriendo con `docker compose up --build`.
Usa haiku para todo lo mecánico y sonnet para la construcción. Reporta al final de cada fase con
checklist y capturas móviles.
```

---

## 11. Información pendiente de los novios

- [ ] Nombres como quieren que aparezcan (y orden)
- [ ] Fecha y hora · ceremonia y recepción (nombres, direcciones, links de Maps)
- [ ] Itinerario aproximado
- [ ] Código de vestimenta y colores (sugeridos y a evitar)
- [ ] ¿Solo adultos? ¿Acompañantes permitidos?
- [ ] Regalos: lluvia de sobres / cuenta bancaria / lista
- [ ] Fecha límite de confirmación
- [ ] Canción (archivo con derechos de uso o una versión instrumental libre)
- [ ] Historia: 3–5 hitos con año + anécdota corta
- [ ] Fotos (ver sección 5)
- [ ] Lista de invitados (CSV: grupo, teléfono, etiqueta, nombres)
- [ ] Tono: ¿tutear o usted?
- [ ] Dirección estética elegida (Fase 1)
