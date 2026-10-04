import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Acceso | Panel",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="paper flex min-h-dvh items-center justify-center px-gutter py-l">
      <div className="w-full max-w-sm rounded-l bg-paper-deep p-m shadow-paper">
        <h1 className="display text-2xl text-ink">Panel de invitaciones</h1>
        <p className="mb-m mt-2xs text-xs text-ink-soft">Ingresa para ver las respuestas.</p>
        <LoginForm />
      </div>
    </main>
  );
}
