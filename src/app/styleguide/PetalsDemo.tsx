"use client";

import { useState } from "react";
import { Petals } from "@/components/motion";

export function PetalsDemo() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-col gap-xs">
      <button
        type="button"
        aria-pressed={on}
        onClick={() => setOn((v) => !v)}
        className="min-h-11 self-start rounded-s border border-line bg-paper-deep px-s text-ink transition-colors duration-(--dur-quick) aria-pressed:bg-accent aria-pressed:text-paper"
      >
        Petals: {on ? "on" : "off"}
      </button>
      <div className="relative h-40 overflow-hidden rounded-m border border-line bg-paper-deep">
        {on && <Petals />}
      </div>
    </div>
  );
}
