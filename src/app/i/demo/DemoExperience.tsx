"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";
import { ChapterProgress, MusicButton, RsvpFab } from "@/components/sections/Controls";
import { Envelope } from "@/components/sections/Envelope";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Story } from "@/components/sections/Story";
import { PersonalMessage } from "@/components/sections/PersonalMessage";
import { DateTime } from "@/components/sections/DateTime";
import { Venues } from "@/components/sections/Venues";
import { Itinerary } from "@/components/sections/Itinerary";
import { DressCode } from "@/components/sections/DressCode";
import { Gallery } from "@/components/sections/Gallery";
import { Gifts } from "@/components/sections/Gifts";
import { Recommendations } from "@/components/sections/Recommendations";
import { Rsvp } from "@/components/sections/Rsvp";
import { Closing } from "@/components/sections/Closing";

const MOCK_GUESTS = [
  { id: "g1", name: "Carlos Pérez", attending: null },
  { id: "g2", name: "Marta Pérez", attending: null },
  { id: "g3", name: "Sofía Pérez", attending: null },
];

type Submit = React.ComponentProps<typeof Rsvp>["onSubmit"];

export function DemoExperience({ guestName }: { guestName: string }) {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [passedDate, setPassedDate] = useState(false);
  const [rsvpInView, setRsvpInView] = useState(false);
  const [attending, setAttending] = useState<boolean | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const rsvpRef = useRef<HTMLDivElement>(null);

  const startMusic = useCallback(() => {
    try {
      const a = (audio.current ??= new Audio(wedding.music.src));
      a.loop = true;
      a.volume = 0.6;
      a.onerror = () => setPlaying(false);
      setPlaying(true);
      a.play().catch(() => setPlaying(false)); // missing file or blocked: stay silent
    } catch {
      setPlaying(false);
    }
  }, []);

  const toggleMusic = useCallback(() => {
    const a = audio.current;
    if (!a) return startMusic();
    if (a.paused) {
      setPlaying(true);
      a.play().catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
    }
  }, [startMusic]);

  useEffect(() => () => audio.current?.pause(), []);

  useEffect(() => {
    if (!opened) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    const date = dateRef.current;
    const rsvp = rsvpRef.current;
    if (!date || !rsvp) return;
    const d = new IntersectionObserver(([e]) =>
      setPassedDate(!e.isIntersecting && e.boundingClientRect.top < 0),
    );
    const r = new IntersectionObserver(([e]) => setRsvpInView(e.isIntersecting));
    d.observe(date);
    r.observe(rsvp);
    return () => {
      d.disconnect();
      r.disconnect();
    };
  }, [opened]);

  const onSubmit: Submit = useCallback(async (payload) => {
    await new Promise((r) => setTimeout(r, 600));
    setAttending(payload.guests.some((g) => g.attending));
    return { ok: true };
  }, []);

  return (
    <div className="min-h-dvh bg-table sm:py-l">
      <main className="relative mx-auto max-w-[30rem] overflow-x-clip bg-paper sm:shadow-letter">
        <Envelope
          guestName={guestName}
          onOpen={() => {
            setOpened(true);
            startMusic();
          }}
        />
        {opened && (
          <>
            <ChapterProgress progress={progress} />
            <MusicButton playing={playing} onToggle={toggleMusic} />
            <Hero guestName={guestName} />
            <Intro />
            <Story />
            <PersonalMessage guestName={guestName} />
            <div ref={dateRef}>
              <DateTime />
            </div>
            <Venues />
            <Itinerary />
            <DressCode />
            <Gallery />
            <Gifts />
            <Recommendations />
            <div id="rsvp" ref={rsvpRef}>
              <Rsvp
                guestName={guestName}
                guests={MOCK_GUESTS}
                deadline={wedding.rsvpDeadline}
                onSubmit={onSubmit}
              />
            </div>
            <Closing attending={attending} guestName={guestName} />
            <RsvpFab visible={passedDate && !rsvpInView} href="#rsvp" />
          </>
        )}
      </main>
    </div>
  );
}
