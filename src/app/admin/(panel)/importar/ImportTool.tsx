"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { exportCateringCsv, importCsvCommit, importCsvPreview } from "@/app/actions/admin";
import type { ImportCommitResult, ImportPreview } from "@/app/actions/admin.types";
import { errorText, labelClass, fieldClass, primaryBtn, secondaryBtn } from "@/components/admin/ui";

const EXAMPLE = [
  "nombre_grupo,telefono,etiqueta,invitados",
  "Familia Pérez Gómez,+57 300 111 2233,familia,Ana Pérez|Luis Gómez|Sofía Gómez",
  "Camila Rojas,,amigos,Camila Rojas|Andrés Mora",
  "",
].join("\n");

function download(name: string, text: string) {
  const blob = new Blob(["﻿", text], { type: "text/csv;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  a.click();
  URL.revokeObjectURL(href);
}

export function ImportTool() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [result, setResult] = useState<ImportCommitResult | null>(null);
  const [exportMsg, setExportMsg] = useState("");
  const [pending, start] = useTransition();

  const reset = () => {
    setPreview(null);
    setResult(null);
  };

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setText(await f.text());
    reset();
  }

  const runPreview = () =>
    start(async () => {
      setResult(null);
      setPreview(await importCsvPreview(text));
    });

  const commit = () =>
    start(async () => {
      const res = await importCsvCommit(text);
      setResult(res);
      if (res.ok) {
        setPreview(null);
        setText("");
        if (fileRef.current) fileRef.current.value = "";
        router.refresh();
      }
    });

  const exportCsv = () =>
    start(async () => {
      try {
        const csv = await exportCateringCsv();
        download("catering.csv", csv);
        setExportMsg("Archivo descargado.");
      } catch {
        setExportMsg("No pudimos generar el archivo.");
      }
    });

  return (
    <div className="flex flex-col gap-l">
      <section aria-labelledby="subir" className="flex flex-col gap-s">
        <h2 id="subir" className="display text-lg text-ink">
          Cargar la lista
        </h2>
        <p className="text-xs text-ink-soft">
          Columnas: nombre_grupo, telefono, etiqueta, invitados. Separa los invitados de un grupo con
          el signo |.
        </p>
        <button
          type="button"
          onClick={() => download("ejemplo-invitaciones.csv", EXAMPLE)}
          className="min-h-11 self-start text-xs text-accent underline underline-offset-4"
        >
          Descargar archivo de ejemplo
        </button>

        <label className={labelClass}>
          Subir archivo CSV
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={onFile} className={`${fieldClass} text-xs`} />
        </label>
        <label className={labelClass}>
          O pega el contenido aquí
          <textarea
            rows={6}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              reset();
            }}
            spellCheck={false}
            className={`${fieldClass} font-mono text-xs`}
          />
        </label>
        <button type="button" onClick={runPreview} disabled={pending || !text.trim()} className={secondaryBtn}>
          {pending && !preview ? "Revisando..." : "Ver vista previa"}
        </button>
      </section>

      <div aria-live="polite" className="flex flex-col gap-s">
        {preview?.fileError ? <p className={errorText}>{preview.fileError}</p> : null}

        {preview && !preview.fileError ? (
          <section aria-labelledby="previa" className="flex flex-col gap-xs">
            <h2 id="previa" className="display text-lg text-ink">
              Vista previa
            </h2>
            <p className="text-ink-soft">
              Se crearán {preview.importCount}. Con errores: {preview.errorCount}. Repetidas: {preview.duplicateCount}.
            </p>
            <div className="overflow-x-auto rounded-l bg-paper">
              <table className="w-full min-w-[34rem] text-left text-xs">
                <caption className="sr-only">Filas del archivo</caption>
                <thead className="text-ink-soft">
                  <tr>
                    <th scope="col" className="px-xs py-2xs font-normal">Línea</th>
                    <th scope="col" className="px-xs py-2xs font-normal">Grupo</th>
                    <th scope="col" className="px-xs py-2xs font-normal">Etiqueta</th>
                    <th scope="col" className="px-xs py-2xs font-normal">Invitados</th>
                    <th scope="col" className="px-xs py-2xs font-normal">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-ink">
                  {preview.rows.map((r) => (
                    <tr key={r.line} className="align-top">
                      <td className="px-xs py-2xs">{r.line}</td>
                      <td className="px-xs py-2xs">{r.displayName || "(sin nombre)"}</td>
                      <td className="px-xs py-2xs">{r.tag}</td>
                      <td className="px-xs py-2xs">{r.guests.join(", ")}</td>
                      <td className="px-xs py-2xs">
                        {r.errors.length > 0 ? (
                          <ul className="text-seal">
                            {r.errors.map((er) => (
                              <li key={er}>{er}</li>
                            ))}
                          </ul>
                        ) : r.duplicate ? (
                          <span className="text-ink-soft">Repetida, se omite</span>
                        ) : (
                          <span>Se crea</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={commit} disabled={pending || preview.importCount === 0} className={primaryBtn}>
              {pending ? "Importando..." : `Importar ${preview.importCount} ${preview.importCount === 1 ? "invitación" : "invitaciones"}`}
            </button>
            {preview.importCount === 0 ? (
              <p className="text-xs text-ink-soft">No hay filas válidas para importar.</p>
            ) : null}
          </section>
        ) : null}

        {result ? (
          result.ok ? (
            <p className="rounded-m bg-accent-soft/30 p-xs text-ink">
              Listo: se crearon {result.created} y se omitieron {result.skipped}.
            </p>
          ) : (
            <p className={errorText}>{result.error}</p>
          )
        ) : null}
      </div>

      <section aria-labelledby="exportar" className="flex flex-col gap-xs">
        <h2 id="exportar" className="display text-lg text-ink">
          Lista para catering
        </h2>
        <p className="text-xs text-ink-soft">Solo quienes confirmaron, con sus restricciones alimentarias.</p>
        <button type="button" onClick={exportCsv} disabled={pending} className={`${secondaryBtn} self-start`}>
          Exportar CSV para catering
        </button>
        <p role="status" className="min-h-[1.5em] text-xs text-ink-soft">
          {exportMsg}
        </p>
      </section>
    </div>
  );
}
