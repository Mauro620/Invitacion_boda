export const IMPORT_COLUMNS = ["nombre_grupo", "telefono", "etiqueta", "invitados"] as const;

export type ImportRow = {
  /** 1-based line number in the source file (header is line 1). */
  line: number;
  displayName: string;
  phone: string | null;
  tag: string;
  guests: string[];
  errors: string[];
  /** Same group name appeared earlier in the file. */
  duplicateInFile: boolean;
};

export type ParsedImport = { fileError: string | null; rows: ImportRow[] };

/** RFC4180-ish parser: quotes, escaped quotes, commas/newlines inside quotes, CRLF, BOM. */
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += c;
    } else if (c === '"' && cell === "") quoted = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      rows.push(row);
      row = [];
    } else cell += c;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

export const normalizeName = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, " ").trim().toLowerCase();

const MAX_GUESTS = 20;

export function parseImport(text: string): ParsedImport {
  const table = parseCsv(text);
  if (table.length === 0) return { fileError: "El archivo está vacío.", rows: [] };
  const header = table[0].map((h) => h.trim().toLowerCase());
  const idx = IMPORT_COLUMNS.map((c) => header.indexOf(c));
  const missing = IMPORT_COLUMNS.filter((_, i) => idx[i] === -1);
  if (missing.length) {
    return { fileError: `Faltan columnas: ${missing.join(", ")}.`, rows: [] };
  }
  const seen = new Set<string>();
  const rows: ImportRow[] = table.slice(1).map((cols, n) => {
    const get = (i: number) => (cols[idx[i]] ?? "").trim();
    const displayName = get(0);
    const phone = get(1) || null;
    const tag = (get(2) || "amigos").toLowerCase();
    const guests = get(3)
      .split("|")
      .map((g) => g.trim())
      .filter(Boolean);
    const errors: string[] = [];
    if (!displayName) errors.push("Falta el nombre del grupo.");
    if (displayName.length > 120) errors.push("El nombre del grupo es muy largo.");
    if (!guests.length) errors.push("Falta al menos un invitado.");
    if (guests.length > MAX_GUESTS) errors.push(`Máximo ${MAX_GUESTS} invitados por grupo.`);
    if (guests.some((g) => g.length > 120)) errors.push("Un nombre de invitado es muy largo.");
    if (tag.length > 30) errors.push("La etiqueta es muy larga.");
    if (phone && !/^[+\d][\d\s()-]{5,24}$/.test(phone)) errors.push("Teléfono no válido.");
    const key = normalizeName(displayName);
    const duplicateInFile = !!key && seen.has(key);
    if (key) seen.add(key);
    return { line: n + 2, displayName, phone, tag, guests, errors, duplicateInFile };
  });
  return { fileError: null, rows };
}

const FORMULA = /^[=+\-@\t\r]/;

/** Escapes a cell and neutralizes spreadsheet formula injection. */
export function csvCell(value: string | null | undefined): string {
  let v = value ?? "";
  if (FORMULA.test(v)) v = `'${v}`;
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function toCsv(header: string[], rows: (string | null | undefined)[][]): string {
  return [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}
