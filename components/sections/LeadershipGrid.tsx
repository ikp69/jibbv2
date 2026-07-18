"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Image from "next/image";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function LeadershipGrid() {
  const t = useTranslations("leadershipPage");
  const [filter, setFilter] = useState<"all" | "india" | "japan">("all");
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Render only the 11 leaders who have local portrait files in public/leaders
  const allKeys = [
    "varun", "shigemaro", "ujjawal", "vardaan", "akash",
    "pratiksha", "gyanendra", "nobuchika", "mai", "aya", "hitesh"
  ];

  const imageMap: Record<string, string> = {
    varun: "/leaders/varun-tyagi.png",
    shigemaro: "/leaders/shigemaro-yasui.png",
    ujjawal: "/leaders/ujjawal-dahiya.png",
    vardaan: "/leaders/vardaan-chaudhary.png",
    akash: "/leaders/akash-pandey.png",
    pratiksha: "/leaders/pratiksha-pandey.png",
    nobuchika: "/leaders/nobichuka-akiya.png",
    mai: "/leaders/mai-hashikura.png",
    aya: "/leaders/aya-saito.png",
    gyanendra: "/leaders/gyanendra-yadav.png",
    hitesh: "/leaders/hitesh-gupttaa.png"
  };

  const cardThemes = [
    { bg: "from-[#FFF9F6] to-[#FFF0E6]", border: "border-[#FFE0CC]", shadow: "hover:shadow-[#FFE0CC]/30" }, // soft orange/amber
    { bg: "from-[#F4F8FF] to-[#E8F0FE]", border: "border-[#D2E3FC]", shadow: "hover:shadow-[#D2E3FC]/30" }, // soft blue
    { bg: "from-[#FFF5F6] to-[#FFEBEF]", border: "border-[#FFD2DC]", shadow: "hover:shadow-[#FFD2DC]/30" }, // soft pink/rose
    { bg: "from-[#F8F5FF] to-[#EFEBFF]", border: "border-[#E1D5FF]", shadow: "hover:shadow-[#E1D5FF]/30" }, // soft purple/lavender
    { bg: "from-[#F3FCFA] to-[#E5F7F3]", border: "border-[#C7EFE5]", shadow: "hover:shadow-[#C7EFE5]/30" }, // soft teal/mint
    { bg: "from-[#FFFDF5] to-[#FFF9E0]", border: "border-[#FFF1B8]", shadow: "hover:shadow-[#FFF1B8]/30" }, // soft yellow
  ];

  const members = allKeys.map((key, index) => {
    const isJapan = t(`members.${key}.location`).toLowerCase().includes("tokyo") || t(`members.${key}.location`).toLowerCase().includes("japan");

    // For LinkedIn, we need to check if it exists first to avoid errors
    // If the key doesn't exist in translations, default to "#"
    let linkedinValue = "#";
    try {
      const tempValue = t(`members.${key}.linkedin`);
      // If we got a value that's not the key path, use it
      if (tempValue && !tempValue.includes("members.")) {
        linkedinValue = tempValue;
      }
    } catch (e) {
      // If there's any error, just use "#"
      linkedinValue = "#";
    }

    return {
      key,
      name: t(`members.${key}.name`),
      role: t(`members.${key}.role`),
      location: t(`members.${key}.location`),
      bio: t(`members.${key}.bio`),
      country: isJapan ? "japan" : "india",
      image: imageMap[key],
      theme: cardThemes[index % cardThemes.length],
      linkedin: linkedinValue
    };
  });

  const filteredMembers = members.filter(m => {
    if (filter === "india") return m.country === "india";
    if (filter === "japan") return m.country === "japan";
    return true;
  });

  return (
    <section className="py-24 bg-[#FAFAFA] relative overflow-hidden">
      {/* Decorative gradient effects */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(36,59,107,0.03)_0%,transparent_75%)] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(242,101,34,0.03)_0%,transparent_75%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Filter Toolbar */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16 border-b border-gray-100 pb-8">
          {[
            { id: "all", label: "View all" },
            { id: "japan", label: "Japan Team" },
            { id: "india", label: "India Team" }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => {
                setFilter(btn.id as any);
                setActiveKey(null); // Clear mobile detail view when switching filters
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${filter === btn.id
                ? "bg-white text-gray-900 border border-gray-200/80 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Responsive Grid */}
        <ScrollReveal staggerChildren={0.05} className="flex flex-wrap justify-center gap-8">
          {filteredMembers.map((person) => {
            const isSelected = activeKey === person.key;
            return (
              <div
                key={person.key}
                onClick={() => setActiveKey(isSelected ? null : person.key)}
                className={`group relative rounded-2xl bg-gradient-to-b ${person.theme.bg} border ${person.theme.border} transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${person.theme.shadow} flex flex-col justify-between overflow-hidden aspect-[4/5] cursor-pointer w-[calc(50%-16px)] lg:w-[calc(25%-24px)]`}
              >
                {/* Profile Portrait Image */}
                <div className="relative w-full h-full overflow-hidden flex items-end justify-center">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    priority={person.key === "varun" || person.key === "shigemaro"}
                  />

                  {/* Floating glassmorphic info tag at the bottom (Static View) */}
                  <div className={`absolute inset-x-0 bottom-0 p-2.5 sm:p-4 transition-all duration-500 ease-out ${isSelected ? "opacity-0 translate-y-4" : "group-hover:opacity-0 group-hover:translate-y-4"}`}>
                    <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-lg px-2.5 py-3 sm:px-4 sm:py-4 rounded-xl text-center">
                      <h3 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight leading-tight">
                        {person.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs font-semibold text-gray-500 mt-0.5 sm:mt-1 leading-snug line-clamp-2">
                        {person.role}
                      </p>
                    </div>
                  </div>

                  {/* Interactive detail overlay (shows on hover for desktop, toggles on click for mobile) */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-900/80 to-gray-950/20 transition-all duration-500 flex flex-col justify-end p-4 sm:p-6 text-white text-left ${isSelected ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                    }`}>
                    <div className={`transition-transform duration-500 ease-out space-y-2 sm:space-y-3 ${isSelected ? "translate-y-0" : "translate-y-6 group-hover:translate-y-0"
                      }`}>
                      <div>
                        <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#F26522] bg-[#F26522]/10 px-2.5 py-1 rounded-full border border-[#F26522]/20">
                          <MapPin className="size-2.5 sm:size-3" />
                          {person.location}
                        </span>
                      </div>

                      <div className="space-y-0.5 sm:space-y-1">
                        <h4 className="text-sm sm:text-lg font-black text-white leading-tight tracking-tight">
                          {person.name}
                        </h4>
                        <p className="text-[10px] sm:text-xs font-bold text-gray-300 leading-snug">
                          {person.role}
                        </p>
                      </div>

                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-200/90 leading-relaxed font-medium line-clamp-3 sm:line-clamp-4">
                        {person.bio}
                      </p>

                      <div className="pt-1.5 sm:pt-2 border-t border-white/10 flex items-center justify-between">
                        <a
                          href={person.linkedin && person.linkedin !== "#" ? person.linkedin : "#"}
                          target={person.linkedin && person.linkedin !== "#" ? "_blank" : undefined}
                          rel={person.linkedin && person.linkedin !== "#" ? "noopener noreferrer" : undefined}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!person.linkedin || person.linkedin === "#") {
                              e.preventDefault();
                            }
                          }}
                          className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-extrabold text-white bg-white/10 hover:bg-white/20 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-300 border border-white/10"
                        >
                          <LinkedinIcon className="size-3 sm:size-3.5 text-sky-400" />
                          <span>LinkedIn</span>
                        </a>
                      </div>
                    </div>
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

