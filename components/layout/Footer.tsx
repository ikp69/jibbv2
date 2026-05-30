"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  MapPin,
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

export function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-primary text-primary-foreground border-t border-white/10 overflow-hidden">
      {/* Single decorative glow — one per section rule */}
      <div aria-hidden="true" className="absolute -top-40 -right-40 w-96 h-96 bg-jibb-orange/5 rounded-full blur-3xl" />

      {/* Main Footer Content */}
      <div className="section-container relative z-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* Column 1: Brand & Addresses (Col span 4) */}
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

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://linkedin.com/company/japan-india-business-bureau"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="size-4" />
              </a>
              <a
                href="https://twitter.com/jibb_org"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <TwitterIcon className="size-4" />
              </a>
              <a
                href="https://youtube.com/@jibb_org"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <YouTubeIcon className="size-4" />
              </a>
            </div>

            {/* Office Locations */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <MapPin className="size-4 text-jibb-orange shrink-0 mt-1" />
                <div className="text-sm">
                  <span className="font-semibold block text-white/90">
                    {t("footer.offices.tokyoTitle")}
                  </span>
                  <span className="text-white/60 text-xs">
                    {t("footer.offices.tokyoAddress")}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="size-4 text-jibb-orange shrink-0 mt-1" />
                <div className="text-sm">
                  <span className="font-semibold block text-white/90">
                    {t("footer.offices.noidaTitle")}
                  </span>
                  <span className="text-white/60 text-xs">
                    {t("footer.offices.noidaAddress")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-jibb-orange">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-white/60 hover:text-white transition-colors block py-0.5"
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/sectors"
                  className="text-white/60 hover:text-white transition-colors block py-0.5"
                >
                  {t("nav.sectors")}
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-white/60 hover:text-white transition-colors block py-0.5"
                >
                  {t("nav.careers")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/60 hover:text-white transition-colors block py-0.5"
                >
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-jibb-orange">
              {t("footer.services")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services/market-entry"
                  className="text-white/60 hover:text-white transition-colors block py-0.5"
                >
                  Market Entry
                </Link>
              </li>
              <li>
                <Link
                  href="/services/partnership-facilitation"
                  className="text-white/60 hover:text-white transition-colors block py-0.5"
                >
                  Partnerships
                </Link>
              </li>
              <li>
                <Link
                  href="/services/localization-support"
                  className="text-white/60 hover:text-white transition-colors block py-0.5"
                >
                  Localization
                </Link>
              </li>
              <li>
                <Link
                  href="/services/investment-support"
                  className="text-white/60 hover:text-white transition-colors block py-0.5"
                >
                  Investment
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Innovation Hub (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-jibb-orange">
              {t("footer.innovation")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/innovation-hub"
                  className="text-white/60 hover:text-white transition-colors block py-0.5"
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/innovation-hub/center-of-excellence"
                  className="text-white/60 hover:text-white transition-colors block py-0.5"
                >
                  CoE Labs
                </Link>
              </li>
              <li>
                <Link
                  href="/membership"
                  className="text-white/60 hover:text-white transition-colors block py-0.5"
                >
                  {t("nav.membership")}
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-white/60 hover:text-white transition-colors block py-0.5"
                >
                  {t("nav.events")}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Newsletter Strip */}
        <div className="border-t border-white/10 py-10 flex flex-col md:flex-row items-center justify-between gap-8 mb-6">
          <div className="md:w-1/2 space-y-2 text-center md:text-left">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-jibb-orange">
              {t("footer.newsletter.title")}
            </h4>
            <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
              {t("footer.newsletter.desc")}
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="md:w-1/2 flex flex-col sm:flex-row gap-3 justify-end w-full"
          >
            <div className="relative w-full sm:max-w-sm lg:max-w-md">
              <Input
                type="email"
                placeholder={t("footer.newsletter.placeholder")}
                className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-jibb-orange pl-10 h-11 text-sm rounded-xl"
              />
              <Mail className="absolute left-3.5 top-3.5 size-4 text-white/40" />
            </div>
            <Button
              type="submit"
              variant="accent"
              className="h-11 px-8 font-semibold shadow-lg rounded-xl shrink-0"
            >
              {t("footer.newsletter.button")}
            </Button>
          </form>
        </div>

        {/* Bilateral Partner Strip — styled badge pills with external links */}
        <div className="border-t border-white/5 py-6 flex flex-wrap items-center justify-between gap-6">
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
        </div>

        {/* Bottom Bar: Copyright & Legal */}
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
