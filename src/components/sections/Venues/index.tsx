import Image from "next/image";
import type { ReactNode } from "react";
import { wedding } from "@/content/wedding";
import { Reveal } from "@/components/motion";
import { mapsHref, wazeHref } from "./links";

const { events, eventsUi } = wedding;

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
                  className={`w-[78%] bg-paper-deep p-s shadow-lifted ${flip ? "rotate-[1.5deg]" : "-rotate-[1.5deg]"}`}
                  style={{ borderRadius: "var(--round-s)" }}
                >
                  <Image
                    src={e.photo.src}
                    alt={e.name}
                    width={e.photo.width}
                    height={e.photo.height}
                    sizes="(min-width: 640px) 22rem, 78vw"
                    className="h-auto w-full border border-line"
                  />
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
