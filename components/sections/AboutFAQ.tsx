"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Info } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useTranslations } from "next-intl";

const FAQS = [
  { key: "q1" },
  { key: "q2" },
  { key: "q3" },
  { key: "q4" },
  { key: "q5" }
];

export function AboutFAQ() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-28 bg-jibb-gradient-subtle border-t border-border/20">
      <div className="section-container max-w-4xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <ScrollReveal direction="up" delay={0.1}>
          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${isOpen
                    ? "border-primary/30 bg-primary/5 shadow-sm"
                    : "border-border/50 bg-card hover:border-primary/20"
                    }`}
                >
                  <button
                    onClick={() => toggleOpen(index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-full transition-colors ${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                      >
                        <Info className="size-4" />
                      </div>
                      <span
                        className={`font-semibold text-sm md:text-base transition-colors ${isOpen ? "text-primary" : "text-foreground"
                          }`}
                      >
                        {t(`questions.${faq.key}.question`)}
                      </span>
                    </div>
                    <div
                      className={`shrink-0 p-1 rounded-full border transition-all duration-300 ${isOpen
                        ? "bg-primary text-primary-foreground border-primary rotate-180"
                        : "bg-background text-muted-foreground border-border"
                        }`}
                    >
                      {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-0 text-sm md:text-base text-muted-foreground leading-relaxed ml-10">
                          {t(`questions.${faq.key}.answer`)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
