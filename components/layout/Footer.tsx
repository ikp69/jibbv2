"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";
import {
  ExternalLink,
} from "lucide-react";

function LinkedInIcon({ className }: { className?: string }) {
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

function TwitterIcon({ className }: { className?: string }) {
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
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
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

/* ============================================================
   BILINGUAL OFFICE GEOMETRY ICONS (Tokyo & Delhi NCR)
   ============================================================ */
function JapanIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="url(#japanGlow)" stroke="#D96C6C" strokeWidth="1.5" />
      {/* Red rising sun */}
      <circle cx="32" cy="24" r="10" fill="#D96C6C" fillOpacity="0.8" />
      {/* Detailed Mount Fuji silhouette */}
      <path d="M12 48C20 44 26 28 32 28C38 28 44 44 52 48" stroke="#D96C6C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Snow cap filled white */}
      <path d="M28.5 35C29.5 34 32 33.5 32 33.5C32 33.5 34.5 34 35.5 35L32 28L28.5 35Z" fill="#FFFFFF" stroke="#D96C6C" strokeWidth="1" strokeLinejoin="round" />
      {/* Detailed Traditional Pagoda silhouette in foreground */}
      <path d="M16 48H24" stroke="#D96C6C" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 48V44H22V48" fill="rgba(217, 108, 108, 0.2)" stroke="#D96C6C" strokeWidth="1.2" />
      <path d="M16 44C18 42.5 22 42.5 24 44" stroke="#D96C6C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 42.5V39H21V42.5" fill="rgba(217, 108, 108, 0.2)" stroke="#D96C6C" strokeWidth="1.2" />
      <path d="M17 39C18.5 37.5 21.5 37.5 23 39" stroke="#D96C6C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19.5 37.5V35.5H20.5V37.5" stroke="#D96C6C" strokeWidth="1.2" />
      <path d="M20 35.5V33.5" stroke="#D96C6C" strokeWidth="1" strokeLinecap="round" />
      <defs>
        <radialGradient id="japanGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(217, 108, 108, 0.2)" />
          <stop offset="100%" stopColor="rgba(217, 108, 108, 0.02)" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function DelhiNcrIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="url(#delhiGlow)" stroke="#E98B2A" strokeWidth="1.5" />
      {/* Sunburst background flare */}
      <path d="M32 6V10M32 54V58M6 32H10M54 32H58" stroke="#E98B2A" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M13.5 13.5L16.5 16.5M47.5 47.5L50.5 50.5M13.5 50.5L16.5 47.5M47.5 16.5L50.5 13.5" stroke="#E98B2A" strokeWidth="1" strokeLinecap="round" opacity="0.3" />

      {/* Accurate India Gate Silhouette from SVG Repo scaled to fit */}
      <g transform="translate(12, 10) scale(0.078)">
        <path
          fill="#E98B2A"
          d="M256 49.5c-20 0-48 3.5-64 10.5v18h-64v55h256V78h-64V60c-16-7-44-10.5-64-10.5zM208 90c8.8 0 16 7.16 16 16 0 8.8-7.2 16-16 16s-16-7.2-16-16c0-8.84 7.2-16 16-16zm96 0c8.8 0 16 7.16 16 16 0 8.8-7.2 16-16 16s-16-7.2-16-16c0-8.84 7.2-16 16-16zm-192 61v18H96v18h320v-18h-16v-18zm-32 52v18h352v-18zm16 36v72h112.7c8.1-52 86.5-52 94.6 0H416v-72zm0 90v30h96v18H96v119h112V329zm208 0v167h112V377h-96v-18h96v-30z"
        />
      </g>

      <defs>
        <radialGradient id="delhiGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(233, 139, 42, 0.2)" />
          <stop offset="100%" stopColor="rgba(233, 139, 42, 0.02)" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="relative bg-primary text-primary-foreground border-t border-white/10 overflow-hidden">
      {/* Single decorative glow */}
      <div aria-hidden="true" className="absolute -top-40 -right-40 w-96 h-96 bg-jibb-orange/5 rounded-full blur-3xl" />

      {/* Main Footer Content */}
      <div className="section-container relative z-10 pt-16 pb-8">

        {/* ROW 1: BRAND IDENTITY & NAVIGATION GRID */}
        <ScrollReveal staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-16 mb-12">

          {/* Column 1: Brand & Socials (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <Link href="/" className="inline-block">
                <img
                  src="/jibb-logo.svg"
                  alt="JIBB Logo"
                  className="w-auto h-10 lg:h-12 object-contain brightness-0 invert"
                />
              </Link>
              <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-sm">
                {t("footer.tagline")}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <motion.a
                href="https://linkedin.com/company/japan-india-business-bureau"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 450, damping: 12 }}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0A66C2]/20 hover:bg-[#0A66C2]/40 border border-[#0A66C2]/40 hover:border-[#0A66C2]/70 text-white transition-all duration-200"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="size-4 shrink-0" />
                <span className="text-xs font-semibold">Follow on LinkedIn</span>
              </motion.a>
            </div>
          </div>

          {/* Column 2: About (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-jibb-orange">
              {t("nav.about")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-white/60 hover:text-white transition-colors block py-0.5">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/about/leadership" className="text-white/60 hover:text-white transition-colors block py-0.5">
                  {t("aboutMenu.leadership")}
                </Link>
              </li>
              <li>
                <Link href="/sectors" className="text-white/60 hover:text-white transition-colors block py-0.5">
                  {t("nav.sectors")}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-white/60 hover:text-white transition-colors block py-0.5">
                  {t("nav.careers")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Network (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-jibb-orange">
              Network
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/services" className="text-white/60 hover:text-white transition-colors block py-0.5">
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-white/60 hover:text-white transition-colors block py-0.5">
                  {t("nav.membership")}
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-white/60 hover:text-white transition-colors block py-0.5">
                  {t("nav.events")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/60 hover:text-white transition-colors block py-0.5">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-jibb-orange">
              {t("footer.resources")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/resources/blog" className="text-white/60 hover:text-white transition-colors block py-0.5">
                  {t("resourcesMenu.blog")}
                </Link>
              </li>
              <li>
                <Link href="/resources/thought-leadership" className="text-white/60 hover:text-white transition-colors block py-0.5">
                  {t("resourcesMenu.leadership")}
                </Link>
              </li>
              <li>
                <Link href="/resources/insights" className="text-white/60 hover:text-white transition-colors block py-0.5">
                  {t("resourcesMenu.insights")}
                </Link>
              </li>
              {/* <li>
                <Link href="/resources/newsletter" className="text-white/60 hover:text-white transition-colors block py-0.5">
                  {t("resourcesMenu.newsletter")}
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Column 5: Legal (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-jibb-orange">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/terms" className="text-white/60 hover:text-white transition-colors block py-0.5">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/60 hover:text-white transition-colors block py-0.5">
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </ScrollReveal>

        {/* ROW 2: DETAILED ADDRESS CARDS & NEWSLETTER FORM */}
        <div className="border-t border-white/10 pt-10 pb-6 mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-stretch">

          {/* Japan Office Address Column (col span 4) */}
          <ScrollReveal direction="left" className="lg:col-span-4 md:col-span-1">
            <Link
              href="/contact"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full"
            >
              <JapanIcon className="size-14 text-jibb-sakura shrink-0" />
              <div className="space-y-1.5 text-left">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  {t("footer.offices.tokyoTitle")}
                </span>
                <span className="text-white/60 text-xs leading-relaxed block group-hover:text-white/90 transition-colors">
                  {t("footer.offices.tokyoAddress")}
                </span>
              </div>
            </Link>
          </ScrollReveal>

          {/* Delhi NCR Office Address Column (col span 4) */}
          <ScrollReveal direction="right" className="lg:col-span-4 md:col-span-1">
            <Link
              href="/contact"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full"
            >
              <DelhiNcrIcon className="size-14 text-jibb-orange shrink-0" />
              <div className="space-y-1.5 text-left">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  {t("footer.offices.noidaTitle")}
                </span>
                <span className="text-white/60 text-xs leading-relaxed block group-hover:text-white/90 transition-colors">
                  {t("footer.offices.noidaAddress")}
                </span>
              </div>
            </Link>
          </ScrollReveal>

          {/* LinkedIn Follow Column (col span 4) */}
          <ScrollReveal direction="right" className="lg:col-span-4 md:col-span-2 lg:col-span-4">
            <a
              href="https://linkedin.com/company/japan-india-business-bureau"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full"
            >
              <div className="size-14 rounded-full border border-[#0A66C2]/20 bg-[#0A66C2]/10 flex items-center justify-center shrink-0 group-hover:border-[#0A66C2]/40 group-hover:bg-[#0A66C2]/20 transition-all duration-300">
                <img
                  src="/jibb-logo.svg"
                  alt="JIBB Symbol"
                  className="w-8 h-auto object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="space-y-1.5 text-left">
                <span className="text-xs font-bold text-white uppercase tracking-wider block flex items-center gap-1.5">
                  {t("footer.linkedin.title")}
                  <ExternalLink className="size-3 text-white/40 group-hover:text-white/80 transition-colors" />
                </span>
                <span className="text-white/60 text-xs leading-relaxed block group-hover:text-white/90 transition-colors">
                  {t("footer.linkedin.desc")}
                </span>
              </div>
            </a>
          </ScrollReveal>

        </div>

        {/* ROW 3: BILATERAL PARTNER BADGE LIST */}
        {/* <div className="border-t border-white/5 py-6 flex flex-wrap items-center justify-between gap-6">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
            Bilateral Support &amp; Ecosystem Partners
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {([
              { name: "METI Japan", href: "https://www.meti.go.jp/english/" },
              { name: "DPIIT India", href: "https://dpiit.gov.in" },
              { name: "JETRO", href: "https://www.jetro.go.jp/en/" },
              { name: "Invest India", href: "https://www.investindia.gov.in" },
              { name: "FICCI", href: "https://ficci.in" },
              { name: "Keidanren", href: "https://www.keidanren.or.jp/en/" },
            ] as { name: string; href: string }[]).map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-200 text-[11px] font-bold tracking-wide select-none"
              >
                {partner.name}
                <ExternalLink className="size-2.5 opacity-60" />
              </a>
            ))}
          </div>
        </div> */}

        {/* ROW 4: COPYRIGHT & LEGAL SUB-BAR */}
        <div className="border-t border-white/10 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-white/50 text-center md:text-left">
            {t("footer.copyright", { year: currentYear })}
          </p>
          <div className="flex gap-6 text-white/50">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors py-1"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href="/terms"
              className="hover:text-white transition-colors py-1"
            >
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
