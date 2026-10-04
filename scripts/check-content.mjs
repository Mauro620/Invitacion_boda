import { readFileSync } from "node:fs";

const file = "src/content/wedding.ts";
const hits = readFileSync(file, "utf8")
  .split("\n")
  .flatMap((l, i) => (l.includes("TODO") ? [`${file}:${i + 1}: ${l.trim()}`] : []));

console.log(hits.length ? hits.join("\n") : "No TODOs.");
console.log(`${hits.length} TODO line(s) pending.`);
// ponytail: always exits 0 for now; make it exit 1 in Phase 7.
