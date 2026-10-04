"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loginLimiter, verifyAdmin } from "@/lib/auth";
import { getSession } from "@/lib/session";

export type LoginState = { error: string | null };

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/** Use with useActionState. Redirects to /admin on success. */
export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!loginLimiter.check(await clientIp())) {
    return { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." };
  }
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "Escribe tu correo y tu contraseña." };
  }
  const verified = await verifyAdmin(email, password);
  if (!verified) return { error: "Correo o contraseña incorrectos." };
  const session = await getSession();
  session.email = verified;
  await session.save();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
