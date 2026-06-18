"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input, Textarea } from "@/components/ui/input";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Parallax } from "@/components/ui/Parallax";
import { OfficeMap } from "@/components/sections/OfficeMap";
import {
  Mail, Phone, MapPin, CheckCircle, Sparkles, Send, ArrowRight,
  Building2, Landmark, HelpCircle, Briefcase, FileText
} from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { submitContactForm } from "@/app/actions/contact";
import { isValidPhone, PHONE_ERROR } from "@/app/lib/validation/phone";

export default function ContactPage() {
  const t = useTranslations("contactPage");

  // LocalBusiness Schema for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Japan India Business Bureau",
    "alternateName": "JIBB",
    "url": "https://npo-jibb.org",
    "logo": "https://npo-jibb.org/images/jibb-logo.png",
    "description": "Cross-border innovation and industrial collaboration ecosystem connecting Japan and India",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+81-90-9325-3456",
        "contactType": "General Inquiries",
        "areaServed": "JP",
        "availableLanguage": ["English", "Japanese"],
        "contactOption": "TollFree"
      },
      {
        "@type": "ContactPoint",
        "telephone": "+91-70000-17005",
        "contactType": "General Inquiries",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"],
        "email": "vc@npo-jibb.org"
      }
    ],
    "address": [
      {
        "@type": "PostalAddress",
        "addressLocality": "Tokyo",
        "addressCountry": "JP"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "Bhutani Cyberpark, Tower B, 8th Floor",
        "addressLocality": "Noida",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "201301",
        "addressCountry": "IN"
      }
    ],
    "sameAs": [
      "https://www.linkedin.com/company/jibb",
      "https://twitter.com/jibb_official"
    ]
  };

  // Form State
  const [form, setForm] = useState({
    inquiryType: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
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
    const temp: Record<string, string> = {};
    if (!form.inquiryType) temp.inquiryType = "Inquiry type is required";
    if (!form.name.trim()) temp.name = "Full name is required";
    if (!form.email.trim()) {
      temp.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      temp.email = "Invalid email format";
    }
    if (!form.phone.trim()) {
      temp.phone = "Phone number is required";
    } else if (!isValidPhone(form.phone)) {
      temp.phone = PHONE_ERROR;
    }
    if (!form.message.trim()) {
      temp.message = "Message details are required";
    } else if (form.message.trim().length < 10) {
      temp.message = "Message details must be at least 10 characters long";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
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
      const response = await submitContactForm(form);
      if (response.success) {
        setIsSuccess(true);
        setForm({
          inquiryType: "",
          name: "",
          email: "",
          phone: "",
          message: "",
          honeypot: "",
        });
        setTimeout(() => {
          setIsSuccess(false);
        }, 7000);
      } else {
        alert(response.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Submission error. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* Schema.org JSON-LD for LocalBusiness/Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* ============================================================
          CINEMATIC HERO
          ============================================================ */}
      <PageHero className="py-20 lg:py-28" bgText="CONTACT">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              Get in Touch
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
              Bilateral Assistance
            </span>
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
          </div>
        </div>
      </PageHero>

      {/* ============================================================
          CONTACT GRID (FORM + MAPS)
          ============================================================ */}
      <section className="py-20 bg-jibb-gradient-subtle">
        <div className="section-container max-w-5xl">
          <div className="grid lg:grid-cols-12 gap-12 items-start">

            {/* Left Column: Form Details (Col span 7) */}
            <ScrollReveal direction="left" className="lg:col-span-7 relative">
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
                      Send Another Message
                    </AnimatedButton>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-foreground tracking-tight mb-6">
                  {t("formTitle")}
                </h3>

                <form onSubmit={handleSubmit} className={`space-y-5 ${shouldShake ? "animate-shake" : ""}`}>
                  {/* Honeypot field (hidden from users, visible to bots) */}
                  <div className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0 overflow-hidden">
                    <label htmlFor="website-url">Leave this field blank</label>
                    <input
                      id="website-url"
                      type="text"
                      name="honeypot"
                      tabIndex={-1}
                      value={form.honeypot}
                      onChange={handleInputChange}
                      autoComplete="off"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="size-4 text-muted-foreground" /> {t("form.inquiryType")} <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="inquiryType"
                      value={form.inquiryType}
                      onChange={handleSelectChange}
                      className={`w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 h-11 ${errors.inquiryType ? "border-red-500 focus:ring-red-500/20" : ""
                        }`}
                    >
                      <option value="">{t("form.typeSelect")}</option>
                      <option value="membership">{t("form.type1")}</option>
                      <option value="trade">{t("form.type2")}</option>
                      <option value="hub">{t("form.type3")}</option>
                      <option value="general">{t("form.type4")}</option>
                    </select>
                    {errors.inquiryType && <span className="text-[10px] text-red-500 font-semibold">{errors.inquiryType}</span>}
                  </div>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                      {t("form.name")} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                        }`}
                      placeholder="Jane Doe / Acme Corp"
                    />
                    {errors.name && <span className="text-[10px] text-red-500 font-semibold">{errors.name}</span>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                      {t("form.email")} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                        }`}
                      placeholder="corporate@example.com"
                    />
                    {errors.email && <span className="text-[10px] text-red-500 font-semibold">{errors.email}</span>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                      {t("form.phone")} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""
                        }`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <span className="text-[10px] text-red-500 font-semibold">{errors.phone}</span>}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                      {t("form.message")} <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      name="message"
                      value={form.message}
                      onChange={handleInputChange}
                      className={`focus-visible:ring-jibb-orange rounded-xl min-h-[120px] text-sm ${errors.message ? "border-red-500 focus-visible:ring-red-500" : ""
                        }`}
                      placeholder="Please details your inquiry..."
                    />
                    {errors.message && <span className="text-[10px] text-red-500 font-semibold">{errors.message}</span>}
                  </div>

                  <div className="pt-3">
                    <AnimatedButton
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 bg-jibb-orange text-white font-bold rounded-xl shadow-lg text-sm flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "Sending..." : t("form.submit")}
                      <Send className="size-4" />
                    </AnimatedButton>
                  </div>
                </form>
              </div>
            </ScrollReveal>

            {/* Right Column: Offices Maps (Col span 5) */}
            <ScrollReveal staggerChildren={0.15} className="lg:col-span-5 space-y-6 text-left">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                {t("officesTitle")}
              </h3>

              {/* Tokyo Office */}
              <div className="relative rounded-2xl p-6 bg-card border border-border shadow-jibb overflow-hidden flex flex-col gap-4">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none animate-glow-pulse" />
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/5 text-primary shrink-0">
                    <Landmark className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {t("tokyoOffice")}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      {t("tokyoAddr")}
                    </p>
                  </div>
                </div>
                <div className="border-t border-border pt-4 text-xs flex items-center gap-3 text-muted-foreground">
                  <Phone className="size-3.5 text-jibb-orange animate-soft-pulse" />
                  <span>+81 90-9325-3456, Shigemaro Yasui</span>
                </div>
              </div>

              {/* Noida Operational Office */}
              <div className="relative rounded-2xl p-6 bg-card border border-border shadow-jibb overflow-hidden flex flex-col gap-4">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none animate-glow-pulse" />
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/5 text-primary shrink-0">
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {t("noidaOffice")}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      {t("noidaAddr")}
                    </p>
                  </div>
                </div>
                <div className="border-t border-border pt-4 text-xs flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Phone className="size-3.5 text-jibb-orange animate-soft-pulse shrink-0" />
                    <span>+91 70000 17005, Vardaan Chaudhary</span>
                  </div>
                  <a
                    href="mailto:vc@npo-jibb.org"
                    className="sm:ml-auto flex items-center gap-3 text-jibb-orange hover:text-jibb-orange/80 font-semibold hover:underline transition-colors"
                  >
                    <Mail className="size-3.5 shrink-0" />
                    vc@npo-jibb.org
                  </a>
                </div>
              </div>

              {/* Office Map Component */}
              <OfficeMap />
            </ScrollReveal>

          </div>
        </div>
      </section>
    </main>
  );
}
