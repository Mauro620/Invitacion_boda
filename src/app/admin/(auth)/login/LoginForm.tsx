"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions/auth";

const initial: LoginState = { error: null };

const field =
  "w-full rounded-m border border-line bg-paper px-s py-xs text-base text-ink placeholder:text-ink-soft/70";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="flex flex-col gap-s">
      <label className="flex flex-col gap-3xs text-xs text-ink-soft">
        Correo
        <input
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          required
          className={field}
        />
      </label>
      <label className="flex flex-col gap-3xs text-xs text-ink-soft">
        Contraseña
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={field}
        />
      </label>
      <p role="alert" aria-live="polite" className="min-h-[1.5em] text-xs text-seal">
        {state.error}
      </p>
      <button
        type="submit"
        disabled={pending}
        className="rounded-m bg-accent px-s py-xs text-base text-paper transition-transform duration-150 ease-out-quart active:scale-[0.97] disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
