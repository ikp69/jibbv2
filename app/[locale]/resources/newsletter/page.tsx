"use client";

import { useState, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PageHero } from "@/components/sections/PageHero";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import {
  Mail, Sparkles, AlertCircle, CheckCircle, Send, ArrowRight,
  Library, Info, ExternalLink, Newspaper, Calendar, ShieldCheck,
  TrendingUp, Cpu, User, Users
} from "lucide-react";

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

export default function NewsletterPage() {
  const t = useTranslations("newsletterPage");
  const tContact = useTranslations("contactPage");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [generalError, setGeneralError] = useState<ReactNode | null>(null);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  function validate() {
    let isValid = true;
    
    if (!name.trim()) {
      setNameError(t("form.nameError"));
      isValid = false;
    } else {
      setNameError("");
    }

    if (!email.trim()) {
      setEmailError(t("form.emailError"));
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(t("form.emailFormatError"));
      isValid = false;
    } else {
      setEmailError("");
    }

    return isValid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setGeneralError(null);
    setAlreadySubscribed(false);

    try {
      const response = await subscribeToNewsletter({
        name,
        email,
        source: "newsletter_page",
        honeypot,
      });

      if (response.success) {
        if (response.alreadySubscribed) {
          setAlreadySubscribed(true);
        } else {
          setIsSuccess(true);
          setName("");
          setEmail("");
          setHoneypot("");
          setTimeout(() => {
            setIsSuccess(false);
          }, 7000);
        }
      } else {
        if (response.error === "email_failed") {
          setGeneralError(
            <span>
              {t("form.emailErrorText")}{" "}
              <a href="mailto:hitesh@npo-jibb.org" className="underline font-bold hover:opacity-85 transition-opacity">
                hitesh@npo-jibb.org
              </a>
            </span>
          );
        } else {
          setGeneralError(response.error || t("form.errorGeneric"));
        }
      }
    } catch (err) {
      console.error(err);
      setGeneralError(t("form.errorConnection"));
    } finally {
      setIsSubmitting(false);
    }
  }

  // Value props with custom icon component references and color variables
  const benefits = [
    { 
      title: t("features.item1Title"), 
      desc: t("features.item1Desc"),
      icon: TrendingUp,
      iconColor: "text-jibb-orange",
      hoverBg: "group-hover:bg-jibb-orange"
    },
    { 
      title: t("features.item2Title"), 
      desc: t("features.item2Desc"),
      icon: Cpu,
      iconColor: "text-jibb-indigo",
      hoverBg: "group-hover:bg-jibb-indigo"
    },
    { 
      title: t("features.item3Title"), 
      desc: t("features.item3Desc"),
      icon: Sparkles,
      iconColor: "text-jibb-sakura",
      hoverBg: "group-hover:bg-jibb-sakura"
    },
  ];

  // Past archives
  const archives = [
    { num: "14", title: t("archives.issue14Title"), desc: t("archives.issue14Desc"), date: "June 2026" },
    { num: "13", title: t("archives.issue13Title"), desc: t("archives.issue13Desc"), date: "May 2026" },
    { num: "12", title: t("archives.issue12Title"), desc: t("archives.issue12Desc"), date: "May 2026" },
  ];

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* ============================================================
          CINEMATIC HERO
          ============================================================ */}
      <PageHero className="py-20 lg:py-28" bgText="NEWSLETTER">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              {t("hero.badge")}
            </span>
          </div>

          <AnimatedHeading
            text={t("hero.title")}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
            immediate
          />

          <p className="text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex justify-center gap-3 pt-4">
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-jibb-orange">
              Weekly Bulletin
            </span>
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
          </div>
        </div>
      </PageHero>

      {/* ============================================================
          SUBSCRIPTION FORM & FEATURES GRID
          ============================================================ */}
      <section className="py-20 bg-jibb-gradient-subtle">
        <div className="section-container max-w-5xl">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Subscription Form (Col span 7) */}
            <ScrollReveal direction="left" className="lg:col-span-7 space-y-6 relative">
              <div className="relative rounded-3xl p-6 sm:p-8 bg-card border border-border/80 shadow-jibb-lg overflow-hidden text-left">
                {/* Success Screen Overlay */}
                {isSuccess && (
                  <div className="absolute inset-0 bg-card/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
                    <CheckCircle className="size-16 text-emerald-500 mb-4 animate-bounce" />
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {t("form.successTitle")}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      {t("form.successDesc")}
                    </p>
                    <AnimatedButton variant="outline" className="mt-6" onClick={() => setIsSuccess(false)}>
                      {t("form.okay")}
                    </AnimatedButton>
                  </div>
                )}

                {/* Already Subscribed Overlay */}
                {alreadySubscribed && (
                  <div className="absolute inset-0 bg-card/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
                    <ShieldCheck className="size-16 text-amber-500 mb-4 animate-[pulse_2s_infinite]" />
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {t("form.alreadySubscribedTitle")}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      {t("form.alreadySubscribedDesc")}
                    </p>
                    <AnimatedButton variant="outline" className="mt-6" onClick={() => setAlreadySubscribed(false)}>
                      {t("form.close")}
                    </AnimatedButton>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-foreground tracking-tight">
                  {t("form.title")}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-6 flex items-center gap-1.5 leading-relaxed">
                  <Users className="size-4 text-jibb-orange shrink-0 animate-soft-pulse" />
                  <span>{t("form.ctaText")}</span>
                </p>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot field (hidden from users, visible to bots) */}
                  <div className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0 overflow-hidden">
                    <label htmlFor="newsletter-website-url">{tContact("form.honeypotLabel")}</label>
                    <input
                      id="newsletter-website-url"
                      type="text"
                      name="honeypot"
                      tabIndex={-1}
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      autoComplete="off"
                    />
                  </div>

                  {/* General Error Banner */}
                  {generalError && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-500" />
                      <div className="space-y-1">
                        <p className="font-semibold text-red-700 dark:text-red-400">{t("form.errorTitle")}</p>
                        <div className="text-xs text-red-600/90 dark:text-red-400/95 leading-relaxed">
                          {generalError}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                      {t("form.nameLabel")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (nameError) setNameError("");
                        }}
                        className={`focus-visible:ring-jibb-orange rounded-xl h-11 pl-11 text-sm ${nameError ? "border-red-500 focus-visible:ring-red-500" : ""
                          }`}
                        placeholder={t("form.namePlaceholder")}
                      />
                      <User className="size-4.5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {nameError && <span className="text-[10px] text-red-500 font-semibold">{nameError}</span>}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                      {t("form.emailLabel")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                        className={`focus-visible:ring-jibb-orange rounded-xl h-11 pl-11 text-sm ${emailError ? "border-red-500 focus-visible:ring-red-500" : ""
                          }`}
                        placeholder={t("form.emailPlaceholder")}
                      />
                      <Mail className="size-4.5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {emailError && <span className="text-[10px] text-red-500 font-semibold">{emailError}</span>}
                  </div>

                  <div className="pt-3">
                    <AnimatedButton
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 bg-jibb-orange text-white font-bold rounded-xl shadow-lg text-sm flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? t("form.submitting") : t("form.submitButton")}
                      <Send className="size-4" />
                    </AnimatedButton>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1.5 justify-center">
                    <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
                    <span>{t("form.secureNotice")}</span>
                  </div>
                </form>
              </div>

              {/* LinkedIn Follow Section */}
              <div className="rounded-3xl p-6 bg-card border border-border/88 shadow-jibb-md text-left flex flex-col gap-6 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 shadow-md">
                      <LinkedinIcon className="size-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-foreground">
                        {t("form.linkedinFollow")}
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {t("form.linkedinText")}
                      </p>
                    </div>
                  </div>
                  
                  <a
                    href="https://linkedin.com/company/japan-india-business-bureau"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto shrink-0"
                  >
                    <AnimatedButton
                      type="button"
                      size="sm"
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-md"
                    >
                      <span>{t("form.followUs")}</span>
                      <ExternalLink className="size-3.5" />
                    </AnimatedButton>
                  </a>
                </div>

                {/* Divider inside LinkedIn card */}
                <div className="border-t border-border/50 relative z-10" />

                {/* What we share list */}
                <div className="space-y-3 relative z-10">
                  <h5 className="text-[10px] font-bold text-foreground/80 uppercase tracking-wider">
                    {t("form.linkedinTopicTitle")}
                  </h5>
                  <ul className="space-y-2.5 text-[11px] text-muted-foreground">
                    <li className="flex items-start gap-2 leading-relaxed">
                      <CheckCircle className="size-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span>{t("form.linkedinTopic1")}</span>
                    </li>
                    <li className="flex items-start gap-2 leading-relaxed">
                      <CheckCircle className="size-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span>{t("form.linkedinTopic2")}</span>
                    </li>
                    <li className="flex items-start gap-2 leading-relaxed">
                      <CheckCircle className="size-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span>{t("form.linkedinTopic3")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Column: Subscriber Benefits & Membership CTA (Col span 5) */}
            <ScrollReveal staggerChildren={0.15} className="lg:col-span-5 text-left">
              <div className="space-y-4">
                {benefits.map((benefit, idx) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div
                      key={idx}
                      className="group relative rounded-2xl p-6 bg-card border border-border shadow-jibb hover:border-primary/20 hover:shadow-jibb-md transition-all duration-300 overflow-hidden flex flex-col gap-2 cursor-default"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none animate-glow-pulse" />
                      <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-xl bg-primary/5 ${benefit.hoverBg} shrink-0 transition-colors duration-300`}>
                          <IconComponent className={`size-5 ${benefit.iconColor} group-hover:text-white transition-colors duration-300`} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground transition-colors duration-300">
                            {benefit.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                            {benefit.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Membership CTA Card */}
                <div className="relative rounded-2xl p-6 bg-gradient-to-br from-jibb-indigo/10 via-card to-jibb-orange/5 border border-jibb-indigo/20 shadow-jibb overflow-hidden flex flex-col gap-4">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-jibb-indigo/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-jibb-indigo/15 text-jibb-indigo dark:text-jibb-indigo-light text-[9px] font-extrabold uppercase tracking-wider">
                        Premium Access
                      </span>
                      <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse shrink-0" />
                    </div>
                    <h4 className="text-sm font-bold text-foreground tracking-tight pt-1">
                      {t("membershipCTA.title")}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t("membershipCTA.subtitle")}
                    </p>
                  </div>
                  
                  <a href="/membership" className="w-full relative z-10">
                    <AnimatedButton
                      type="button"
                      variant="accent"
                      className="w-full py-2.5 font-bold flex items-center justify-center gap-2 shadow-jibb-orange-glow text-xs"
                    >
                      <span>{t("membershipCTA.button")}</span>
                      <ArrowRight className="size-3.5" />
                    </AnimatedButton>
                  </a>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Membership section removed and combined into grid above */}

      {/* ============================================================
          PAST ARCHIVES CATALOG
          ============================================================ */}
      <section className="py-20 bg-background border-t border-border/30">
        <div className="section-container max-w-5xl">
          <div className="space-y-4 text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight animate-soft-pulse">
              {t("archives.title")}
            </h2>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              {t("archives.subtitle")}
            </p>
          </div>

          <ScrollReveal staggerChildren={0.1} className="grid md:grid-cols-3 gap-6 text-left">
            {archives.map((issue, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl p-6 bg-card border border-border shadow-jibb hover:border-primary/20 hover:shadow-jibb-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10">
                      <Calendar className="size-3" /> {issue.date}
                    </span>
                    <span className="font-mono text-jibb-orange">#{issue.num}</span>
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-2">
                    {issue.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                    {issue.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-border/40 flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-primary flex items-center gap-1 group-hover:gap-1.5 transition-all">
                    {t("form.previewIssue")} <ArrowRight className="size-3" />
                  </span>
                  <Library className="size-3.5 text-jibb-orange opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
