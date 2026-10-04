"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markSent, regenerateToken, whatsappLinkFor } from "@/app/actions/admin";
import { errorText, fieldClass, primaryBtn, secondaryBtn } from "@/components/admin/ui";

export function SendActions({ id, url: initialUrl, sent }: { id: string; url: string; sent: boolean }) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();

  const say = (text: string, bad = false) => {
    setMsg(text);
    setIsError(bad);
  };

  function sendWhatsApp() {
    // Open the tab inside the tap so mobile browsers do not block it.
    const tab = window.open("", "_blank");
    start(async () => {
      const link = await whatsappLinkFor(id);
      if (!link) {
        tab?.close();
        say("No pudimos preparar el mensaje.", true);
        return;
      }
      setUrl(link.url);
      if (tab) tab.location.href = link.whatsapp;
      else window.location.href = link.whatsapp;
      const res = await markSent(id);
      if (res.ok) {
        say("Marcada como enviada.");
        router.refresh();
      } else say(res.error, true);
    });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      say("Enlace copiado.");
    } catch {
      say("No pudimos copiar. Mantén presionado el enlace para copiarlo.", true);
    }
  }

  function regenerate() {
    start(async () => {
      const res = await regenerateToken(id);
      setConfirming(false);
      if (res.ok) {
        setUrl(res.url);
        say("Enlace nuevo listo. El anterior ya no funciona.");
        router.refresh();
      } else say(res.error, true);
    });
  }

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex flex-col gap-xs sm:flex-row">
        <button type="button" onClick={sendWhatsApp} disabled={pending} className={primaryBtn}>
          {sent ? "Enviar de nuevo por WhatsApp" : "Enviar por WhatsApp"}
        </button>
        <button type="button" onClick={copy} className={secondaryBtn}>
          Copiar enlace
        </button>
      </div>

      <label className="flex flex-col gap-3xs text-xs text-ink-soft">
        Enlace de la invitación
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className={`${fieldClass} text-xs`}
        />
      </label>

      <p role="status" aria-live="polite" className={`min-h-[1.5em] text-xs ${isError ? errorText : "text-ink"}`}>
        {msg}
      </p>

      {confirming ? (
        <div role="group" aria-label="Confirmar nuevo enlace" className="flex flex-col gap-xs rounded-m bg-paper-deep p-xs">
          <p className="text-xs text-ink">
            El enlace actual dejará de funcionar. Tendrás que enviar el nuevo.
          </p>
          <div className="flex gap-xs">
            <button type="button" onClick={regenerate} disabled={pending} className={primaryBtn}>
              Sí, regenerar
            </button>
            <button type="button" onClick={() => setConfirming(false)} className={secondaryBtn}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="min-h-11 self-start px-2xs text-xs text-seal underline underline-offset-4"
        >
          Regenerar enlace
        </button>
      )}
    </div>
  );
}
