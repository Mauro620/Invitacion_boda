import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { generateToken } from "@/lib/tokens";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/invitacion_boda",
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data (cascade deletes via FK constraints)
    await db.delete(schema.invitations);
    console.log("✓ Cleared existing invitations");

    // 10 demo invitations with varied scenarios
    const invitations = [
      {
        displayName: "Familia Pérez Martínez",
        maxGuests: 5,
        phone: "+57 316 123 4567",
        tag: "familia",
        personalMessage: "Querida familia, su presencia en este día especial significa el mundo para nosotros.",
        guests: ["Andrés Pérez", "María José Martínez", "Lucas Pérez", "Sofía Pérez", "Julio Pérez"],
        attending: true,
      },
      {
        displayName: "Juan Carlos López",
        maxGuests: 1,
        phone: "+57 301 234 5678",
        tag: "trabajo",
        personalMessage: null,
        guests: ["Juan Carlos López"],
        attending: null,
      },
      {
        displayName: "Familia García Ruiz",
        maxGuests: 3,
        phone: null,
        tag: "familia",
        personalMessage: "Con cariño para quienes crecieron con nosotros.",
        guests: ["Carmen García", "Roberto Ruiz", "Isabel García Ruiz"],
        attending: false,
      },
      {
        displayName: "Grupo Amigos de la Universidad",
        maxGuests: 6,
        phone: "+57 350 999 8765",
        tag: "amigos",
        personalMessage: null,
        guests: ["Daniela Restrepo", "Mateo Gómez", "Valeria Soto", "Diego Herrera", "Catalina Monsalve", "Felipe Ríos"],
        attending: true,
      },
      {
        displayName: "Sofía Henríquez + 1",
        maxGuests: 2,
        phone: "+57 321 555 4321",
        tag: "amigos",
        personalMessage: "Tu amistad nos ha acompañado en todos nuestros momentos importantes.",
        guests: ["Sofía Henríquez", "Acompañante"],
        attending: null,
      },
      {
        displayName: "Familia López Martín",
        maxGuests: 4,
        phone: "+57 312 876 5432",
        tag: "familia",
        personalMessage: null,
        guests: ["Víctor López", "Guadalupe Martín", "Ángeles López", "Alejandro López Martín"],
        attending: null,
      },
      {
        displayName: "Equipo del Trabajo",
        maxGuests: 4,
        phone: "+57 345 123 6789",
        tag: "trabajo",
        personalMessage: "Con gratitud por su apoyo constante durante estos años.",
        guests: ["Patricia Acosta", "Ramón Silva", "Gabriela Núñez", "Arturo Blanco"],
        attending: false,
      },
      {
        displayName: "Miguel Ángel Rojas",
        maxGuests: 1,
        phone: null,
        tag: "amigos",
        personalMessage: null,
        guests: ["Miguel Ángel Rojas"],
        attending: null,
      },
      {
        displayName: "Familia Espinoza Jiménez",
        maxGuests: 5,
        phone: "+57 318 777 2222",
        tag: "familia",
        personalMessage: "Celebramos con ustedes este nuevo capítulo lleno de esperanza.",
        guests: ["Enrique Espinoza", "Rosa Jiménez", "Enrique Espinoza Jr.", "Lilia Espinoza", "Marco Espinoza"],
        attending: true,
      },
      {
        displayName: "Francisca Alarcón + 1",
        maxGuests: 2,
        phone: "+57 331 444 5555",
        tag: "amigos",
        personalMessage: null,
        guests: ["Francisca Alarcón", "Acompañante"],
        attending: null,
      },
    ];

    for (const invData of invitations) {
      const token = generateToken();
      const invId = crypto.randomUUID();

      // Insert invitation
      await db.insert(schema.invitations).values({
        id: invId,
        token,
        displayName: invData.displayName,
        maxGuests: invData.maxGuests,
        phone: invData.phone,
        tag: invData.tag,
        personalMessage: invData.personalMessage,
        sentAt: new Date(),
        respondedAt: invData.attending !== null ? new Date() : null,
        openCount: invData.attending !== null ? Math.floor(Math.random() * 3) + 1 : 0,
        firstOpenedAt: invData.attending !== null ? new Date(Date.now() - 86400000 * Math.random()) : null,
        lastOpenedAt: invData.attending !== null ? new Date(Date.now() - 3600000 * Math.random()) : null,
      });

      // Insert guests
      for (let i = 0; i < invData.guests.length; i++) {
        const guestName = invData.guests[i];
        const isPlusOne = guestName.toLowerCase() === "acompañante";

        await db.insert(schema.guests).values({
          id: crypto.randomUUID(),
          invitationId: invId,
          name: guestName,
          isPlusOne,
          attending: invData.attending,
          dietaryNotes: i === 0 && Math.random() > 0.7 ? "Sin gluten" : null,
        });
      }

      console.log(`✓ Created invitation: ${invData.displayName} (token: ${token})`);
    }

    console.log("\n✅ Seed completed successfully");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
