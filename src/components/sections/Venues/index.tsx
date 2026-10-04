import type { ReactNode } from "react";
import { wedding } from "@/content/wedding";
import { Reveal } from "@/components/motion";
import { mapsHref, wazeHref } from "./links";

const { events, eventsUi } = wedding;

function Arch() {
  return (
    <svg
      viewBox="0 0 200 150"
      className="h-full w-full"
      fill="none"
      stroke="var(--ink-soft)"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M62 138V70a38 38 0 0 1 76 0v68" stroke="var(--accent)" strokeWidth="2" />
      <path d="M72 138V72a28 28 0 0 1 56 0v66" />
      <path d="M44 138h112M20 138h160" stroke="var(--metal-ink)" />
      <path
        d="M62 52c-10 4-16 12-14 22M138 52c10 4 16 12 14 22M66 40c-8-6-8-16-2-20M134 40c8-6 8-16 2-20"
        stroke="var(--metal-ink)"
      />
      <circle cx="46" cy="76" r="2.2" fill="var(--accent-soft)" />
      <circle cx="154" cy="76" r="2.2" fill="var(--accent-soft)" />
    </svg>
  );
}

function Table() {
  return (
    <svg
      viewBox="0 0 200 150"
      className="h-full w-full"
      fill="none"
      stroke="var(--ink-soft)"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M20 96h160" stroke="var(--accent)" strokeWidth="2" />
      <path d="M34 96v34M166 96v34M100 96v34" />
      <path d="M40 40h120" stroke="var(--metal-ink)" />
      {[50, 80, 110, 140, 170].map((x) => (
        <g key={x}>
          <path d={`M${x} 40v14`} stroke="var(--metal-ink)" />
          <circle cx={x} cy="60" r="6" stroke="var(--metal-ink)" />
        </g>
      ))}
      {[48, 100, 152].map((x) => (
        <ellipse key={x} cx={x} cy="88" rx="14" ry="4" />
      ))}
      <path d="M96 84c0-8 8-10 8-18" stroke="var(--accent)" />
    </svg>
  );
}

const linkCls =
  "inline-flex min-h-11 items-center border-b border-accent px-2xs text-base text-accent transition-colors duration-(--dur-quick) ease-out-quart hover:text-ink";
const offCls = "inline-flex min-h-11 items-center px-2xs text-base text-ink-soft opacity-60";

function Dir({ href, children }: { href: string | null; children: ReactNode }) {
  if (!href)
    return (
      <span className={offCls} aria-disabled="true">
        {children}
      </span>
    );
  return (
    <a className={linkCls} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function Venues() {
  return (
    <section className="paper px-gutter py-chapter text-ink">
      <div className="mx-auto flex max-w-[28rem] flex-col gap-2xl">
        {events.map((e, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={e.kind}>
              <article
                className={`flex flex-col gap-m ${flip ? "items-end text-right" : "items-start text-left"}`}
              >
                <div
                  className={`aspect-[4/3] w-[78%] bg-paper-deep p-s shadow-lifted ${flip ? "rotate-[1.5deg]" : "-rotate-[1.5deg]"}`}
                  style={{ borderRadius: "var(--round-s)" }}
                >
                  <div className="h-full w-full border border-line p-xs">
                    {flip ? <Table /> : <Arch />}
                  </div>
                </div>
                <div className="flex max-w-[22rem] flex-col gap-2xs">
                  <p className="text-base capitalize text-metal-ink">
                    {e.kind} <span aria-hidden>·</span> <time>{e.time}</time>
                  </p>
                  <h3 className="display text-2xl text-accent">{e.name}</h3>
                  <p className="text-base">{e.address}</p>
                  <p className="text-base text-ink-soft">{e.blurb}</p>
                  <div
                    role="group"
                    aria-label={eventsUi.directions}
                    className={`mt-xs flex flex-wrap items-center gap-xs ${flip ? "justify-end" : ""}`}
                  >
                    <span className="text-base text-ink-soft">{eventsUi.directions}</span>
                    <Dir href={mapsHref(e.mapsUrl)}>Google Maps</Dir>
                    <Dir href={wazeHref(e.address, e.mapsUrl)}>Waze</Dir>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export default Venues;
