"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";
import { formatDeadline, isRsvpOpen } from "@/lib/deadline";
import { ChapterProgress, MusicButton, RsvpFab } from "@/components/sections/Controls";
import { Envelope } from "@/components/sections/Envelope";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
// import { Story } from "@/components/sections/Story";
import { PersonalMessage } from "@/components/sections/PersonalMessage";
import { DateTime } from "@/components/sections/DateTime";
import { Venues } from "@/components/sections/Venues";
// import { Itinerary } from "@/components/sections/Itinerary";
import { DressCode } from "@/components/sections/DressCode";
import { Gallery } from "@/components/sections/Gallery";
import { Gifts } from "@/components/sections/Gifts";
// import { Recommendations } from "@/components/sections/Recommendations";
import { Rsvp } from "@/components/sections/Rsvp";
import { Closing } from "@/components/sections/Closing";

export type ExperienceGuest = {
  id: string;
  name: string;
  attending: boolean | null;
  dietaryNotes?: string;
};
type RsvpProps = React.ComponentProps<typeof Rsvp>;
export type RsvpPayload = Parameters<RsvpProps["onSubmit"]>[0];
export type RsvpResult = Awaited<ReturnType<RsvpProps["onSubmit"]>>;

type Props = {
  guestName: string;
  personalMessage?: string | null;
  guests: ExperienceGuest[];
  respondedAt?: string | null;
  noteToCouple?: string | null;
  onSubmitRsvp: (payload: RsvpPayload) => Promise<RsvpResult>;
};

const initialAttending = (guests: ExperienceGuest[], respondedAt?: string | null) =>
  respondedAt || guests.every((g) => g.attending !== null) ? guests.some((g) => g.attending) : null;

export function InvitationExperience({
  guestName,
  personalMessage,
  guests,
  respondedAt,
  noteToCouple,
  onSubmitRsvp,
}: Props) {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [passedDate, setPassedDate] = useState(false);
  const [rsvpInView, setRsvpInView] = useState(false);
  const [attending, setAttending] = useState<boolean | null>(() =>
    guests.length ? initialAttending(guests, respondedAt) : null,
  );
  const audio = useRef<HTMLAudioElement | null>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const rsvpRef = useRef<HTMLDivElement>(null);

  const startMusic = useCallback(() => {
    try {
      const a = (audio.current ??= new Audio(wedding.music.src));
      const { startAt } = wedding.music;
      a.currentTime = startAt; // browsers clamp/queue this until metadata loads
      a.onended = () => {
        a.currentTime = startAt; // loop back to the start point, not 0:00
        a.play().catch(() => setPlaying(false));
      };
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

  const onSubmit = useCallback(
    async (payload: RsvpPayload) => {
      const res = await onSubmitRsvp(payload);
      if (res.ok) setAttending(payload.guests.some((g) => g.attending));
      return res;
    },
    [onSubmitRsvp],
  );

  const deadlineLabel = formatDeadline(wedding.rsvpDeadline);
  const rsvpOpen = isRsvpOpen(wedding.rsvpDeadline);

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
            {/* <Story /> */}
            <PersonalMessage guestName={guestName} message={personalMessage} />
            <div ref={dateRef}>
              <DateTime />
            </div>
            <Venues />
            {/* <Itinerary /> */}
            <DressCode />
            <Gallery />
            <Gifts />
            {/* <Recommendations /> */}
            <div id="rsvp" ref={rsvpRef}>
              <Rsvp
                guestName={guestName}
                guests={guests}
                deadline={deadlineLabel}
                open={rsvpOpen}
                responded={!!respondedAt}
                noteToCouple={noteToCouple ?? ""}
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
