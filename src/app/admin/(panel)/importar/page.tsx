import { ImportTool } from "./ImportTool";

export default function ImportPage() {
  return (
    <div className="flex flex-col gap-m">
      <h1 className="display text-2xl text-ink">Importar y exportar</h1>
      <ImportTool />
    </div>
  );
}
