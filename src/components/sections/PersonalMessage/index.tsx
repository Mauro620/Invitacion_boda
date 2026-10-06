import { Reveal } from "@/components/motion";
import { FlowerCorner } from "@/components/ui/Flowers";
import { wedding } from "@/content/wedding";

type Props = { guestName: string; message?: string | null };

export function PersonalMessage({ guestName, message }: Props) {
  const { greeting, fallback, signature } = wedding.personalMessage;
  const { partnerA, partnerB } = wedding.couple;
  const body = message?.trim() ? message : fallback;
  return (
    <section className="flex items-center justify-center bg-tint px-gutter py-xl">
      <Reveal className="w-full max-w-md -rotate-1">
        <article className="paper relative rounded-s px-l py-xl shadow-lifted">
          <FlowerCorner position="tr" className="-top-4 -right-3 w-24" delay={0.3} />
          <p className="font-script text-3xl text-accent">{greeting}</p>
          <h2 className="display mt-3xs text-3xl text-ink">{guestName}</h2>
          <p className="mt-m font-script text-2xl leading-normal text-ink whitespace-pre-line">
            {body}
          </p>
          <p className="mt-l text-right font-script text-2xl text-ink-soft">{signature}</p>
          <p className="text-right font-script text-3xl text-accent">
            {partnerA} y {partnerB}
          </p>
        </article>
      </Reveal>
    </section>
  );
}
