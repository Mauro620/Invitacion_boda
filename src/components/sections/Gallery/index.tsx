import Image from "next/image";
import { FlowerCorner } from "@/components/ui/Flowers";
import { wedding } from "@/content/wedding";

export function Gallery() {
  const { partnerA, partnerB } = wedding.couple;
  const couple = `${partnerA} y ${partnerB}`;
  const photos = wedding.gallery;
  return (
    <section className="paper relative flex min-h-[844px] items-center overflow-hidden py-xl">
      <FlowerCorner position="tl" className="top-0 left-0 w-24" />
      <FlowerCorner position="br" className="right-0 bottom-0 w-24" delay={0.3} />
      <div
        role="region"
        aria-label={couple}
        tabIndex={0}
        className="flex w-full snap-x snap-mandatory gap-s overflow-x-auto scroll-px-gutter px-gutter pb-s [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((src, i) => (
          <figure
            key={src}
            className="w-[78%] max-w-sm shrink-0 snap-center overflow-hidden rounded-l shadow-lifted"
          >
            <Image
              src={src}
              alt={wedding.galleryAlt[i] ?? couple}
              width={640}
              height={800}
              loading="lazy"
              sizes="(min-width: 640px) 24rem, 78vw"
              className="aspect-[4/5] w-full object-cover"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
