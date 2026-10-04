/** Shared class strings for admin controls. Targets are at least 44px tall. */
export const fieldClass =
  "min-h-11 w-full rounded-m border border-line bg-paper px-s py-xs text-base text-ink placeholder:text-ink-soft/70";

export const labelClass = "flex flex-col gap-3xs text-xs text-ink-soft";

export const primaryBtn =
  "inline-flex min-h-11 items-center justify-center rounded-m bg-accent px-s py-xs text-base text-paper transition-transform duration-(--dur-quick) ease-out-quart active:scale-[0.97] disabled:opacity-60 motion-reduce:transition-none motion-reduce:active:scale-100";

export const secondaryBtn =
  "inline-flex min-h-11 items-center justify-center rounded-m border border-line bg-paper px-s py-xs text-base text-ink transition-transform duration-(--dur-quick) ease-out-quart active:scale-[0.97] disabled:opacity-60 motion-reduce:transition-none motion-reduce:active:scale-100";

export const errorText = "text-xs text-seal";

export const dateFmt = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

export function formatWhen(iso: string | null): string {
  return iso ? dateFmt.format(new Date(iso)) : "";
}
