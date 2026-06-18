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

  // Tab State for Scheduler: "consultation" | "inquiry"
  const [activeTab, setActiveTab] = useState<"consultation" | "inquiry">("consultation");

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
      const result = await submitMembershipApplication(form);
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
            <div className="group relative rounded-3xl p-6 md:p-8 bg-slate-500/[0.02] border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[380px]">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wide">
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
                    <span className="text-slate-400 dark:text-slate-300 font-bold">✓</span> Intelligence Newsletter Only
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-slate-400 dark:text-slate-300 font-bold">✓</span> 10% Business Matching Discount
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-slate-400 dark:text-slate-300 font-bold">✓</span> 2.5% Exhibition/Event Support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-slate-400 dark:text-slate-300 font-bold">✓</span> Japan Meeting Delegations
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <a href="#scheduler" className="block" onClick={() => setForm(prev => ({ ...prev, membershipTier: "silver" }))}>
                  <AnimatedButton variant="outline" className="w-full font-semibold border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">Inquire Plan</AnimatedButton>
                </a>
              </div>
            </div>

            {/* Gold Member - Recommended */}
            <div className="group relative rounded-3xl p-6 md:p-8 bg-amber-500/[0.08] text-foreground border-2 border-amber-500 dark:border-amber-400 shadow-xl scale-105 transition-all duration-300 text-left flex flex-col justify-between min-h-[380px]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Popular Choice
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                    Gold Member
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mt-3 tracking-tight flex items-center gap-1.5">
                    Professional <Sparkles className="size-4 text-amber-500 fill-amber-500 stroke-none animate-pulse" />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    For scaling and full co-innovation access
                  </p>
                </div>



                <ul className="space-y-3.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold">✓</span> Limited Intelligence Access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold">✓</span> 20% Business Matching Discount
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold">✓</span> 3 Free Training Programs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold">✓</span> Active Japan Delegations
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <a href="#scheduler" className="block" onClick={() => setForm(prev => ({ ...prev, membershipTier: "gold" }))}>
                  <AnimatedButton variant="accent" className="w-full font-bold shadow-md bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-none text-white">Apply Gold</AnimatedButton>
                </a>
              </div>
            </div>

            {/* Platinum Member */}
            <div className="group relative rounded-3xl p-6 md:p-8 bg-slate-500/[0.06] border-2 border-slate-400/80 dark:border-slate-500/80 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[380px]">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 uppercase tracking-wide">
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
                  <AnimatedButton variant="outline" className="w-full font-semibold border-slate-400 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground">Partner Inquiry</AnimatedButton>
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
                onClick={() => setActiveTab("consultation")}
                className={`relative flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === "consultation"
                    ? "bg-card text-jibb-orange"
                    : "text-muted-foreground hover:bg-muted/65 hover:text-foreground"
                  }`}
              >
                <Laptop className="size-4" />
                {t("consultationTab")}
                {activeTab === "consultation" && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-jibb-orange"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("inquiry")}
                className={`relative flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === "inquiry"
                    ? "bg-card text-jibb-orange"
                    : "text-muted-foreground hover:bg-muted/65 hover:text-foreground"
                  }`}
              >
                <Server className="size-4" />
                {t("inquiryTab")}
                {activeTab === "inquiry" && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-jibb-orange"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </div>

            {/* Consultation Embed Tab — always mounted so iframe prefetches on page load */}
            {(() => {
              const embedUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || process.env.NEXT_PUBLIC_MS_BOOKINGS_URL;
              return (
                <div
                  className="flex-1 flex flex-col min-h-[700px]"
                  style={{ display: activeTab === "consultation" ? "flex" : "none" }}
                >
                  {embedUrl ? (
                    <iframe
                      src={embedUrl.includes("calendly.com") ? `${embedUrl}?hide_gdpr_banner=1&primary_color=f97316` : embedUrl}
                      title="Schedule a consultation meeting"
                      width="100%"
                      height="100%"
                      className="flex-1 min-h-[700px] border-0"
                      allow="payment"
                    />
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-10 text-center text-muted-foreground min-h-[580px]">
                      <Calendar className="size-10 opacity-30" />
                      <p className="text-sm font-medium">Consultation Scheduler is not configured yet.</p>
                      <p className="text-xs opacity-60">
                        Set <code className="bg-muted px-1.5 py-0.5 rounded text-foreground/70">NEXT_PUBLIC_CALENDLY_URL</code> or <code className="bg-muted px-1.5 py-0.5 rounded text-foreground/70">NEXT_PUBLIC_MS_BOOKINGS_URL</code> in your environment variables to enable the embed.
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Membership Inquiry Form Tab */}
            {activeTab === "inquiry" && (
              <form onSubmit={handleSubmit} className={`p-6 sm:p-8 flex-1 flex flex-col justify-between gap-8 ${shouldShake ? "animate-shake" : ""}`}>
                <div className="max-w-2xl mx-auto w-full space-y-5 text-left">
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
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Company Name</label>
                    <Input
                      type="text"
                      name="companyName"
                      placeholder="e.g. Maruti Suzuki India"
                      value={form.companyName}
                      onChange={handleInputChange}
                      className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${errors.companyName ? "border-red-500 focus-visible:ring-red-500" : ""
                        }`}
                    />
                    {errors.companyName && <span className="text-[10px] text-red-500 font-semibold">{errors.companyName}</span>}
                  </div>

                  {/* Contact Person Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Contact Person Name</label>
                    <Input
                      type="text"
                      name="contactPerson"
                      placeholder="e.g. Kenichi Ayukawa"
                      value={form.contactPerson}
                      onChange={handleInputChange}
                      className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${errors.contactPerson ? "border-red-500 focus-visible:ring-red-500" : ""
                        }`}
                    />
                    {errors.contactPerson && <span className="text-[10px] text-red-500 font-semibold">{errors.contactPerson}</span>}
                  </div>

                  {/* Corporate Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Corporate Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="e.g. executive@company.com"
                      value={form.email}
                      onChange={handleInputChange}
                      className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                        }`}
                    />
                    {errors.email && <span className="text-[10px] text-red-500 font-semibold">{errors.email}</span>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Phone Number</label>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="e.g. +91 98765 43210"
                      value={form.phone}
                      onChange={handleInputChange}
                      className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""
                        }`}
                    />
                    {errors.phone && <span className="text-[10px] text-red-500 font-semibold">{errors.phone}</span>}
                  </div>

                  {/* Industry & Company Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Industry</label>
                      <Input
                        type="text"
                        name="industry"
                        placeholder="e.g. Semiconductors"
                        value={form.industry}
                        onChange={handleInputChange}
                        className="focus-visible:ring-jibb-orange rounded-xl h-11 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Company Size</label>
                      <Input
                        type="text"
                        name="companySize"
                        placeholder="e.g. 50-200"
                        value={form.companySize}
                        onChange={handleInputChange}
                        className="focus-visible:ring-jibb-orange rounded-xl h-11 text-sm"
                      />
                    </div>
                  </div>

                  {/* Objectives / Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">Objectives & Special Requests</label>
                    <textarea
                      name="message"
                      placeholder="Tell us about your bilateral objectives or special requests..."
                      value={form.message}
                      onChange={handleInputChange}
                      className="flex min-h-[120px] w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jibb-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Confirm Actions */}
                <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto w-full">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="size-4 text-jibb-orange" />
                    <span>Our membership team will contact you within 24-48 business hours</span>
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
