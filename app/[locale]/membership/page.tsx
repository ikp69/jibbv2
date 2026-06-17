"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { Input } from "@/components/ui/input";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { FeatureComparison } from "@/components/sections/FeatureComparison";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { MemberBenefits } from "@/components/sections/MemberBenefits";
import { motion } from "framer-motion";
import {
  Users, Award, ShieldCheck, Calendar, Clock, Globe, ArrowRight, CheckCircle,
  MapPin, ClipboardList, Lightbulb, Sparkles, Server, Laptop, BookOpen
} from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";

import { submitMembershipApplication } from "@/app/actions/membership";
import { isValidPhone, PHONE_ERROR } from "@/app/lib/validation/phone";

export default function MembershipPage() {
  const t = useTranslations("membershipPage");

  // Tab State for Scheduler: "calendly" | "ms-bookings" | "bookings"
  const [activeTab, setActiveTab] = useState<"calendly" | "ms-bookings" | "bookings">("calendly");

  // Active Selected Date and Time
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Booking Form State
  const [form, setForm] = useState({
    membershipTier: "associate" as "associate" | "silver" | "gold" | "platinum",
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    industry: "",
    companySize: "",
    message: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  // Dynamically generate the next 5 available weekdays from today
  const dates = (() => {
    const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const results: { label: string; value: string }[] = [];
    const cursor = new Date();
    // Start from tomorrow to avoid partial-day issues
    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(0, 0, 0, 0);

    while (results.length < 5) {
      const dow = cursor.getDay();
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dow !== 0 && dow !== 6) {
        const yyyy = cursor.getFullYear();
        const mm = String(cursor.getMonth() + 1).padStart(2, "0");
        const dd = String(cursor.getDate()).padStart(2, "0");
        results.push({
          label: `${DAY_NAMES[dow]}, ${MONTH_NAMES[cursor.getMonth()]} ${cursor.getDate()}`,
          value: `${yyyy}-${mm}-${dd}`,
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return results;
  })();

  const times = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

  function handleDateSelect(dateVal: string) {
    setSelectedDate(dateVal);
    setSelectedTime(null); // Reset time when date changes
  }

  function handleTimeSelect(timeVal: string) {
    setSelectedTime(timeVal);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const c = { ...prev };
        delete c[name];
        return c;
      });
    }
  }

  function validate() {
    const tempErrors: Record<string, string> = {};
    if (!selectedDate) tempErrors.date = "Please select a date";
    if (!selectedTime) tempErrors.time = "Please select a time slot";
    if (!form.companyName.trim()) tempErrors.companyName = "Company name is required";
    if (!form.contactPerson.trim()) tempErrors.contactPerson = "Contact person name is required";
    if (!form.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!isValidPhone(form.phone)) {
      tempErrors.phone = PHONE_ERROR;
    }
    if (!form.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      tempErrors.email = "Invalid email format";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepend selected date/time details to the application message
      const enrichedMessage = `[Requested Meeting: ${selectedDate} at ${selectedTime}]\n\n${form.message}`;
      const payload = {
        ...form,
        message: enrichedMessage,
      };

      const result = await submitMembershipApplication(payload);
      if (result.success) {
        setIsSuccess(true);
        setForm({
          membershipTier: "associate",
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          industry: "",
          companySize: "",
          message: "",
          honeypot: "",
        });
        setSelectedDate(null);
        setSelectedTime(null);
      } else {
        alert(result.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* ============================================================
          CINEMATIC HERO
          ============================================================ */}
      <PageHero className="py-20 lg:py-28" bgText="MEMBERS">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              Ecosystem Enrollment
            </span>
          </div>

          <AnimatedHeading
            text={t("title")}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
            immediate
          />

          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="flex justify-center gap-3 pt-4">
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-jibb-orange">
              Join the Bureau
            </span>
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
          </div>
        </div>
      </PageHero>

      {/* ============================================================
          MEMBERSHIP PLANS TIERS
          ============================================================ */}
      <section className="py-20 md:py-28 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-[96rem] mx-auto px-4 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Select Your Membership Plan
            </h2>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <ScrollReveal staggerChildren={0.12} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Associate Member */}
            <div className="group relative rounded-3xl p-6 md:p-8 bg-card border border-border/60 hover:border-blue-500/30 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[380px]">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    Associate Member
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mt-3 tracking-tight">
                    Entry Level
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    For early-stage teams and networking
                  </p>
                </div>



                <ul className="space-y-3.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500 font-bold">✓</span> 5% Business Matching Discount
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500 font-bold">✓</span> 5% Training Program Discount
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500 font-bold">✓</span> Standard Portal Directory Access
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <a href="#scheduler" className="block" onClick={() => setForm(prev => ({ ...prev, membershipTier: "associate" }))}>
                  <AnimatedButton variant="outline" className="w-full font-semibold border-blue-500/20 hover:bg-blue-500/5 hover:text-blue-500">Inquire Plan</AnimatedButton>
                </a>
              </div>
            </div>

            {/* Silver Member */}
            <div className="group relative rounded-3xl p-6 md:p-8 bg-card border border-border/60 hover:border-orange-500/30 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[380px]">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                    Silver Member
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mt-3 tracking-tight">
                    Standard Growth
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    For active research and matching support
                  </p>
                </div>



                <ul className="space-y-3.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-orange-500 font-bold">✓</span> Intelligence Newsletter Only
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-500 font-bold">✓</span> 10% Business Matching Discount
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-500 font-bold">✓</span> 2.5% Exhibition/Event Support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-500 font-bold">✓</span> Japan Meeting Delegations
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <a href="#scheduler" className="block" onClick={() => setForm(prev => ({ ...prev, membershipTier: "silver" }))}>
                  <AnimatedButton variant="outline" className="w-full font-semibold border-orange-500/20 hover:bg-orange-500/5 hover:text-orange-500">Inquire Plan</AnimatedButton>
                </a>
              </div>
            </div>

            {/* Gold Member - Recommended */}
            <div className="group relative rounded-3xl p-6 md:p-8 bg-jibb-indigo/10 text-foreground border-2 border-jibb-indigo shadow-lg scale-105 transition-all duration-300 text-left flex flex-col justify-between min-h-[380px]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-jibb-indigo text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Popular Choice
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-jibb-indigo/20 text-jibb-indigo dark:text-jibb-indigo-light uppercase tracking-wide">
                    Gold Member
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mt-3 tracking-tight flex items-center gap-1.5">
                    Professional <Sparkles className="size-4 text-jibb-indigo fill-jibb-indigo stroke-none animate-pulse" />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    For scaling and full co-innovation access
                  </p>
                </div>



                <ul className="space-y-3.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-jibb-indigo font-bold">✓</span> Limited Intelligence Access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-jibb-indigo font-bold">✓</span> 20% Business Matching Discount
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-jibb-indigo font-bold">✓</span> 3 Free Training Programs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-jibb-indigo font-bold">✓</span> Active Japan Delegations
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <a href="#scheduler" className="block" onClick={() => setForm(prev => ({ ...prev, membershipTier: "gold" }))}>
                  <AnimatedButton variant="accent" className="w-full font-bold shadow-md bg-jibb-indigo hover:bg-jibb-indigo-dark border-none text-white">Apply Gold</AnimatedButton>
                </a>
              </div>
            </div>

            {/* Platinum Member */}
            <div className="group relative rounded-3xl p-6 md:p-8 bg-card border border-border/60 hover:border-slate-500/30 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[380px]">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-500/10 text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Platinum Member
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mt-3 tracking-tight">
                    Ultimate Access
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    For institutional and leadership scale
                  </p>
                </div>



                <ul className="space-y-3.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-slate-500 font-bold">✓</span> Full intelligence access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-slate-500 font-bold">✓</span> 30% Business Matching Discount
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-slate-500 font-bold">✓</span> 7 Free Training Programs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-slate-500 font-bold">✓</span> Selected Collaboration & Advocacy
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <a href="#scheduler" className="block" onClick={() => setForm(prev => ({ ...prev, membershipTier: "platinum" }))}>
                  <AnimatedButton variant="outline" className="w-full font-semibold border-slate-500/20 hover:bg-slate-500/5 hover:text-slate-500">Partner Inquiry</AnimatedButton>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <MemberBenefits />

      <ComparisonTable />

      <FeatureComparison />

      <TestimonialCarousel />

      {/* ============================================================
          INTERACTIVE MEETING SCHEDULER WIDGET
          ============================================================ */}
      <section id="scheduler" className="py-20 md:py-28 bg-background scroll-mt-20">
        <div className="section-container max-w-4xl space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
              <Calendar className="size-3.5 text-primary" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-primary">Scheduler</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              {t("schedulerTitle")}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {t("schedulerSubtitle")}
            </p>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <div className="relative rounded-3xl border border-border shadow-jibb-lg overflow-hidden bg-card flex flex-col min-h-[580px]">
            {/* Success Overlay */}
            {isSuccess && (
              <div className="absolute inset-0 bg-card/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
                <CheckCircle className="size-16 text-emerald-500 mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {t("bookingSuccessTitle")}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                  {t("bookingSuccessDesc")}
                </p>
                <AnimatedButton variant="outline" className="mt-6" onClick={() => setIsSuccess(false)}>
                  Schedule Another Meeting
                </AnimatedButton>
              </div>
            )}

            {/* Scheduler Tabs Header */}
            <div className="flex border-b border-border bg-muted/40 select-none relative">
              <button
                type="button"
                onClick={() => { setActiveTab("calendly"); setSelectedDate(null); setSelectedTime(null); }}
                className={`relative flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === "calendly"
                    ? "bg-card text-jibb-orange"
                    : "text-muted-foreground hover:bg-muted/65 hover:text-foreground"
                  }`}
              >
                <Laptop className="size-4" />
                {t("calendlyTab")}
                {activeTab === "calendly" && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-jibb-orange"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("ms-bookings"); setSelectedDate(null); setSelectedTime(null); }}
                className={`relative flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === "ms-bookings"
                    ? "bg-card text-jibb-orange"
                    : "text-muted-foreground hover:bg-muted/65 hover:text-foreground"
                  }`}
              >
                <BookOpen className="size-4" />
                MS Bookings
                {activeTab === "ms-bookings" && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-jibb-orange"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("bookings"); setSelectedDate(null); setSelectedTime(null); }}
                className={`relative flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === "bookings"
                    ? "bg-card text-jibb-orange"
                    : "text-muted-foreground hover:bg-muted/65 hover:text-foreground"
                  }`}
              >
                <Server className="size-4" />
                {t("bookingsTab")}
                {activeTab === "bookings" && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-jibb-orange"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </div>

            {/* Calendly Embed Tab */}
            {activeTab === "calendly" && (
              <div className="flex-1 flex flex-col min-h-[580px]">
                {process.env.NEXT_PUBLIC_CALENDLY_URL ? (
                  <iframe
                    src={`${process.env.NEXT_PUBLIC_CALENDLY_URL}?hide_gdpr_banner=1&primary_color=f97316`}
                    title="Schedule a meeting via Calendly"
                    width="100%"
                    height="100%"
                    className="flex-1 min-h-[580px] border-0"
                    allow="payment"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 p-10 text-center text-muted-foreground min-h-[580px]">
                    <Calendar className="size-10 opacity-30" />
                    <p className="text-sm font-medium">Calendly is not configured yet.</p>
                    <p className="text-xs opacity-60">
                      Set <code className="bg-muted px-1.5 py-0.5 rounded text-foreground/70">NEXT_PUBLIC_CALENDLY_URL</code> in your environment variables to enable the Calendly embed.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* MS Bookings Embed Tab */}
            {activeTab === "ms-bookings" && (
              <div className="flex-1 flex flex-col min-h-[580px]">
                {process.env.NEXT_PUBLIC_MS_BOOKINGS_URL ? (
                  <iframe
                    src={process.env.NEXT_PUBLIC_MS_BOOKINGS_URL}
                    title="Schedule a meeting via Microsoft Bookings"
                    width="100%"
                    height="100%"
                    className="flex-1 min-h-[580px] border-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 p-10 text-center text-muted-foreground min-h-[580px]">
                    <BookOpen className="size-10 opacity-30" />
                    <p className="text-sm font-medium">Microsoft Bookings is not configured yet.</p>
                    <p className="text-xs opacity-60">
                      Set <code className="bg-muted px-1.5 py-0.5 rounded text-foreground/70">NEXT_PUBLIC_MS_BOOKINGS_URL</code> in your environment variables to enable the MS Bookings embed.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Bookings Form Tab */}
            {activeTab === "bookings" && (
            <form onSubmit={handleSubmit} className={`p-6 sm:p-8 flex-1 flex flex-col justify-between gap-8 ${shouldShake ? "animate-shake" : ""}`}>
              <div className="grid md:grid-cols-2 gap-8 items-start">

                {/* Column 1: Date & Time Picker */}
                <div className="space-y-6 text-left">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                      1. Select a Date
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {dates.map((dt) => (
                        <motion.button
                          whileHover={{ scale: 1.03, y: -1 }}
                          whileTap={{ scale: 0.97 }}
                          key={dt.value}
                          type="button"
                          onClick={() => handleDateSelect(dt.value)}
                          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${selectedDate === dt.value
                              ? "bg-primary text-primary-foreground border-primary shadow-md font-bold"
                              : "bg-card border-border/60 text-foreground/80 hover:bg-muted"
                            }`}
                        >
                          {dt.label}
                        </motion.button>
                      ))}
                    </div>
                    {errors.date && <span className="text-[10px] text-red-500 font-semibold">{errors.date}</span>}
                  </div>

                  {selectedDate && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                        2. {t("selectTime")}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {times.map((tm) => (
                          <motion.button
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            key={tm}
                            type="button"
                            onClick={() => handleTimeSelect(tm)}
                            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${selectedTime === tm
                                ? "bg-jibb-orange text-white border-jibb-orange shadow-md font-bold"
                                : "bg-card border-border/60 text-foreground/80 hover:bg-muted"
                              }`}
                          >
                            {tm}
                          </motion.button>
                        ))}
                      </div>
                      {errors.time && <span className="text-[10px] text-red-500 font-semibold">{errors.time}</span>}
                    </div>
                  )}
                </div>

                 {/* Column 2: Personal Details */}
                 <div className="space-y-4 text-left">
                   <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                     3. {t("bookingDetailsTitle")}
                   </label>

                   {/* Honeypot field (hidden from users, visible to bots) */}
                   <div className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0 overflow-hidden">
                     <label htmlFor="membership-website-url">Leave this field blank</label>
                     <input
                       id="membership-website-url"
                       type="text"
                       name="honeypot"
                       tabIndex={-1}
                       value={form.honeypot}
                       onChange={handleInputChange}
                       autoComplete="off"
                     />
                   </div>

                   {/* Tier Select */}
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                       Membership Tier
                     </label>
                     <select
                       name="membershipTier"
                       value={form.membershipTier}
                       onChange={handleInputChange}
                       className="flex h-11 w-full rounded-xl border border-input bg-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-jibb-orange/20 focus:border-jibb-orange transition-all duration-200"
                     >
                       <option value="associate">Associate Member</option>
                       <option value="silver">Silver Member</option>
                       <option value="gold">Gold Member</option>
                       <option value="platinum">Platinum Member</option>
                     </select>
                   </div>

                   {/* Company Name */}
                   <div className="space-y-1.5">
                     <Input
                       type="text"
                       name="companyName"
                       placeholder="Company Name"
                       value={form.companyName}
                       onChange={handleInputChange}
                       className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${errors.companyName ? "border-red-500 focus-visible:ring-red-500" : ""
                         }`}
                     />
                     {errors.companyName && <span className="text-[10px] text-red-500 font-semibold">{errors.companyName}</span>}
                   </div>

                   {/* Contact Person Name */}
                   <div className="space-y-1.5">
                     <Input
                       type="text"
                       name="contactPerson"
                       placeholder="Contact Person Name"
                       value={form.contactPerson}
                       onChange={handleInputChange}
                       className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${errors.contactPerson ? "border-red-500 focus-visible:ring-red-500" : ""
                         }`}
                     />
                     {errors.contactPerson && <span className="text-[10px] text-red-500 font-semibold">{errors.contactPerson}</span>}
                   </div>

                   {/* Phone */}
                   <div className="space-y-1.5">
                     <Input
                       type="tel"
                       name="phone"
                       placeholder="Phone Number"
                       value={form.phone}
                       onChange={handleInputChange}
                       className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""
                         }`}
                     />
                     {errors.phone && <span className="text-[10px] text-red-500 font-semibold">{errors.phone}</span>}
                   </div>

                   {/* Email */}
                   <div className="space-y-1.5">
                     <Input
                       type="email"
                       name="email"
                       placeholder="Corporate Email Address"
                       value={form.email}
                       onChange={handleInputChange}
                       className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                         }`}
                     />
                     {errors.email && <span className="text-[10px] text-red-500 font-semibold">{errors.email}</span>}
                   </div>

                   {/* Industry & Size */}
                   <div className="grid grid-cols-2 gap-2">
                     <Input
                       type="text"
                       name="industry"
                       placeholder="Industry (e.g. Semiconductors)"
                       value={form.industry}
                       onChange={handleInputChange}
                       className="focus-visible:ring-jibb-orange rounded-xl h-11 text-sm"
                     />
                     <Input
                       type="text"
                       name="companySize"
                       placeholder="Company Size (e.g. 50-200)"
                       value={form.companySize}
                       onChange={handleInputChange}
                       className="focus-visible:ring-jibb-orange rounded-xl h-11 text-sm"
                     />
                   </div>

                   {/* Message */}
                   <div className="space-y-1.5">
                     <textarea
                       name="message"
                       placeholder="Tell us about your bilateral objectives or special requests..."
                       value={form.message}
                       onChange={handleInputChange}
                       className="flex min-h-[90px] w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jibb-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                     />
                   </div>
                 </div>

              </div>

              {/* Confirm Actions */}
              <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-4 text-jibb-orange" />
                  <span>30 Minutes Advisory call • Zoom Meeting link provided after confirmation</span>
                </div>
                <AnimatedButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 h-11 bg-jibb-orange text-white font-bold rounded-xl shadow-md text-sm shrink-0"
                >
                  {isSubmitting ? "Processing..." : t("bookBtn")}
                </AnimatedButton>
              </div>
            </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
