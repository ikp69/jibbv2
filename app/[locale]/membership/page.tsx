"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Users, Award, ShieldCheck, Calendar, Clock, Globe, ArrowRight, CheckCircle, 
  MapPin, ClipboardList, Lightbulb, Sparkles, Server, Laptop 
} from "lucide-react";

export default function MembershipPage() {
  const t = useTranslations("membershipPage");

  // Tab State for Scheduler: "calendly" or "bookings"
  const [activeTab, setActiveTab] = useState<"calendly" | "bookings">("calendly");

  // Active Selected Date and Time
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Booking Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    purpose: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const dates = [
    { label: "Mon, Jun 1", value: "2026-06-01" },
    { label: "Tue, Jun 2", value: "2026-06-02" },
    { label: "Wed, Jun 3", value: "2026-06-03" },
    { label: "Thu, Jun 4", value: "2026-06-04" },
    { label: "Fri, Jun 5", value: "2026-06-05" },
  ];

  const times = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

  function handleDateSelect(dateVal: string) {
    setSelectedDate(dateVal);
    setSelectedTime(null); // Reset time when date changes
  }

  function handleTimeSelect(timeVal: string) {
    setSelectedTime(timeVal);
  }

  function validate() {
    const tempErrors: Record<string, string> = {};
    if (!selectedDate) tempErrors.date = "Please select a date";
    if (!selectedTime) tempErrors.time = "Please select a time slot";
    if (!form.name.trim()) tempErrors.name = "Name is required";
    if (!form.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      tempErrors.email = "Invalid email format";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setForm({ name: "", email: "", purpose: "" });
      setSelectedDate(null);
      setSelectedTime(null);
    }, 1200);
  }

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* ============================================================
          CINEMATIC HERO
          ============================================================ */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-jibb-gradient">
        {/* Wave pattern overlay */}
        <div aria-hidden="true" className="absolute inset-0 wave-pattern opacity-10 pointer-events-none animate-wave-slide" />
        
        {/* Ambient Glow */}
        <div aria-hidden="true" className="absolute -top-40 right-[15%] w-[450px] h-[450px] bg-jibb-orange/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              Ecosystem Enrollment
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            {t("title")}
          </h1>
          
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
      </section>

      {/* ============================================================
          MEMBERSHIP PLANS TIERS
          ============================================================ */}
      <section className="py-20 md:py-28 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-5xl text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              {t("ctaTitle")}
            </h2>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Startup Tier */}
            <div className="group relative rounded-3xl p-8 bg-card border border-border/60 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[480px]">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/5 text-primary border border-primary/10 uppercase tracking-wide">
                    Technology &amp; Scaling
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mt-2 tracking-tight">
                    {t("features.startup.title")}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("features.startup.priceSub")}
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  <span className="text-3xl font-extrabold text-foreground">{t("features.startup.price")}</span>
                </div>

                <ul className="space-y-3.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="text-jibb-orange font-bold">✓</span> {t("features.startup.feature1")}</li>
                  <li className="flex items-center gap-2"><span className="text-jibb-orange font-bold">✓</span> {t("features.startup.feature2")}</li>
                  <li className="flex items-center gap-2"><span className="text-jibb-orange font-bold">✓</span> {t("features.startup.feature3")}</li>
                  <li className="flex items-center gap-2"><span className="text-jibb-orange font-bold">✓</span> {t("benefits.visibility")}</li>
                </ul>
              </div>
              <div className="pt-6">
                <a href="#scheduler" className="block">
                  <Button variant="outline" className="w-full font-semibold">Inquire Plan</Button>
                </a>
              </div>
            </div>

            {/* Corporate Tier - Recommended */}
            <div className="group relative rounded-3xl p-8 bg-primary text-primary-foreground border border-primary shadow-xl scale-105 transition-all duration-300 text-left flex flex-col justify-between min-h-[480px]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Recommended
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-white uppercase tracking-wide">
                    Industrial &amp; Manufacturing
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-2 tracking-tight">
                    {t("features.corporate.title")}
                  </h3>
                  <p className="text-xs text-white/70 mt-1">
                    {t("features.corporate.priceSub")}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <span className="text-3xl font-extrabold text-white">{t("features.corporate.price")}</span>
                </div>

                <ul className="space-y-3.5 text-xs text-white/80">
                  <li className="flex items-center gap-2"><span className="text-jibb-orange font-bold">✓</span> {t("features.corporate.feature1")}</li>
                  <li className="flex items-center gap-2"><span className="text-jibb-orange font-bold">✓</span> {t("features.corporate.feature2")}</li>
                  <li className="flex items-center gap-2"><span className="text-jibb-orange font-bold">✓</span> {t("features.corporate.feature3")}</li>
                  <li className="flex items-center gap-2"><span className="text-jibb-orange font-bold">✓</span> {t("features.corporate.feature4")}</li>
                </ul>
              </div>
              <div className="pt-6">
                <a href="#scheduler" className="block">
                  <Button variant="accent" className="w-full font-bold shadow-md">Apply Corporate</Button>
                </a>
              </div>
            </div>

            {/* Bilateral Partner */}
            <div className="group relative rounded-3xl p-8 bg-card border border-border/60 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[480px]">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/5 text-primary border border-primary/10 uppercase tracking-wide">
                    Government &amp; Alliances
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mt-2 tracking-tight">
                    {t("features.government.title")}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("features.government.priceSub")}
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  <span className="text-3xl font-extrabold text-foreground">{t("features.government.price")}</span>
                </div>

                <ul className="space-y-3.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="text-jibb-orange font-bold">✓</span> {t("features.government.feature1")}</li>
                  <li className="flex items-center gap-2"><span className="text-jibb-orange font-bold">✓</span> {t("features.government.feature2")}</li>
                  <li className="flex items-center gap-2"><span className="text-jibb-orange font-bold">✓</span> {t("features.government.feature3")}</li>
                  <li className="flex items-center gap-2"><span className="text-jibb-orange font-bold">✓</span> {t("features.government.feature4")}</li>
                </ul>
              </div>
              <div className="pt-6">
                <a href="#scheduler" className="block">
                  <Button variant="outline" className="w-full font-semibold">Partner Inquiry</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <Button variant="outline" className="mt-6" onClick={() => setIsSuccess(false)}>
                  Schedule Another Meeting
                </Button>
              </div>
            )}

            {/* Scheduler Tabs Header */}
            <div className="flex border-b border-border bg-muted/40 select-none">
              <button
                onClick={() => { setActiveTab("calendly"); setSelectedDate(null); setSelectedTime(null); }}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === "calendly" 
                    ? "border-jibb-orange bg-card text-jibb-orange" 
                    : "border-transparent text-muted-foreground hover:bg-muted/65 hover:text-foreground"
                }`}
              >
                <Laptop className="size-4" />
                {t("calendlyTab")}
              </button>
              <button
                onClick={() => { setActiveTab("bookings"); setSelectedDate(null); setSelectedTime(null); }}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === "bookings" 
                    ? "border-jibb-orange bg-card text-jibb-orange" 
                    : "border-transparent text-muted-foreground hover:bg-muted/65 hover:text-foreground"
                }`}
              >
                <Server className="size-4" />
                {t("bookingsTab")}
              </button>
            </div>

            {/* Scheduler Workspace Grid */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-8">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                
                {/* Column 1: Date & Time Picker */}
                <div className="space-y-6 text-left">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                      1. Select a Date
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {dates.map((dt) => (
                        <button
                          key={dt.value}
                          type="button"
                          onClick={() => handleDateSelect(dt.value)}
                          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                            selectedDate === dt.value
                              ? "bg-primary text-primary-foreground border-primary shadow-md"
                              : "bg-card border-border/60 text-foreground/80 hover:bg-muted"
                          }`}
                        >
                          {dt.label}
                        </button>
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
                          <button
                            key={tm}
                            type="button"
                            onClick={() => handleTimeSelect(tm)}
                            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                              selectedTime === tm
                                ? "bg-jibb-orange text-white border-jibb-orange shadow-md"
                                : "bg-card border-border/60 text-foreground/80 hover:bg-muted"
                            }`}
                          >
                            {tm}
                          </button>
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
                  
                  {/* Name */}
                  <div className="space-y-1.5">
                    <Input
                      type="text"
                      placeholder="Your Full Name"
                      value={form.name}
                      onChange={(e) => {
                        setForm(prev => ({ ...prev, name: e.target.value }));
                        if (errors.name) setErrors(prev => { const c = { ...prev }; delete c.name; return c; });
                      }}
                      className={`bg-white/5 border-white/10 focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${
                        errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                    />
                    {errors.name && <span className="text-[10px] text-red-500 font-semibold">{errors.name}</span>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Input
                      type="email"
                      placeholder="Corporate Email Address"
                      value={form.email}
                      onChange={(e) => {
                        setForm(prev => ({ ...prev, email: e.target.value }));
                        if (errors.email) setErrors(prev => { const c = { ...prev }; delete c.email; return c; });
                      }}
                      className={`bg-white/5 border-white/10 focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${
                        errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                    />
                    {errors.email && <span className="text-[10px] text-red-500 font-semibold">{errors.email}</span>}
                  </div>

                  {/* Purpose */}
                  <div className="space-y-1.5">
                    <Input
                      type="text"
                      placeholder="Meeting Purpose (e.g., Market Entry consultation)"
                      value={form.purpose}
                      onChange={(e) => setForm(prev => ({ ...prev, purpose: e.target.value }))}
                      className="bg-white/5 border-white/10 focus-visible:ring-jibb-orange rounded-xl h-11 text-sm"
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
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 h-11 bg-jibb-orange text-white font-bold rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all text-sm shrink-0"
                >
                  {isSubmitting ? "Processing..." : t("bookBtn")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
