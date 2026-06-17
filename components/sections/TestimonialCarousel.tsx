"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  quoteTitle: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  avatarUrl: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quoteTitle: "Accelerating Mutual Growth",
    quote: "The Japan India Business Bureau (JIBB) is working on a futuristic initiative: Japan India Semiconductor Committee (JISC) where they are bridging the gap between Japanese companies and India’s growing semiconductor ecosystem. We look forward to working closely with JISC and its member companies to build meaningful partnerships, support technology transfers, and accelerate mutual growth. India is open for business, and we are excited to welcome innovative Japanese players through this dedicated platform.",
    author: "Dr. Manish Kumar Hooda",
    role: "Director, Technology – India Semiconductor Mission",
    location: "India",
    avatarUrl: "/testimonials/manishhooda.jpeg",
  },
  {
    quoteTitle: "Enhanced Learning Experience",
    quote: "The innovative approach has revolutionized our study methods. Their AI-powered tools have saved us countless hours and allowed us to grasp complex concepts more effectively. We've seen a remarkable improvement in our overall academic performance.",
    author: "Emmily Patel",
    role: "AI Research Fellow",
    location: "Noida, India",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
  },
  {
    quoteTitle: "Accelerated Market Entry",
    quote: "JIBB did not just give us a market report. They gave us a step-by-step entry strategy, handled our local compliance, and aligned us with top tier Noida developers. Truly a bicultural accelerator that exceeded our expectations.",
    author: "Kenji Sato",
    role: "VP of Robotics Engineering",
    location: "Tokyo, Japan",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
  },
  {
    quoteTitle: "Unmatched Matchmaking & R&D",
    quote: "The co-innovation opportunities here are unmatched. We brought our battery management software, and within a month, JIBB matched us with a Japanese hardware manufacturing partner. Our time-to-market was cut in half.",
    author: "Aarav Sharma",
    role: "Founder & CEO, ElectroFlow",
    location: "Noida, India",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80",
  },
  {
    quoteTitle: "Authentic Bilateral Trust",
    quote: "Bilateral trade requires trust above all else. JIBB acts as a neutral, government-aligned facilitator that helps navigate complex compliance and build authentic corporate relationships between our nations.",
    author: "Priyanka Sen",
    role: "Strategic Partner, Invest India",
    location: "New Delhi, India",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80",
  },
  {
    quoteTitle: "Catalyzing Hardware Innovation",
    quote: "Having access to state-of-the-art incubation labs and shared test facilities in Noida was a massive catalyst for our IoT startup. We received Japanese expert mentorship that guided our hardware design from concept to production.",
    author: "Hiroshi Tanaka",
    role: "Director of R&D, IoT Solutions",
    location: "Osaka, Japan",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
  },
];

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1: right to left (next), -1: left to right (prev)
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(handleNext, 6000); // auto-scrolling right-to-left every 6 seconds
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const selectTestimonial = (targetIndex: number) => {
    if (targetIndex === index) return;
    setDirection(targetIndex > index ? 1 : -1);
    setIndex(targetIndex);
    resetTimer();
  };

  return (
    <section className="py-24 relative overflow-hidden bg-jibb-cream/20 dark:bg-[#0b0f19]/40 border-t border-b border-border/10">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-jibb-indigo/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-jibb-orange/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="section-container relative z-10 max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-jibb-indigo dark:text-jibb-indigo-light">
            Testimonial
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Our Partners Share Their Feedback
          </h2>
        </div>

        {/* Avatars Bar with Arrows */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-12">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-full border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-90 shadow-sm"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Avatar Row */}
          <div className="flex items-center gap-3 md:gap-4">
            {TESTIMONIALS.map((testimonial, idx) => {
              const isActive = idx === index;
              return (
                <button
                  key={idx}
                  onClick={() => selectTestimonial(idx)}
                  className={`relative overflow-hidden transition-all duration-300 rounded-xl size-12 md:size-16 focus:outline-none ${isActive
                      ? "ring-4 ring-jibb-indigo dark:ring-jibb-indigo-light ring-offset-2 ring-offset-background scale-110 opacity-100"
                      : "opacity-40 hover:opacity-75 scale-95 grayscale hover:grayscale-0"
                    }`}
                >
                  <img
                    src={testimonial.avatarUrl}
                    alt={testimonial.author}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="p-2.5 rounded-full border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-90 shadow-sm"
            aria-label="Next testimonial"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Testimonial Card */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => {
            if (timerRef.current) clearInterval(timerRef.current);
          }}
          onMouseLeave={resetTimer}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 260, damping: 26 },
                opacity: { duration: 0.25 },
              }}
              className="bg-card dark:bg-card/60 border border-border/80 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-xl flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-10"
            >
              {/* Left Side: Large Student Photo */}
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                <img
                  src={TESTIMONIALS[index].avatarUrl}
                  alt={TESTIMONIALS[index].author}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Side: Details & Content */}
              <div className="flex-grow flex flex-col justify-between text-center md:text-left space-y-4">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
                    &ldquo; {TESTIMONIALS[index].quoteTitle} &rdquo;
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-2 italic">
                    {TESTIMONIALS[index].quote}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4 border-t border-border/50">
                  <div className="space-y-0.5">
                    <h4 className="text-sm md:text-base font-bold text-foreground">
                      {TESTIMONIALS[index].author}
                    </h4>
                    <p className="text-xs text-muted-foreground font-medium">
                      {TESTIMONIALS[index].role} &middot;{" "}
                      <span className="text-jibb-indigo dark:text-jibb-indigo-light font-semibold">
                        {TESTIMONIALS[index].location}
                      </span>
                    </p>
                  </div>

                  {/* Social Sharing Icons */}
                  <div className="flex items-center justify-center md:justify-end gap-3.5 text-muted-foreground/60">
                    <a
                      href="#"
                      className="hover:text-jibb-indigo transition-colors"
                      aria-label="Facebook Profile"
                    >
                      <svg className="size-4 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="hover:text-jibb-indigo transition-colors"
                      aria-label="LinkedIn Profile"
                    >
                      <svg className="size-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="hover:text-jibb-indigo transition-colors"
                      aria-label="X (Twitter) Profile"
                    >
                      <svg className="size-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="hover:text-jibb-indigo transition-colors"
                      aria-label="Telegram Profile"
                    >
                      <svg className="size-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

