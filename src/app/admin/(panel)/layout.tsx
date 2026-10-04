import type { Metadata } from "next";
import { logoutAction } from "@/app/actions/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Panel de invitaciones",
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-table">
      <header className="paper border-b border-line">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-s px-gutter py-2xs">
          <p className="display text-lg text-ink">Panel de invitaciones</p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="min-h-11 rounded-m px-xs text-xs text-ink-soft underline underline-offset-4"
            >
              Salir
            </button>
          </form>
        </div>
        <div className="hidden border-t border-line md:block">
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-gutter pb-28 pt-m md:pb-l">{children}</main>
      <div className="md:hidden">
        <AdminNav />
      </div>
    </div>
  );
}
