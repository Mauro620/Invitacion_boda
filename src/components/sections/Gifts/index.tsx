"use client";

import { useRef, useState } from "react";
import { Reveal } from "@/components/motion";
import { wedding } from "@/content/wedding";

type Bank = { holder?: string; bank?: string; account?: string; number?: string; note?: string };

const g = wedding.gifts;

export function Gifts() {
  const bank = g.bank as Bank | null;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const value = bank ? (bank.number ?? bank.account ?? "") : "";
  const lines = bank
    ? [bank.holder, bank.bank, bank.account ?? bank.number, bank.note].filter(Boolean)
    : [];

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setFailed(false);
    } catch {
      setFailed(true);
      setCopied(false);
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 2400);
  }

  return (
    <section className="paper px-gutter py-chapter">
      <div className="mx-auto flex max-w-(--measure) flex-col items-center gap-m text-center">
        <Reveal as="p" className="text-metal-ink">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <rect x="6" y="11" width="28" height="19" rx="2" />
            <path d="M6 13l14 10 14-10" />
          </svg>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="display text-3xl text-accent">{g.title}</h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-ink-soft">{g.text}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="font-script text-3xl leading-snug text-accent">{g.verse}</p>
        </Reveal>

        {bank && (
          <Reveal delay={0.24} className="flex w-full flex-col items-center gap-s">
            <button
              type="button"
              aria-expanded={open}
              aria-controls="gift-bank"
              onClick={() => setOpen((v) => !v)}
              className="min-h-11 rounded-m border border-line px-m text-accent underline-offset-4 transition-colors duration-(--dur-quick) hover:bg-paper-deep"
            >
              {g.revealButton}
            </button>
            <div
              id="gift-bank"
              hidden={!open}
              className="w-full rounded-m border border-line bg-paper-deep p-m shadow-paper"
            >
              <ul className="flex flex-col gap-2xs text-ink">
                {lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              {value && (
                <button
                  type="button"
                  onClick={copy}
                  className="mt-s min-h-11 rounded-m bg-accent px-m text-paper transition-transform duration-(--dur-quick) ease-out-quart active:scale-[0.97]"
                >
                  {g.copyButton}
                </button>
              )}
              <p role="status" aria-live="polite" className="mt-2xs min-h-6 text-metal-ink">
                {copied ? g.copied : failed ? g.copyFailed : ""}
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
