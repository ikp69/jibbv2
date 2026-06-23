"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useLocale } from "next-intl";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.33, 1, 0.68, 1] as const } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

export default function PastEventsCollage() {
  const locale = useLocale();

  const fontHeading = locale === "ja"
    ? { fontFamily: "var(--font-noto-sans-jp)" }
    : { fontFamily: "var(--font-heading)" };

  const fontSans = locale === "ja"
    ? { fontFamily: "var(--font-noto-sans-jp)" }
    : { fontFamily: "var(--font-sans)" };

  const l = {
    en: {
      collageTitle: "Highlights from Past Events",
      collageSubtitle: "Moments from our Japan–India business seminars and exhibitions.",
      viewMore: "View Full Gallery",
      viewLess: "Show Less",
    },
    ja: {
      collageTitle: "過去のイベント ハイライト",
      collageSubtitle: "日印ビジネスセミナー・展示会の記録。",
      viewMore: "ギャラリー全体を見る",
      viewLess: "閉じる",
    }
  }[locale as "en" | "ja"] || {
    collageTitle: "Highlights from Past Events",
    collageSubtitle: "Moments from our Japan–India business seminars and exhibitions.",
    viewMore: "View Full Gallery",
    viewLess: "Show Less",
  };

  // State for gallery lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // State for active gallery selection
  const galleryKeys = ["semicon-2025", "semicon-2026", "acma", "electronica", "embassy-meet"] as const;
  const [activeGalleryId, setActiveGalleryId] = useState<typeof galleryKeys[number]>("semicon-2025");

  const galleries = useMemo(() => ({
    "semicon-2025": {
      name: { en: "SEMICON 2025", ja: "SEMICON 2025" },
      images: [
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 5.51.35 PM.jpeg", alt: locale === "ja" ? "イベント会場 of 2025" : "Event venue of 2025 atmosphere" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 5.51.35 PM (1).jpeg", alt: locale === "ja" ? "セミナー会場" : "Seminar hall" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 5.51.35 PM (2).jpeg", alt: locale === "ja" ? "参加者の様子" : "Event participants" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 5.51.35 PM (3).jpeg", alt: locale === "ja" ? "プレゼンテーション" : "Presentation" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.40 PM.jpeg", alt: locale === "ja" ? "ネットワーキングセッション" : "Networking session" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.41 PM (1).jpeg", alt: locale === "ja" ? "講演の様子" : "Speaking session" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.41 PM.jpeg", alt: locale === "ja" ? "セミナー講演の様子" : "Seminar presentation" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.42 PM (1).jpeg", alt: locale === "ja" ? "参加者との交流" : "Participant interaction" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.42 PM.jpeg", alt: locale === "ja" ? "参加者のネットワーキング" : "Attendee networking" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.43 PM.jpeg", alt: locale === "ja" ? "パネルディスカッション" : "Panel discussion" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.44 PM.jpeg", alt: locale === "ja" ? "展示ブース" : "Exhibition booth" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.44 PM (1).jpeg", alt: locale === "ja" ? "イベント展示" : "Event exhibition" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.44 PM (2).jpeg", alt: locale === "ja" ? "参加企業ブース" : "Company booth" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.45 PM.jpeg", alt: locale === "ja" ? "イベント懇親会" : "Event reception" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.45 PM (1).jpeg", alt: locale === "ja" ? "懇親会の様子" : "Reception gathering" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.45 PM (2).jpeg", alt: locale === "ja" ? "ネットワーキングパーティー" : "Networking party" },
        { src: "/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.45 PM (3).jpeg", alt: locale === "ja" ? "参加者の交流会" : "Participant meetup" }
      ]
    },
    "semicon-2026": {
      name: { en: "SEMICON Briefing 2026", ja: "SEMICON Briefing 2026" },
      images: [
        { src: "/events/event-gallery/SEMICON Briefing 2026/WhatsApp Image 2026-06-05 at 5.32.54 PM.jpeg", alt: locale === "ja" ? "SEMICON 2026 会場の様子" : "SEMICON 2026 Event venue" },
        { src: "/events/event-gallery/SEMICON Briefing 2026/WhatsApp Image 2026-06-05 at 5.32.55 PM.jpeg", alt: locale === "ja" ? "ブース打合せ" : "Booth meeting" },
        { src: "/events/event-gallery/SEMICON Briefing 2026/WhatsApp Image 2026-06-05 at 5.32.56 PM.jpeg", alt: locale === "ja" ? "日印ビジネス対話" : "Japan-India business dialogue" },
        { src: "/events/event-gallery/SEMICON Briefing 2026/WhatsApp Image 2026-06-05 at 5.32.56 PM (1).jpeg", alt: locale === "ja" ? "展示ブースの展示品" : "Exhibits at the exhibition booth" }
      ]
    },
    "acma": {
      name: { en: "Bharat Mobility Briefing 2027", ja: "Bharat Mobility Briefing 2027" },
      images: [
        { src: "/events/event-gallery/Bharat Mobility Briefing 2027/1778741011392.jpg", alt: locale === "ja" ? "ACMA セミナー" : "ACMA Seminar" },
        { src: "/events/event-gallery/Bharat Mobility Briefing 2027/1778741011411.jpg", alt: locale === "ja" ? "ACMA ネットワーキング" : "ACMA Networking" }
      ]
    },
    "electronica": {
      name: { en: "ELECTRONICA 2026", ja: "ELECTRONICA 2026" },
      images: [
        { src: "/events/event-gallery/ELECTRONICA 2026/DSC_8760.jpg", alt: locale === "ja" ? "ELECTRONICA 2026 展示会" : "ELECTRONICA 2026 Exhibition" },
        { src: "/events/event-gallery/ELECTRONICA 2026/DSC_8770.jpg", alt: locale === "ja" ? "ブース交流" : "Booth interaction" },
        { src: "/events/event-gallery/ELECTRONICA 2026/DSC_8961.jpg", alt: locale === "ja" ? "出展社ブース" : "Exhibitor booth" },
        { src: "/events/event-gallery/ELECTRONICA 2026/DSC_8974.jpg", alt: locale === "ja" ? "商談の様子" : "Business meeting" },
        { src: "/events/event-gallery/ELECTRONICA 2026/DSC_9032.jpg", alt: locale === "ja" ? "イベント来場者" : "Event attendees" },
        { src: "/events/event-gallery/ELECTRONICA 2026/DSC_9033.jpg", alt: locale === "ja" ? "対話セッション" : "Dialogue session" },
        { src: "/events/event-gallery/ELECTRONICA 2026/DSC_9044.jpg", alt: locale === "ja" ? "ネットワーキング" : "Networking" }
      ]
    },
    "embassy-meet": {
      name: { en: "Japan Embassy Meet", ja: "在日大使館での会合" },
      images: [
        { src: "/events/event-gallery/Japan Embassy Meet/WhatsApp Image 2026-03-20 at 5.51.35 PM.jpeg", alt: locale === "ja" ? "在日大使館での会合" : "Japan Embassy Meet" },
        { src: "/events/event-gallery/Japan Embassy Meet/WhatsApp Image 2026-03-20 at 5.51.35 PM (1).jpeg", alt: locale === "ja" ? "会合の様子" : "Embassy Meet discussion" },
        { src: "/events/event-gallery/Japan Embassy Meet/WhatsApp Image 2026-03-20 at 5.51.35 PM (2).jpeg", alt: locale === "ja" ? "日印代表者" : "Japan-India representatives" },
        { src: "/events/event-gallery/Japan Embassy Meet/WhatsApp Image 2026-03-20 at 5.51.35 PM (3).jpeg", alt: locale === "ja" ? "大使館でのネットワーキング" : "Networking at the Embassy" }
      ]
    }
  }), [locale]);

  const activeGallery = useMemo(() => galleries[activeGalleryId], [galleries, activeGalleryId]);
  const allGalleryImages = useMemo(() => activeGallery.images, [activeGallery]);

  const handlePrevGallery = () => {
    const currentIndex = galleryKeys.indexOf(activeGalleryId);
    const prevIndex = (currentIndex - 1 + galleryKeys.length) % galleryKeys.length;
    setActiveGalleryId(galleryKeys[prevIndex]);
  };

  const handleNextGallery = () => {
    const currentIndex = galleryKeys.indexOf(activeGalleryId);
    const nextIndex = (currentIndex + 1) % galleryKeys.length;
    setActiveGalleryId(galleryKeys[nextIndex]);
  };

  // State for gallery
  const [showAllImages, setShowAllImages] = useState(false);
  const [displayedImages, setDisplayedImages] = useState<typeof allGalleryImages>([]);

  // Handle keyboard events for lightbox navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allGalleryImages.length : null));
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + allGalleryImages.length) % allGalleryImages.length : null));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, allGalleryImages.length]);

  // Function to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Reset showAllImages when activeGalleryId changes
  useEffect(() => {
    setShowAllImages(false);
  }, [activeGalleryId]);

  // Initialize and animate images
  useEffect(() => {
    const getLimit = () => {
      if (typeof window !== "undefined") {
        return window.innerWidth <= 768 ? 4 : 6;
      }
      return 6;
    };

    const updateImages = () => {
      if (showAllImages) {
        setDisplayedImages(allGalleryImages);
      } else {
        const limit = getLimit();
        setDisplayedImages(allGalleryImages.slice(0, limit));
      }
    };

    updateImages();

    let interval: NodeJS.Timeout | undefined;
    if (!showAllImages && allGalleryImages.length > getLimit()) {
      interval = setInterval(() => {
        const limit = getLimit();
        const shuffled = shuffleArray(allGalleryImages);
        setDisplayedImages(shuffled.slice(0, limit));
      }, 5000);
    }

    const handleResize = () => {
      updateImages();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [showAllImages, allGalleryImages]);

  return (
    <>
      {/* ─── Past Highlights Collage ─── */}
      <section id="past-events-gallery" className="evl-collage-section relative z-10 border-t border-border/40 bg-jibb-cream/10 py-16 scroll-mt-20">
        <motion.div
          className="evl-collage-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <div className="evl-collage-header-left">
            <motion.p 
              className="text-xs font-black uppercase tracking-widest text-primary/80 dark:text-primary-foreground/80 mb-2" 
              variants={fadeInUp} 
              style={fontHeading}
            >
              {locale === "ja" ? "記録" : "Gallery"}
            </motion.p>
            <motion.h2 
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-tight mb-2" 
              variants={fadeInUp} 
              style={fontHeading}
            >
              {l.collageTitle}
            </motion.h2>
            <motion.p 
              className="text-sm md:text-base text-muted-foreground leading-relaxed font-normal" 
              variants={fadeInUp} 
              style={fontSans}
            >
              {l.collageSubtitle}
            </motion.p>
          </div>

          <motion.div className="evl-gallery-carousel-selector animate-in fade-in" variants={fadeInUp}>
            <button onClick={handlePrevGallery} className="evl-gallery-carousel-arrow" aria-label="Previous gallery">
              <span className="material-symbols-outlined">west</span>
            </button>
            <span className="evl-gallery-carousel-name font-bold" style={fontHeading}>
              {activeGallery.name[locale as "en" | "ja"]}
            </span>
            <button onClick={handleNextGallery} className="evl-gallery-carousel-arrow" aria-label="Next gallery">
              <span className="material-symbols-outlined">east</span>
            </button>
          </motion.div>
        </motion.div>

        <div className="evl-collage-grid-wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {allGalleryImages.length === 0 ? (
            <motion.div
              className="evl-collage-empty-state"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <span className="material-symbols-outlined">photo_library</span>
              <p style={fontSans}>
                {locale === "ja" ? "画像は近日中に追加されます。" : "Images will be added soon."}
              </p>
            </motion.div>
          ) : (
            <div className={`evl-collage-grid-container ${showAllImages ? "expanded" : ""}`}>
              <AnimatePresence mode="sync">
                <motion.div
                  key={`${activeGalleryId}-${displayedImages.map(img => img.src).join("-")}`}
                  className="evl-collage-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {displayedImages.map((img, i) => (
                    <motion.div
                      key={`${img.src}-${i}`}
                      className="evl-collage-item relative rounded-2xl overflow-hidden shadow-sm group"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      onClick={() => {
                        const fullIndex = allGalleryImages.findIndex(g => g.src === img.src);
                        if (fullIndex !== -1) {
                          setLightboxIndex(fullIndex);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="evl-collage-img object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="evl-collage-overlay">
                        <span style={fontSans}>{img.alt}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* View More Button */}
          {allGalleryImages.length > 0 && (showAllImages || allGalleryImages.length > displayedImages.length) && (
            <motion.div
              className="evl-gallery-action"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <button
                className="evl-btn-view-gallery"
                onClick={() => setShowAllImages(!showAllImages)}
                style={fontHeading}
              >
                <span className="material-symbols-outlined">
                  {showAllImages ? "expand_less" : "photo_library"}
                </span>
                <span>{showAllImages ? l.viewLess : l.viewMore}</span>
                <span className="evl-gallery-count">
                  ({displayedImages.length} / {allGalleryImages.length})
                </span>
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── Lightbox Modal ─── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="evl-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="evl-lightbox-close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close Lightbox"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <button
              className="evl-lightbox-nav-btn left"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev - 1 + allGalleryImages.length) % allGalleryImages.length : null));
              }}
              aria-label="Previous image"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            <div className="evl-lightbox-content" onClick={(e) => e.stopPropagation()}>
              <div className="evl-lightbox-img-wrapper">
                <Image
                  src={allGalleryImages[lightboxIndex].src}
                  alt={allGalleryImages[lightboxIndex].alt}
                  width={1600}
                  height={1200}
                  className="evl-lightbox-img"
                  priority
                />
              </div>
              <div className="evl-lightbox-caption" style={fontSans}>
                <span className="evl-lightbox-counter">
                  {lightboxIndex + 1} / {allGalleryImages.length}
                </span>
                <p className="evl-lightbox-desc">
                  {allGalleryImages[lightboxIndex].alt}
                </p>
              </div>
            </div>

            <button
              className="evl-lightbox-nav-btn right"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allGalleryImages.length : null));
              }}
              aria-label="Next image"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
