import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { csvCell, parseCsv, parseImport, toCsv } from "./csv";

const fixture = readFileSync("docs/example-invitations.csv", "utf8");

describe("parseCsv", () => {
  it("handles quotes, commas and CRLF", () => {
    expect(parseCsv('a,"b,c",d\r\n"x ""y""",,z\r\n')).toEqual([
      ["a", "b,c", "d"],
      ['x "y"', "", "z"],
    ]);
  });
  it("drops blank lines and BOM", () => {
    expect(parseCsv("﻿a,b\n\n\nc,d")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });
});

describe("parseImport", () => {
  it("parses the example file", () => {
    const { fileError, rows } = parseImport(fixture);
    expect(fileError).toBeNull();
    expect(rows).toHaveLength(6);
    expect(rows.every((r) => r.errors.length === 0)).toBe(true);
    expect(rows[0].displayName).toBe("Familia Pérez Martínez");
    expect(rows[0].guests).toHaveLength(5);
    expect(rows[5].guests).toEqual(["Sofía Henríquez", "Acompañante"]);
  });
  it("reports missing columns", () => {
    expect(parseImport("a,b\n1,2").fileError).toMatch(/nombre_grupo/);
  });
  it("reports empty file", () => {
    expect(parseImport("").fileError).toBeTruthy();
  });
  it("reports row errors with line numbers", () => {
    const { rows } = parseImport("nombre_grupo,telefono,etiqueta,invitados\n,abc,,\n");
    expect(rows[0].line).toBe(2);
    expect(rows[0].errors.length).toBeGreaterThanOrEqual(3);
    expect(rows[0].tag).toBe("amigos");
  });
  it("flags in-file duplicates ignoring case and accents", () => {
    const { rows } = parseImport(
      "nombre_grupo,telefono,etiqueta,invitados\nFamilia Pérez,,familia,A\nfamilia perez,,familia,B\n",
    );
    expect(rows.map((r) => r.duplicateInFile)).toEqual([false, true]);
  });
  it("accepts columns in any order", () => {
    const { rows } = parseImport("invitados,nombre_grupo,etiqueta,telefono\nA|B,Grupo,trabajo,\n");
    expect(rows[0]).toMatchObject({ displayName: "Grupo", tag: "trabajo", guests: ["A", "B"], phone: null });
  });
});

describe("csv output", () => {
  it("neutralizes formulas and escapes", () => {
    expect(csvCell("=1+1")).toBe("'=1+1");
    expect(csvCell('a,"b"')).toBe('"a,""b"""');
    expect(toCsv(["h"], [["x"]])).toBe("h\r\nx\r\n");
  });
});
