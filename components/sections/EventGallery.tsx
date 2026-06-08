"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface GalleryItem {
  src: string;
  translationKey: string;
}

export function EventGallery() {
  const t = useTranslations("eventsPage");

  const row1Items: GalleryItem[] = [
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 5.51.35 PM (1).jpeg", translationKey: "img1" },
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 5.51.35 PM (2).jpeg", translationKey: "img2" },
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 5.51.35 PM (3).jpeg", translationKey: "img3" },
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 5.51.35 PM.jpeg", translationKey: "img4" },
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 6.32.40 PM.jpeg", translationKey: "img5" },
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 6.32.41 PM (1).jpeg", translationKey: "img6" },
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 6.32.41 PM.jpeg", translationKey: "img7" },
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 6.32.42 PM (1).jpeg", translationKey: "img8" },
  ];

  const row2Items: GalleryItem[] = [
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 6.32.42 PM.jpeg", translationKey: "img9" },
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 6.32.43 PM.jpeg", translationKey: "img10" },
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 6.32.44 PM (1).jpeg", translationKey: "img11" },
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 6.32.44 PM (2).jpeg", translationKey: "img12" },
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 6.32.44 PM.jpeg", translationKey: "img13" },
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 6.32.45 PM (1).jpeg", translationKey: "img14" },
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 6.32.45 PM (2).jpeg", translationKey: "img15" },
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 6.32.45 PM (3).jpeg", translationKey: "img16" },
    { src: "/event-gallery/WhatsApp Image 2026-03-20 at 6.32.45 PM.jpeg", translationKey: "img17" },
  ];

  // Double the items for a seamless infinite scroll loop
  const doubleRow1 = [...row1Items, ...row1Items];
  const doubleRow2 = [...row2Items, ...row2Items];

  const renderCard = (item: GalleryItem, idx: number) => {
    return (
      <div
        key={`${item.translationKey}-${idx}`}
        className="group relative flex-shrink-0 w-[280px] sm:w-[360px] h-[180px] sm:h-[230px] rounded-2xl overflow-hidden border border-border bg-card shadow-jibb hover:shadow-jibb-lg hover:-translate-y-1 transition-all duration-300 ease-out"
      >
        <Image
          src={item.src}
          alt={t(`gallery.${item.translationKey}.title`)}
          fill
          sizes="(max-width: 640px) 280px, 360px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Dark overlay that matches JIBB premium theme styling */}
        <div className="absolute inset-0 bg-gradient-to-t from-jibb-indigo-dark/90 via-jibb-indigo-dark/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left pointer-events-none">
          <span className="text-jibb-orange text-xs font-black tracking-widest uppercase mb-1">
            {t(`gallery.${item.translationKey}.title`)}
          </span>
          <p className="text-white text-xs sm:text-sm font-medium leading-snug">
            {t(`gallery.${item.translationKey}.desc`)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 md:py-24 border-t border-border/45 bg-jibb-gradient-subtle overflow-hidden relative">
      <div className="section-container max-w-6xl text-center mb-10 space-y-3">
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          {t("gallery.title")}
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          {t("gallery.subtitle")}
        </p>
      </div>

      <div className="space-y-6 w-full relative">
        {/* Row 1: Left-scrolling marquee */}
        <div className="flex w-full overflow-hidden select-none mask-gradient pointer-events-auto">
          <div className="flex gap-6 animate-marquee-left hover:[animation-play-state:paused] pr-6">
            {doubleRow1.map((item, idx) => renderCard(item, idx))}
          </div>
        </div>

        {/* Row 2: Right-scrolling marquee */}
        <div className="flex w-full overflow-hidden select-none mask-gradient pointer-events-auto">
          <div className="flex gap-6 animate-marquee-right hover:[animation-play-state:paused] pr-6">
            {doubleRow2.map((item, idx) => renderCard(item, idx))}
          </div>
        </div>
      </div>

      {/* Tailwind masks custom fade effect at the ends */}
      <style jsx global>{`
        .mask-gradient {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }
      `}</style>
    </section>
  );
}
