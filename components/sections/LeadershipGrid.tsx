"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, ExternalLink, Users, Award } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function LeadershipGrid() {
  const t = useTranslations("leadershipPage");
  const [filter, setFilter] = useState<"all" | "india" | "japan">("all");

  const allKeys = [
    "hitesh", "takeshi", "varun", "shigemaro", "priya", "nobuchika", 
    "ujjawal", "pratiksha", "gyanendra", "akash", "vardaan", "mai", "aya", "kenji"
  ];

  // Map each member profile
  const members = allKeys.map(key => ({
    key,
    name: t(`members.${key}.name`),
    role: t(`members.${key}.role`),
    location: t(`members.${key}.location`),
    bio: t(`members.${key}.bio`),
    country: t(`members.${key}.location`).toLowerCase().includes("tokyo") || t(`members.${key}.location`).toLowerCase().includes("japan") ? "japan" : "india"
  }));

  const filteredMembers = members.filter(m => {
    if (filter === "india") return m.country === "india";
    if (filter === "japan") return m.country === "japan";
    return true;
  });

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative gradient effects */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(36,59,107,0.05)_0%,transparent_75%)] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(242,101,34,0.05)_0%,transparent_75%)] pointer-events-none" />

      <div className="section-container relative z-10 max-w-7xl mx-auto px-4">
        {/* Filter Toolbar */}
        <div className="flex justify-center gap-2 mb-12 border-b border-border/40 pb-6">
          {[
            { id: "all", label: "All Members (14)" },
            { id: "india", label: "India Operations Team" },
            { id: "japan", label: "Japan Executive Team" }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                filter === btn.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted/60 hover:bg-muted text-muted-foreground border border-border/40"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Responsive Grid */}
        <ScrollReveal staggerChildren={0.08} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMembers.map((person) => {
            const isJapan = person.country === "japan";
            return (
              <div
                key={person.key}
                className={`group relative rounded-2xl bg-card border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between overflow-hidden ${
                  isJapan 
                    ? "border-border/50 hover:border-jibb-indigo/30" 
                    : "border-border/50 hover:border-jibb-orange/30"
                }`}
              >
                {/* Visual Accent top ribbon */}
                <div className={`h-1.5 w-full ${isJapan ? "bg-jibb-indigo" : "bg-jibb-orange"}`} />

                <div className="p-6 flex-grow flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-4">
                    {/* Placeholder Avatar */}
                    <div className="size-14 rounded-xl bg-primary/5 flex items-center justify-center border border-border/30 shrink-0">
                      <Users className="size-6 text-primary/35" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base md:text-lg font-black text-foreground tracking-tight leading-snug">
                        {person.name}
                      </h3>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider leading-relaxed">
                        {person.role}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                      <MapPin className="size-3.5 shrink-0" />
                      <span>{person.location}</span>
                    </div>

                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-semibold">
                      {person.bio}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/30">
                    <a
                      href="#"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary text-[11px] font-extrabold text-foreground transition-colors duration-200"
                    >
                      <ExternalLink className="size-3 text-primary" />
                      <span>LinkedIn Profile</span>
                      <ExternalLink className="size-2.5 text-muted-foreground" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
