"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Globe, Sparkles } from "lucide-react";

interface OfficeLocation {
  id: string;
  name: string;
  city: string;
  mapUrl: string;
  address: string;
}

const LOCATIONS: OfficeLocation[] = [
  {
    id: "tokyo",
    name: "Tokyo Office",
    city: "Minato-ku, Tokyo",
    address: "Tameike Suzuki Building 3F, 1-2-13 Akasaka, Minato-ku, Tokyo",
    mapUrl: "https://maps.google.com/maps?q=Tameike%20Suzuki%20Building,%201-2-13%20Akasaka,%20Minato-ku,%20Tokyo&t=&z=16&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "noida",
    name: "Noida Office",
    city: "Sector 136, Noida",
    address: "JIBB, 6th Floor, 162, Sector 136, Arihant Business Centre, Noida, Uttar Pradesh",
    mapUrl: "https://maps.google.com/maps?q=Arihant%20Business%20Centre,%20Sector%20136,%20Noida,%20Uttar%20Pradesh&t=&z=16&ie=UTF8&iwloc=&output=embed",
  },
];

export function OfficeMap() {
  const [activeLocId, setActiveLocId] = useState("tokyo");

  const activeLoc = LOCATIONS.find((loc) => loc.id === activeLocId) || LOCATIONS[0];

  return (
    <div className="relative rounded-2xl bg-card border border-border shadow-jibb overflow-hidden flex flex-col gap-4">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />

      {/* Tabs Header */}
      <div className="flex border-b border-border bg-muted/20 select-none relative p-1.5 gap-1.5">
        {LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            type="button"
            onClick={() => setActiveLocId(loc.id)}
            className={`relative flex-1 py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-lg transition-all ${activeLocId === loc.id
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
          >
            <MapPin className="size-3.5" />
            {loc.id === "tokyo" ? "Tokyo HQ" : "Noida HQ"}
          </button>
        ))}
      </div>

      {/* Map iframe Container */}
      <div className="relative w-full aspect-video md:aspect-[4/3] bg-muted/10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLoc.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
          >
            <iframe
              title={activeLoc.name}
              src={activeLoc.mapUrl}
              className="w-full h-full border-0 transition-all duration-300"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Address Detail Footer */}
      <div className="p-4 bg-muted/10 border-t border-border flex flex-col gap-1 text-left">
        <span className="text-xs font-bold text-foreground flex items-center gap-1">
          <Globe className="size-3.5 text-jibb-orange" />
          {activeLoc.name}
        </span>
        <span className="text-[10px] text-muted-foreground leading-normal mt-0.5">
          {activeLoc.address}
        </span>
      </div>
    </div>
  );
}
