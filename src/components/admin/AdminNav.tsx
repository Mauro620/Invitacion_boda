"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/invitaciones", label: "Invitaciones" },
  { href: "/admin/mensajes", label: "Mensajes" },
  { href: "/admin/importar", label: "Importar" },
];

export function AdminNav() {
  const pathname = usePathname().replace(/\/$/, "") || "/admin";
  return (
    <nav
      aria-label="Panel"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-paper-deep pb-[env(safe-area-inset-bottom)] md:static md:border-0 md:bg-transparent md:pb-0"
    >
      <ul className="mx-auto flex max-w-3xl md:gap-2xs md:px-gutter">
        {items.map((it) => {
          const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
          return (
            <li key={it.href} className="flex-1 md:flex-none">
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 items-center justify-center px-2xs text-xs md:min-h-11 md:rounded-m md:px-s ${
                  active ? "bg-accent-soft/40 text-ink underline decoration-accent decoration-2 underline-offset-8" : "text-ink-soft"
                }`}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
