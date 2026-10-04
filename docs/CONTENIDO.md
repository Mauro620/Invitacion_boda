# Cómo reemplazar el contenido

Esta guía explica cómo adaptar la invitación con los datos reales de la pareja. **Todo el contenido vive en un solo archivo**: `src/content/wedding.ts`.

## Paso 1: Revisar qué falta

```bash
npm run check:content
```

Este comando lista todos los `TODO:` que hay en `wedding.ts`. Muestra línea por línea qué está pendiente.

## Paso 2: Abrir `src/content/wedding.ts` y completar los datos

### Pareja

```ts
couple: { 
  partnerA: "Violetta",          // Nombre 1
  partnerB: "David",              // Nombre 2
  hashtag: "#TODO"                // Hashtag para redes (ej: #VioletayDavid)
}
```

### Fecha y hora

```ts
date: { 
  iso: "2026-12-05T16:00:00-05:00",  // ISO 8601 con zona horaria
  timezone: "America/Bogota",         // Zona de América/Bogotá (verificar según tu región)
  text: "5 de diciembre de 2026"      // Texto legible
}
```

### Historia (4 hitos)

Cada uno tiene:
- `year`: año del evento (ej: "2020", "2023")
- `title`: título del capítulo
- `text`: anécdota corta y emotiva
- `photo`: ruta de la foto en `/public/photos/` (ver sección "Fotos" abajo)

```ts
story: [
  {
    year: "2020",
    title: "Cómo nos conocimos",
    text: "Describe cómo se conocieron de forma íntima y emotiva...",
    photo: "/photos/story-1.jpg",
  },
  // ... más hitos
]
```

### Eventos (Ceremonia y Recepción)

Cada evento necesita:
- `name`: nombre del lugar
- `address`: dirección completa
- `time`: hora en formato "16:00"
- `mapsUrl`: enlace a Google Maps (copiar desde Maps: Compartir → Copiar enlace)
- `blurb`: descripción poética del evento

```ts
events: [
  {
    kind: "ceremonia",
    name: "Parroquia Nuestra Señora del Rosario",
    address: "Itagüí, Antioquia",
    time: "16:00",
    mapsUrl: "https://www.google.com/maps/search/...",
    blurb: "Empezamos con la Misa, donde nos prometeremos...",
  },
  {
    kind: "recepción",
    name: "Prado Alto Apartamentos, Salón Social",
    address: "Envigado, Antioquia",
    time: "18:30",  // CAMBIAR: confirmar hora real
    mapsUrl: "https://www.google.com/maps/search/...",
    blurb: "Después de la Misa, música y ganas de quedarnos contigo...",
  },
]
```

### Itinerario del día

Asegúrate de que las horas sean realistas y secuencial:

```ts
itinerary: [
  { time: "16:00", label: "Misa", note: "Llega unos minutos antes...", icon: "rings" },
  { time: "17:30", label: "Cóctel", note: "Un brindis para empezar...", icon: "glass" },
  { time: "19:00", label: "Cena", note: "Una mesa pensada para compartir...", icon: "plate" },
  { time: "21:00", label: "Baile", note: "Trae tus mejores pasos...", icon: "dance" },
]
```

### Código de vestimenta

```ts
dressCode: {
  label: "Formal / Etiqueta",
  paletteTitle: "Colores que nos encantaría ver",
  avoidTitle: "Mejor guardemos para la novia",
  palette: ["#8E6FB0", "#B79BD3", "#6B8F71", "#473A52"],  // Códigos hex reales
  avoid: ["blanco", "marfil", "crema"],
  notes: "Queremos verte elegante y cómodo(a). Los lilas, los verdes suaves...",
}
```

### Regalos / Lluvia de sobres

```ts
gifts: {
  mode: "lluvia-de-sobres",  // O "cuenta-bancaria" si aplica
  title: "Tu presencia es nuestro mejor regalo",
  text: "Tenerte ahí ya es más de lo que soñamos...",
  bank: null,  // null = no hay datos bancarios; si hay, objecto con { bank, account, ... }
  revealButton: "Ver datos para el detalle",
  copyButton: "Copiar número",
  // ... más textos
}
```

### Recomendaciones (hospedaje, transporte, clima)

```ts
recommendations: {
  lodging: "Te sugerimos reservar con tiempo en hoteles como Hotel X o Hotel Y. Código descuento: XXXXX",
  transport: "Habrá estacionamiento. Si vas a brindar, coordina conductor o taxi. Ofrecemos transporte de cortesía a las 23:00.",
  adultsOnly: "Será una celebración solo para adultos. Gracias por entender.",
  weather: "A esa hora suele refrescar. Trae un abrigo ligero.",
}
```

### RSVP Deadline

```ts
rsvpDeadline: "15 de noviembre de 2026"  // Cambiar a fecha real
```

### Música de fondo

```ts
music: {
  src: "/audio/cancion.mp3",     // Archivo en /public/audio/
  title: "Nombre de la Canción, Artista",
  startAt: 7,                     // Segundos donde empieza el loop
  label: "Música de fondo",
}
```

### Galería

Enlista las rutas de las fotos (máximo 6–12):

```ts
gallery: [
  "/photos/g-1.jpg",
  "/photos/g-2.jpg",
  // ...
]

galleryAlt: [
  "Un momento juntos, 1",
  "Un momento juntos, 2",
  // ...
]
```

## Paso 3: Subir fotos y audio

### Fotos

Las fotos van en `/public/photos/`. Crea la carpeta si no existe:

```bash
mkdir -p public/photos
```

**Qué subir y nombres esperados:**

| Archivo | Tamaño recomendado | Propósito |
|---------|-------------------|-----------|
| `story-1.jpg` | 1080×1440 (vertical) | Historia 1 |
| `story-2.jpg` | 1080×1440 | Historia 2 |
| `story-3.jpg` | 1080×1440 | Historia 3 |
| `story-4.jpg` | 1080×1440 | Historia 4 |
| `g-1.jpg` a `g-6.jpg` | 800×600 | Galería (mínimo 6) |

**Recomendaciones:**
- Originales sin compresión de WhatsApp (máxima calidad).
- Fotos verticales de la pareja (9:16 idealmente).
- Fotos de la galería: momentos juntos, detalles, paisajes.
- Si la foto se comprime al subirla a `/public`, Next.js la optimize automáticamente con `next/image`.

### Música

La canción va en `/public/audio/`. Debe tener licencia de uso o ser instrumental libre:

```bash
mkdir -p public/audio
# Copiar archivo: cp ~/Descargas/cancion.mp3 public/audio/
```

Actualiza la ruta en `wedding.ts`:

```ts
music: {
  src: "/audio/cancion.mp3",
  title: "Un pacto con Dios, Rabito",
  startAt: 7,  // Ajusta si quieres que empiece en un momento diferente
}
```

## Paso 4: Verificar que todo está completo

```bash
npm run check:content
```

**Si la salida es "No TODOs", ¡está listo!**

```bash
npm run lint && npm run typecheck
```

Asegúrate de que no haya errores.

## Paso 5: Probar localmente

### Sin Docker

```bash
npm run dev
```

Abre [http://localhost:3000/i/demo](http://localhost:3000/i/demo) para ver cómo se ve.

### Con Docker

```bash
docker compose up --build
```

Luego [http://localhost:3000/i/demo](http://localhost:3000/i/demo).

## Paso 6: Cargar lista de invitados

### Por CSV (recomendado)

1. Accede a `/admin/login`.
2. Ve a **Importar invitaciones**.
3. Prepara un CSV con este formato (ver `docs/example-invitations.csv`):

```
nombre_grupo,telefono,etiqueta,invitados
Familia Pérez Martínez,+57 316 123 4567,familia,Andrés Pérez|María José Martínez|Lucas Pérez
Grupo Amigos,+57 350 999 8765,amigos,Daniela Restrepo|Mateo Gómez|Valeria Soto
```

Columnas:
- `nombre_grupo`: identificador del grupo
- `telefono`: WhatsApp del contacto principal (con +57 para Colombia)
- `etiqueta`: `familia`, `amigos`, `trabajo`, etc.
- `invitados`: nombres separados por `|` (barra vertical)

4. Sube el CSV, revisa la vista previa y confirma.
5. El sistema genera un **token único** por grupo e importa los invitados.

### Manual (uno por uno)

1. `/admin` → **Nueva invitación**.
2. Rellena: nombre del grupo, teléfono, etiqueta, cuántos invitados.
3. Crea y edita los nombres de los invitados.
4. Genera token.
5. Envía por WhatsApp desde el admin (abre `wa.me` con el link).

## Paso 7: Enviar invitaciones

### Desde el admin

1. Ve a **Invitaciones**.
2. Selecciona un grupo.
3. Botón **Enviar por WhatsApp** (abre el chat con el link ya prellenado).
4. O copia el enlace y envía manualmente.

El enlace es: `https://tudominio.com/i/TOKEN`

### Verificar que funciona

- Abre el enlace en tu celular.
- Verifica que el nombre del grupo aparezca.
- Completa el RSVP de prueba.
- Vuelve al admin y verifica que la respuesta se haya guardado.

## Solución de problemas

**`npm run check:content` sigue mostrando TODOs**
- Busca en `wedding.ts` todas las líneas con `TODO:` o `TODO`.
- Reemplaza cada una con el valor real.

**Las fotos no se ven en `/i/demo`**
- Verifica que los archivos estén en `/public/photos/` (sin carpetas intermedias).
- Nombre exacto: `story-1.jpg`, `g-1.jpg`, etc.
- Recarga el navegador (Ctrl+Shift+R o Cmd+Shift+R).

**La música no suena**
- Asegúrate de que el archivo esté en `/public/audio/` y la ruta sea correcta en `wedding.ts`.
- Los navegadores bloquean autoplay de audio; el sobre debe abrirse primero.
- Prueba en el modo demo (`/i/demo`) abriendo el sobre.

**El admin no ve las respuestas**
- Verifica que `ADMIN_USERS` esté configurado en `.env`: `correo@ejemplo.com:hash_bcrypt`.
- Genera el hash con: `node scripts/hash-password.mjs 'tu_contraseña'`.
- Logout y vuelve a loguear.

**Invitaciones no se abren**
- Verifica el token en la URL (`/i/TOKEN`).
- Asegúrate de haber importado o creado la invitación en el admin.
- Verifica en la BD que el registro existe: `SELECT * FROM invitations WHERE token = 'TOKEN';`

## Preguntas frecuentes

**¿Puedo cambiar el texto después de enviar la invitación?**
Sí, edita `wedding.ts` y redeploya. El contenido es global; todos ven el mismo (excepto el nombre del grupo y mensaje personal).

**¿Y si me equivoco en el nombre de la pareja?**
Edita `wedding.ts`, cambia `couple.partnerA` y `couple.partnerB`, guarda y redeploya.

**¿Cómo cambio la paleta de colores?**
En `dressCode.palette`, cambia los códigos hex. Usa [https://coolors.co](https://coolors.co) para generar paletas.

**¿Puedo agregar más fotos de historia?**
Sí, añade más objetos al array `story`. Cada uno necesita `year`, `title`, `text` y `photo`.

**¿Es posible tener diferentes mensajes personales para cada grupo?**
No en `wedding.ts` (es global). Pero en la BD cada invitación puede tener `personal_message` distinto, que se renderiza en lugar del genérico.
