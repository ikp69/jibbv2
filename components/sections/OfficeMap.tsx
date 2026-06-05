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
    name: "Tokyo Headquarters",
    city: "Chiyoda-ku, Tokyo",
    address: "1-1 Marunouchi, Chiyoda-ku, Tokyo 100-0005, Japan",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.826847274836!2d139.7570498!3d35.6894875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188c0c4b4d5fff%3A0x2a3e0b77b7e6f6cb!2sChiyoda%20City%2C%20Tokyo!5e0!3m2!1sen!2sjp!4v1680000000000!5m2!1sen!2sjp",
  },
  {
    id: "noida",
    name: "Noida Operations Office",
    city: "Sector 62, Noida",
    address: "Block C, Sector 62, Noida, Uttar Pradesh 201301, India",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.562145610214!2d77.3872223!3d28.5828731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a5312d1b5b%3A0xa193fa7a34cb941e!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin",
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
            className={`relative flex-1 py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-lg transition-all ${
              activeLocId === loc.id
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            }`}
          >
            <MapPin className="size-3.5" />
            {loc.id === "tokyo" ? "Tokyo HQ" : "Noida Hub"}
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
              className="w-full h-full border-0 filter grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
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
