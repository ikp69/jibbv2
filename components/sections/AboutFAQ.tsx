"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Info } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useTranslations } from "next-intl";

const FAQS = [
  {
    question: "How is JIBB governed and structured?",
    answer: "JIBB operates as an independent, non-profit organization with a dual-headquarters structure in Tokyo and Noida. Our operations are led by an executive Leadership Team and overseen by a distinguished Advisory Board comprising former government officials, academic leaders, and industry veterans from both nations."
  },
  {
    question: "Is JIBB officially affiliated with the Japanese or Indian governments?",
    answer: "While JIBB works closely with governmental bodies like METI (Japan) and DPIIT (India) to align with national industrial policies, we remain an independent, private entity. This autonomy allows us to act with agility and represent the best interests of our corporate and institutional members."
  },
  {
    question: "How are the Advisory Board members selected?",
    answer: "Advisory Board members are invited based on their extensive experience in bilateral trade, industrial innovation, or cross-border diplomacy. They serve on a voluntary basis to provide strategic direction and ensure that JIBB’s initiatives align with long-term macroeconomic goals of both countries."
  },
  {
    question: "How is funding and membership revenue utilized?",
    answer: "All revenues from memberships, sponsorships, and consulting services are reinvested into our core programs. This includes maintaining the Innovation Hubs, organizing bilateral trade missions, conducting market research, and supporting early-stage cross-border startups."
  },
  {
    question: "What is JIBB's policy on data privacy and corporate confidentiality?",
    answer: "We adhere strictly to both Japanese (APPI) and Indian (DPDP) data protection regulations. Corporate strategies, proprietary technology details, and member data shared during partnership facilitation are protected under stringent Non-Disclosure Agreements (NDAs)."
  }
];

export function AboutFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-28 bg-jibb-gradient-subtle border-t border-border/20">
      <div className="section-container max-w-4xl">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md mx-auto">
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary">
              Governance & Transparency
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Learn more about how JIBB is structured, governed, and funded to serve the India-Japan bilateral corridor.
          </p>
        </div>

        <ScrollReveal direction="up" delay={0.1}>
          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen
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
                        className={`p-1.5 rounded-full transition-colors ${
                          isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Info className="size-4" />
                      </div>
                      <span
                        className={`font-semibold text-sm md:text-base transition-colors ${
                          isOpen ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`shrink-0 p-1 rounded-full border transition-all duration-300 ${
                        isOpen
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
                          {faq.answer}
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
