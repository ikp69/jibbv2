"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Hourglass, Mail, CheckCircle, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

interface ComingSoonPageProps {
  titleKey: string;
  subtitleKey: string;
  sectionName: string;
  illustrationSrc?: string;
  illustrationType?: "strategy" | "collaboration" | "research" | "incubation" | "market" | "media" | "auth" | "legal";
  colorTheme?: "indigo" | "orange" | "sakura" | "emerald";
  relatedLinks?: { label: string; href: string }[];
}

export function ComingSoonPage({
  titleKey,
  subtitleKey,
  sectionName,
  illustrationSrc,
  illustrationType,
  colorTheme = "orange",
  relatedLinks = [
    { label: "Bilateral Membership", href: "/membership" },
    { label: "Innovation Hub", href: "/innovation-hub" },
    { label: "Bilateral About Us", href: "/about" },
  ],
}: ComingSoonPageProps) {
  const t = useTranslations();

  // Safeguard translation lookups
  let title = "Coming Soon";
  try {
    title = t(titleKey);
  } catch {
    title = titleKey.split(".").pop() || titleKey;
  }

  let subtitle = "This page is currently being curated.";
  try {
    subtitle = t(subtitleKey);
  } catch {
    subtitle = subtitleKey;
  }

  // Newsletter State
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await subscribeToNewsletter({
        email: email.trim(),
        source: `coming-soon:${sectionName}`,
        honeypot,
      });

      if (response.success) {
        setIsSuccess(true);
        setEmail("");
      } else {
        alert(response.error || "Subscription failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Subscription failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const themeClasses = {
    indigo: {
      glow: "bg-jibb-indigo/10",
      accentGlow: "shadow-jibb-glow hover:border-jibb-indigo/30",
      text: "text-jibb-indigo",
      fill: "#243B6B",
    },
    orange: {
      glow: "bg-jibb-orange/10",
      accentGlow: "shadow-jibb-orange-glow hover:border-jibb-orange/30",
      text: "text-jibb-orange",
      fill: "#E98B2A",
    },
    sakura: {
      glow: "bg-jibb-sakura/10",
      accentGlow: "shadow-jibb-sakura-glow hover:border-jibb-sakura/30",
      text: "text-jibb-sakura",
      fill: "#D96C6C",
    },
    emerald: {
      glow: "bg-emerald-500/10",
      accentGlow: "shadow-emerald-500/10 hover:border-emerald-500/30",
      text: "text-emerald-400",
      fill: "#10B981",
    },
  }[colorTheme];

  // Dynamically render a bicultural custom animated SVG based on section category
  const renderIllustration = (type?: string) => {
    const resolvedType = type || (() => {
      const key = titleKey.toLowerCase();
      if (key.includes("vision") || key.includes("approach") || key.includes("consulting") || key.includes("strategy")) return "strategy";
      if (key.includes("partnership") || key.includes("joint") || key.includes("ecosystem") || key.includes("collaborat")) return "collaboration";
      if (key.includes("lab") || key.includes("research") || key.includes("excellence")) return "research";
      if (key.includes("incubation") || key.includes("challenge") || key.includes("startup")) return "incubation";
      if (key.includes("market") || key.includes("entry") || key.includes("localize") || key.includes("sector")) return "market";
      if (key.includes("blog") || key.includes("report") || key.includes("newsletter") || key.includes("insight") || key.includes("thought") || key.includes("media") || key.includes("event")) return "media";
      if (key.includes("login") || key.includes("auth")) return "auth";
      if (key.includes("privacy") || key.includes("terms") || key.includes("legal")) return "legal";
      return "radar";
    })();

    const fillHex = themeClasses.fill;
    const textClass = themeClasses.text;

    switch (resolvedType) {
      case "market":
        return (
          <div className="relative size-24 mb-2 flex items-center justify-center select-none pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.75" className="opacity-15 stroke-dasharray-[3_3]" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1.25" className="opacity-25" />
              <path d="M50 5 L50 12 M50 95 L50 88 M5 50 L12 50 M95 50 L88 50" stroke="currentColor" strokeWidth="1.25" className="opacity-35" />
              <line x1="50" y1="50" x2="50" y2="15" stroke="currentColor" strokeWidth="0.75" className="opacity-20 origin-center animate-spin" style={{ animationDuration: "10s" }} />
              <g className="origin-center animate-[float_4s_infinite_ease-in-out]">
                <path d="M50 50 L65 30 L53 48 Z" fill="#D96C6C" />
                <path d="M50 50 L35 70 L47 52 Z" fill="#E98B2A" />
                <circle cx="50" cy="50" r="3" fill={fillHex} />
              </g>
            </svg>
          </div>
        );
      case "collaboration":
        return (
          <div className="relative size-28 mb-2 flex items-center justify-center select-none pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <g className="origin-[35px_50px] animate-spin" style={{ animationDuration: "16s" }}>
                <circle cx="35" cy="50" r="18" fill="none" stroke="#E98B2A" strokeWidth="2.5" className="opacity-50" />
                <line x1="35" y1="32" x2="35" y2="28" stroke="#E98B2A" strokeWidth="3" strokeLinecap="round" />
                <line x1="35" y1="68" x2="35" y2="72" stroke="#E98B2A" strokeWidth="3" strokeLinecap="round" />
                <line x1="17" y1="50" x2="13" y2="50" stroke="#E98B2A" strokeWidth="3" strokeLinecap="round" />
                <line x1="53" y1="50" x2="57" y2="50" stroke="#E98B2A" strokeWidth="3" strokeLinecap="round" />
                <line x1="22" y1="37" x2="19" y2="34" stroke="#E98B2A" strokeWidth="3" strokeLinecap="round" />
                <line x1="48" y1="63" x2="51" y2="66" stroke="#E98B2A" strokeWidth="3" strokeLinecap="round" />
                <line x1="22" y1="63" x2="19" y2="66" stroke="#E98B2A" strokeWidth="3" strokeLinecap="round" />
                <line x1="48" y1="37" x2="51" y2="34" stroke="#E98B2A" strokeWidth="3" strokeLinecap="round" />
              </g>
              <g className="origin-[65px_50px] animate-spin" style={{ animationDuration: "10s", animationDirection: "reverse" }}>
                <circle cx="65" cy="50" r="12" fill="none" stroke="#D96C6C" strokeWidth="2" className="opacity-50" />
                <line x1="65" y1="38" x2="65" y2="35" stroke="#D96C6C" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="65" y1="62" x2="65" y2="65" stroke="#D96C6C" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="53" y1="50" x2="50" y2="50" stroke="#D96C6C" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="77" y1="50" x2="80" y2="50" stroke="#D96C6C" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="56" y1="41" x2="54" y2="39" stroke="#D96C6C" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="74" y1="59" x2="76" y2="61" stroke="#D96C6C" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="56" y1="59" x2="54" y2="61" stroke="#D96C6C" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="74" y1="41" x2="76" y2="39" stroke="#D96C6C" strokeWidth="2.5" strokeLinecap="round" />
              </g>
              <path d="M 35 50 Q 50 35 65 50" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" className="opacity-20" />
            </svg>
          </div>
        );
      case "research":
        return (
          <div className="relative size-24 mb-2 flex items-center justify-center select-none pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <g className="opacity-20">
                <line x1="20" y1="20" x2="50" y2="25" stroke="currentColor" strokeWidth="0.75" />
                <line x1="50" y1="25" x2="80" y2="20" stroke="currentColor" strokeWidth="0.75" />
                <circle cx="20" cy="20" r="2.5" fill="currentColor" />
                <circle cx="80" cy="20" r="2.5" fill="currentColor" />
              </g>
              <path d="M 44 25 L 44 40 L 25 75 A 6 6 0 0 0 30 83 L 70 83 A 6 6 0 0 0 75 75 L 56 40 L 56 25 Z" fill="none" stroke="currentColor" strokeWidth="1.75" className="opacity-40" />
              <path d="M 29 77 A 4 4 0 0 0 32 81 L 68 81 A 4 4 0 0 0 71 77 L 62 60 Q 50 55 38 60 Z" fill="currentColor" className="opacity-15 text-jibb-indigo" />
              <circle cx="50" cy="55" r="2.5" fill="#D96C6C" className="animate-[bounce_2s_infinite_1s]" />
              <circle cx="45" cy="45" r="2" fill="#E98B2A" className="animate-[bounce_2.5s_infinite_0.5s]" />
              <circle cx="53" cy="35" r="1.5" fill="#E98B2A" className="animate-[bounce_1.8s_infinite]" />
            </svg>
          </div>
        );
      case "incubation":
        return (
          <div className="relative size-24 mb-2 flex items-center justify-center select-none pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="45" r="35" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" className="opacity-15" />
              <circle cx="50" cy="45" r="20" fill="none" stroke="#E98B2A" strokeWidth="0.75" className="opacity-20 animate-ping" />
              <path d="M 35 45 C 35 25, 65 25, 65 45 C 65 57, 57 62, 57 70 L 43 70 C 43 62, 35 57, 35 45 Z" fill="none" stroke="currentColor" strokeWidth="1.75" className="opacity-40" />
              <rect x="44" y="70" width="12" height="3" rx="1" fill="currentColor" className="opacity-40" />
              <rect x="46" y="74" width="8" height="3" rx="1" fill="currentColor" className="opacity-40" />
              <path d="M 46 65 L 46 48 Q 50 42 50 48 Q 50 54 54 48 L 54 65" fill="none" stroke="#D96C6C" strokeWidth="2" className="opacity-80 animate-pulse" />
            </svg>
          </div>
        );
      case "strategy":
        return (
          <div className="relative size-24 mb-2 flex items-center justify-center select-none pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path d="M 10 50 L 90 50 M 50 10 L 50 90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-20" />
              <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-15" />
              <g className="origin-center animate-spin" style={{ animationDuration: "25s" }}>
                <polygon points="50,30 70,40 70,60 50,50" fill="none" stroke="#E98B2A" strokeWidth="1.25" className="opacity-60" />
                <polygon points="50,30 30,40 30,60 50,50" fill="none" stroke="#243B6B" strokeWidth="1.25" className="opacity-45" />
                <polygon points="50,30 70,40 50,50 30,40" fill="none" stroke="#D96C6C" strokeWidth="1.25" className="opacity-60" />
              </g>
            </svg>
          </div>
        );
      case "media":
        return (
          <div className="relative size-24 mb-2 flex items-center justify-center select-none pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path d="M 15 80 L 85 80 M 15 20 L 15 80" stroke="currentColor" strokeWidth="1.25" className="opacity-25" />
              <path d="M 15 70 Q 35 40 50 60 T 85 30" fill="none" stroke="#E98B2A" strokeWidth="2" strokeDasharray="150" strokeDashoffset="0" className="opacity-70" />
              <g className="animate-float">
                <path d="M 68 28 L 82 32 L 74 38 L 68 28 Z" fill="#D96C6C" />
                <path d="M 74 38 L 82 32 L 64 42 Z" fill="#D96C6C" className="opacity-70" />
              </g>
            </svg>
          </div>
        );
      case "auth":
        return (
          <div className="relative size-24 mb-2 flex items-center justify-center select-none pointer-events-none overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <line x1="15" y1="30" x2="85" y2="30" stroke="#E98B2A" strokeWidth="1.25" className="opacity-50 animate-[scan_3s_infinite_ease-in-out]" />
              <path d="M 50 15 C 65 15 80 20 80 45 C 80 65 65 80 50 85 C 35 80 20 65 20 45 C 20 20 35 15 50 15 Z" fill="none" stroke="currentColor" strokeWidth="1.75" className="opacity-45" />
              <circle cx="50" cy="45" r="3.5" fill="currentColor" className="opacity-60" />
              <path d="M 48 48 L 52 48 L 54 60 L 46 60 Z" fill="currentColor" className="opacity-60" />
            </svg>
          </div>
        );
      case "legal":
        return (
          <div className="relative size-24 mb-2 flex items-center justify-center select-none pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <rect x="25" y="15" width="50" height="70" rx="3" fill="none" stroke="currentColor" strokeWidth="1.75" className="opacity-35" />
              <line x1="35" y1="30" x2="65" y2="30" stroke="currentColor" strokeWidth="1.25" className="opacity-20" />
              <line x1="35" y1="40" x2="65" y2="40" stroke="currentColor" strokeWidth="1.25" className="opacity-30 animate-pulse" />
              <line x1="35" y1="50" x2="55" y2="50" stroke="currentColor" strokeWidth="1.25" className="opacity-20" />
              <line x1="35" y1="60" x2="60" y2="60" stroke="#E98B2A" strokeWidth="1.25" className="opacity-60" />
              <line x1="35" y1="70" x2="50" y2="70" stroke="#D96C6C" strokeWidth="1.25" className="opacity-60" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="relative size-24 mb-2 flex items-center justify-center">
            <svg className="w-full h-full animate-spin select-none pointer-events-none" style={{ animationDuration: "12s" }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke={fillHex} strokeWidth="1" className="opacity-10" />
              <circle cx="50" cy="50" r="30" fill="none" stroke={fillHex} strokeWidth="1" className="opacity-15" />
              <circle cx="50" cy="50" r="15" fill="none" stroke={fillHex} strokeWidth="1" className="opacity-20" />
              <line x1="50" y1="50" x2="50" y2="5" stroke={fillHex} strokeWidth="2" className="opacity-50" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Hourglass className={`size-8 ${textClass} animate-bounce`} />
            </div>
          </div>
        );
    }
  };

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* ============================================================
          CINEMATIC BANNER
          ============================================================ */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-jibb-gradient">
        {/* Wave pattern overlay */}
        <div aria-hidden="true" className="absolute inset-0 wave-pattern opacity-10 pointer-events-none animate-wave-slide" />
        
        {/* Ambient Glow */}
        <div 
          aria-hidden="true" 
          className={`absolute -top-40 right-[15%] w-[450px] h-[450px] ${themeClasses.glow} rounded-full blur-[110px] pointer-events-none`} 
        />

        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className={`size-3.5 ${themeClasses.text} animate-soft-pulse`} />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              {sectionName}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            {title}
          </h1>
          
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </section>

      {/* ============================================================
          COMING SOON DETAILS SHOWCASE
          ============================================================ */}
      <section className="py-20 md:py-28 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-4xl text-center space-y-12">
          
          <div className="grid md:grid-cols-12 gap-8 items-stretch">
            {/* Left side: Curved Glassmorphic Card (Hourglass/Radar Illustration) */}
            <div className={`md:col-span-7 relative rounded-3xl p-8 sm:p-12 bg-card border border-border/80 shadow-jibb-lg overflow-hidden flex flex-col items-center justify-center gap-6 group transition-all duration-300 ${themeClasses.accentGlow}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              
              {renderIllustration(illustrationType)}

              <div className="space-y-3 max-w-md">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                  Curating Premium Content
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We are actively building this section to include bilateral data frameworks, high-resolution strategic case studies, and corporate listings for the Tokyo–Noida industrial axis.
                </p>
              </div>

              <div className="border-t border-border/60 w-full pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button variant="accent" className="w-full font-bold gap-1.5 shadow-md">
                    Inquire Advisory <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/membership" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full font-semibold">
                    Join JIBB Network
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side: Newsletter Capture & Related Links (Col 5) */}
            <div className="md:col-span-5 flex flex-col gap-6">
              {/* Notification Form Card */}
              <div 
                className={`relative rounded-3xl p-6 bg-card border border-border/80 shadow-jibb flex flex-col justify-center text-left ${shouldShake ? "animate-shake" : ""}`}
              >
                <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-2">
                  <Mail className={`size-4.5 ${themeClasses.text}`} />
                  Get Launch Updates
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Subscribe to receive notifications when the bilateral {sectionName} dashboard launches.
                </p>

                {isSuccess ? (
                  <div className="space-y-2 text-center py-4">
                    <CheckCircle className="size-10 text-emerald-500 mx-auto animate-bounce" />
                    <span className="text-xs font-bold text-foreground block">Subscription Confirmed!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    {/* Honeypot field (hidden from users, visible to bots) */}
                    <div className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0 overflow-hidden">
                      <label htmlFor="comingsoon-website-url">Leave this field blank</label>
                      <input
                        id="comingsoon-website-url"
                        type="text"
                        name="honeypot"
                        tabIndex={-1}
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        autoComplete="off"
                      />
                    </div>

                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="business@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 text-xs h-10 pr-4 pl-9 focus-visible:ring-jibb-orange"
                      />
                      <Mail className="absolute left-3 top-3 size-4 text-white/30" />
                    </div>
                    <AnimatedButton
                      type="submit"
                      variant="accent"
                      className="w-full h-10 text-xs font-bold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Subscribing..." : "Notify Me"}
                    </AnimatedButton>
                  </form>
                )}
              </div>

              {/* Related Resources Card */}
              <div className="rounded-3xl p-6 bg-card border border-border/80 shadow-jibb text-left flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                    Related Content
                  </h3>
                  <div className="space-y-2.5">
                    {relatedLinks.map((link, idx) => (
                      <Link 
                        key={idx}
                        href={link.href}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all text-xs font-semibold text-foreground/80 hover:text-foreground"
                      >
                        {link.label}
                        <ExternalLink className="size-3 text-white/30" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
