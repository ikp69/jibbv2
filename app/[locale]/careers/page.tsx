"use client";

import { useState, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Input, Textarea } from "@/components/ui/input";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CultureGallery } from "@/components/sections/CultureGallery";
import { HiringProcess } from "@/components/sections/HiringProcess";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Briefcase, Globe, Award, Sparkles, ChevronDown, CheckCircle, 
  Send, Phone, Mail, Link as LinkIcon, User, SendHorizontal, FileText, AlertCircle
} from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { submitCareerApplication } from "@/app/actions/careers";
import { isValidPhone, PHONE_ERROR } from "@/app/lib/validation/phone";

export default function CareersPage() {
  const t = useTranslations("careersPage");
  
  // JobPosting Schema for Google Jobs Integration
  const jobPostings = [
    {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": "Japan Desk Consultant (Bilingual: Japanese & English)",
      "description": "We are seeking a Japan Desk Consultant with expertise in Japan-India business relations to provide strategic advisory, market research, and client liaison services.",
      "identifier": {
        "@type": "PropertyValue",
        "name": "JIBB",
        "value": "JDC-2026-001"
      },
      "datePosted": "2026-01-15",
      "validThrough": "2026-12-31",
      "employmentType": "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Japan India Business Bureau",
        "sameAs": "https://npo-jibb.org",
        "logo": "https://www.npo-jibb.org/logo.webp"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "6th Floor, 162, Sector 136, Arihant Business Centre",
          "addressLocality": "Noida",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "201304",
          "addressCountry": "IN"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": "Competitive",
          "unitText": "YEAR"
        }
      },
      "qualifications": "Fluency in Japanese and English, 3+ years experience in Japan-India business",
      "responsibilities": "Market research, client liaison, business development support, delegation coordination"
    },
    {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": "Bilateral Translator / Coordinator (Japanese-English-Hindi)",
      "description": "Seeking a multilingual translator and coordinator to bridge communication between Japanese and Indian stakeholders in business negotiations and events.",
      "identifier": {
        "@type": "PropertyValue",
        "name": "JIBB",
        "value": "BTC-2026-002"
      },
      "datePosted": "2026-01-15",
      "validThrough": "2026-12-31",
      "employmentType": "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Japan India Business Bureau",
        "sameAs": "https://npo-jibb.org",
        "logo": "https://www.npo-jibb.org/logo.webp"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "6th Floor, 162, Sector 136, Arihant Business Centre",
          "addressLocality": "Noida",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "201304",
          "addressCountry": "IN"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": "Competitive",
          "unitText": "YEAR"
        }
      },
      "qualifications": "Native or near-native fluency in Japanese, English, and Hindi",
      "responsibilities": "Translation, interpretation, event coordination, documentation management"
    },
    {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": "Business Development Executive (India-Japan Markets)",
      "description": "Drive business growth by identifying partnership opportunities, managing client relationships, and supporting market entry strategies between India and Japan.",
      "identifier": {
        "@type": "PropertyValue",
        "name": "JIBB",
        "value": "BDE-2026-003"
      },
      "datePosted": "2026-01-15",
      "validThrough": "2026-12-31",
      "employmentType": "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Japan India Business Bureau",
        "sameAs": "https://npo-jibb.org",
        "logo": "https://www.npo-jibb.org/logo.webp"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "6th Floor, 162, Sector 136, Arihant Business Centre",
          "addressLocality": "Noida",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "201304",
          "addressCountry": "IN"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": "Competitive",
          "unitText": "YEAR"
        }
      },
      "qualifications": "2+ years in business development, strong understanding of India-Japan trade dynamics",
      "responsibilities": "Lead generation, partnership development, client management, market analysis"
    }
  ];
  
  // Job Board Accordion State
  const [activeJob, setActiveJob] = useState<string | null>(null);

  // Form States
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    position: "consultant",
    message: "",
    honeypot: "",
  });
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shouldShake, setShouldShake] = useState(false);
  const [generalError, setGeneralError] = useState<ReactNode | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  // Job Opening Array
  const jobs = [
    { id: "consultant", translationKey: "consultant" },
    { id: "translator", translationKey: "translator" },
    { id: "bde", translationKey: "bde" }
  ];

  function toggleJob(jobId: string) {
    setActiveJob(activeJob === jobId ? null : jobId);
    // Auto pre-select position when they toggle a job detail
    setFormState(prev => ({ ...prev, position: jobId }));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setResumeFile(file);
    if (errors.resume) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.resume;
        return copy;
      });
    }
  }

  function validateForm() {
    const tempErrors: Record<string, string> = {};
    if (!formState.name.trim()) tempErrors.name = "Name is required";
    if (!formState.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      tempErrors.email = "Invalid email format";
    }
    if (!formState.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!isValidPhone(formState.phone)) {
      tempErrors.phone = PHONE_ERROR;
    }
    if (!formState.linkedin.trim()) {
      tempErrors.linkedin = "LinkedIn profile is required";
    } else if (!/linkedin\.com/.test(formState.linkedin)) {
      tempErrors.linkedin = "Must be a valid LinkedIn link";
    }

    if (!resumeFile) {
      tempErrors.resume = "Resume CV file is required";
    } else {
      if (resumeFile.size > 5 * 1024 * 1024) {
        tempErrors.resume = "File must be under 5MB";
      }
      const ext = resumeFile.name.split(".").pop()?.toLowerCase();
      if (ext && !["pdf", "doc", "docx"].includes(ext)) {
        tempErrors.resume = "Only .pdf, .doc, and .docx files are allowed";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);
    try {
      const dataPayload = new FormData();
      dataPayload.append("name", formState.name);
      dataPayload.append("email", formState.email);
      dataPayload.append("phone", formState.phone);
      dataPayload.append("position", formState.position);
      dataPayload.append("honeypot", formState.honeypot);

      // Concatenate LinkedIn and message to cover letter
      const coverLetter = `LinkedIn: ${formState.linkedin}\n\nIntro Message: ${formState.message}`;
      dataPayload.append("coverLetter", coverLetter);

      if (resumeFile) {
        dataPayload.append("resume", resumeFile);
      }

      const response = await submitCareerApplication(dataPayload);

      if (response.success) {
        setIsSuccess(true);
        setFormState({
          name: "",
          email: "",
          phone: "",
          linkedin: "",
          position: "consultant",
          message: "",
          honeypot: "",
        });
        setResumeFile(null);
        if (formRef.current) formRef.current.reset();
        
        // Auto-reset success state after 7 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 7000);
      } else {
        if (response.error === "email_failed") {
          setGeneralError(
            <span>
              {t("form.emailErrorText")}{" "}
              <a
                href="mailto:hitesh@npo-jibb.org"
                className="underline font-bold hover:opacity-80 transition-opacity"
              >
                hitesh@npo-jibb.org
              </a>
            </span>
          );
        } else {
          setGeneralError(response.error || "Failed to submit career application.");
        }
      }
    } catch (err) {
      console.error(err);
      setGeneralError("Submission error. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* Schema.org JSON-LD for JobPosting - Google Jobs Integration */}
      {jobPostings.map((job, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(job) }}
        />
      ))}

      {/* ============================================================
          HERO BANNER
          ============================================================ */}
      <PageHero className="py-20 lg:py-28" bgText="CAREERS">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              Careers &amp; Talents
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
              Join JIBB Team
            </span>
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
          </div>
        </div>
      </PageHero>

      {/* ============================================================
          INTRO DIVISION
          ============================================================ */}
      <section className="py-16 md:py-24 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-5 text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                Shaping the Tokyo-Noida Corridor
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("intro")}
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("subtext")}
              </p>
              <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/10 tracking-wide">
                {t("locations")}
              </span>
            </div>
            
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-full max-w-xs rounded-2xl p-6 bg-card border border-border shadow-jibb flex flex-col gap-4 text-left overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-sm font-bold text-foreground tracking-tight uppercase">Quick Info</h3>
                <ul className="space-y-3.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-jibb-orange font-bold">✓</span> Hybrid Work Options
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-jibb-orange font-bold">✓</span> Global Bilateral Exposure
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-jibb-orange font-bold">✓</span> Industry-leading mentorship
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          WHY JOIN US
          ============================================================ */}
      <section className="py-16 bg-background">
        <div className="section-container max-w-5xl text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              {t("whyJoinTitle")}
            </h2>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <div 
                key={num} 
                className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300 text-left"
              >
                <div className="p-2 rounded-xl bg-primary/5 text-primary shrink-0 h-fit">
                  <Award className="size-5" />
                </div>
                <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                  {t(`whyJoin${num}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CultureGallery />

      <HiringProcess />

      {/* ============================================================
          INTERACTIVE JOB BOARD (ACCORDION)
          ============================================================ */}
      <section className="py-16 md:py-24 bg-jibb-gradient-subtle border-y border-border/30">
        <div className="section-container max-w-4xl text-left space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              {t("openPositionsTitle")}
            </h2>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <div className="space-y-4">
            {jobs.map((job) => {
              const isExpanded = activeJob === job.id;
              
              // Get job responsibilities and requirements arrays dynamically
              const responsibilities = t.raw(`jobs.${job.translationKey}.responsibilities`) as string[];
              const requirements = t.raw(`jobs.${job.translationKey}.requirements`) as string[];

              return (
                <div 
                  key={job.id} 
                  className={`bg-card rounded-2xl border transition-all duration-300 ${
                    isExpanded ? "border-primary/30 shadow-jibb-md" : "border-border/50 hover:border-border"
                  }`}
                >
                  {/* Job Accordion Header Toggle */}
                  <button 
                    onClick={() => toggleJob(job.id)}
                    className="w-full p-6 flex justify-between items-center text-left focus:outline-none"
                    aria-expanded={isExpanded}
                  >
                    <div className="space-y-1.5 pr-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-accent/5 text-accent border border-accent/15 uppercase tracking-wide">
                        {t(`jobs.${job.translationKey}.dept`)}
                      </span>
                      <h3 className="text-xl font-bold text-foreground tracking-tight">
                        {t(`jobs.${job.translationKey}.title`)}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">💼 {t(`jobs.${job.translationKey}.exp`)}</span>
                        <span className="flex items-center gap-1">📍 {t(`jobs.${job.translationKey}.loc`)}</span>
                      </div>
                    </div>

                    <ChevronDown className={`size-5 text-muted-foreground transition-transform duration-300 ${
                      isExpanded ? "rotate-180 text-primary" : ""
                    }`} />
                  </button>

                  {/* Expanded Content Panel */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden border-t border-border/50"
                      >
                        <div className="p-6 space-y-6 text-sm leading-relaxed">
                          {/* Overview */}
                          <div className="space-y-2">
                            <h4 className="font-bold text-foreground uppercase tracking-wider text-xs">Role Overview</h4>
                            <p className="text-muted-foreground">{t(`jobs.${job.translationKey}.overview`)}</p>
                          </div>

                          {/* Responsibilities */}
                          <div className="space-y-2.5">
                            <h4 className="font-bold text-foreground uppercase tracking-wider text-xs">Key Responsibilities</h4>
                            <motion.ul
                              variants={{
                                hidden: { opacity: 0 },
                                show: {
                                  opacity: 1,
                                  transition: {
                                    staggerChildren: 0.05,
                                    delayChildren: 0.05,
                                  },
                                },
                              }}
                              initial="hidden"
                              animate="show"
                              className="space-y-2 text-muted-foreground pl-4 list-disc"
                            >
                              {responsibilities.map((resp, idx) => (
                                <motion.li
                                  variants={{
                                    hidden: { opacity: 0, y: 5 },
                                    show: { opacity: 1, y: 0 },
                                  }}
                                  key={idx}
                                >
                                  {resp}
                                </motion.li>
                              ))}
                            </motion.ul>
                          </div>

                          {/* Requirements */}
                          <div className="space-y-2.5">
                            <h4 className="font-bold text-foreground uppercase tracking-wider text-xs">What We're Looking For</h4>
                            <motion.ul
                              variants={{
                                hidden: { opacity: 0 },
                                show: {
                                  opacity: 1,
                                  transition: {
                                    staggerChildren: 0.05,
                                    delayChildren: 0.1,
                                  },
                                },
                              }}
                              initial="hidden"
                              animate="show"
                              className="space-y-2 text-muted-foreground pl-4 list-disc"
                            >
                              {requirements.map((req, idx) => (
                                <motion.li
                                  variants={{
                                    hidden: { opacity: 0, y: 5 },
                                    show: { opacity: 1, y: 0 },
                                  }}
                                  key={idx}
                                >
                                  {req}
                                </motion.li>
                              ))}
                            </motion.ul>
                          </div>

                          {/* Details Badge Block */}
                          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex flex-wrap justify-between items-center gap-3">
                            <div>
                              <span className="text-xs text-muted-foreground block">Qualifications Required</span>
                              <span className="text-xs font-bold text-foreground">{t(`jobs.${job.translationKey}.qual`)}</span>
                            </div>
                            <a href="#apply-form" className="shrink-0">
                              <AnimatedButton size="sm" className="font-semibold gap-1.5" onClick={() => toggleJob(job.id)}>
                                Apply Now <SendHorizontal className="size-3.5" />
                              </AnimatedButton>
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          STUNNING APPLICATION FORM
          ============================================================ */}
      <section id="apply-form" className="py-16 md:py-24 bg-background relative scroll-mt-20">
        <div className="section-container max-w-2xl text-left space-y-8 relative z-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              {t("applyTitle")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              {t("applyDesc")}
            </p>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <div className="relative rounded-3xl p-6 sm:p-8 bg-card border border-border shadow-jibb-lg overflow-hidden">
            {/* Form Success Overlay */}
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
                  Submit Another Application
                </AnimatedButton>
              </div>
            )}

             <form ref={formRef} onSubmit={handleSubmit} className={`space-y-5 ${shouldShake ? "animate-shake" : ""}`}>
               {generalError && (
                 <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                   <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-500" />
                   <div className="space-y-1">
                     <p className="font-semibold text-red-700 dark:text-red-400">Submission Error</p>
                     <div className="text-xs text-red-600/90 dark:text-red-400/95 leading-relaxed">
                       {generalError}
                     </div>
                   </div>
                 </div>
               )}
               {/* Honeypot field (hidden from users, visible to bots) */}
               <div className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0 overflow-hidden">
                 <label htmlFor="careers-website-url">Leave this field blank</label>
                 <input
                   id="careers-website-url"
                   type="text"
                   name="honeypot"
                   tabIndex={-1}
                   value={formState.honeypot}
                   onChange={handleInputChange}
                   autoComplete="off"
                 />
               </div>

               {/* Name */}
               <div className="space-y-1.5">
                 <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                   <User className="size-3.5 text-muted-foreground" /> {t("form.nameLabel")} <span className="text-red-500">*</span>
                 </label>
                 <Input 
                   type="text" 
                   name="name" 
                   value={formState.name}
                   onChange={handleInputChange}
                   className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${
                     errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                   }`}
                   placeholder="John Doe" 
                 />
                 {errors.name && <span className="text-[10px] text-red-500 font-semibold">{errors.name}</span>}
               </div>

               {/* Position Dropdown */}
               <div className="space-y-1.5">
                 <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                   <Briefcase className="size-3.5 text-muted-foreground" /> Position applied for <span className="text-red-500">*</span>
                 </label>
                 <select
                   name="position"
                   value={formState.position}
                   onChange={handleInputChange}
                   className="flex h-11 w-full rounded-xl border border-input bg-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-jibb-orange/20 focus:border-jibb-orange transition-all duration-200"
                 >
                   <option value="consultant">Bilateral Business Consultant</option>
                   <option value="translator">Bilateral Translator / Coordinator</option>
                   <option value="bde">Business Development Executive</option>
                 </select>
               </div>

               {/* Email */}
               <div className="space-y-1.5">
                 <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                   <Mail className="size-3.5 text-muted-foreground" /> {t("form.emailLabel")} <span className="text-red-500">*</span>
                 </label>
                 <Input 
                   type="email" 
                   name="email" 
                   value={formState.email}
                   onChange={handleInputChange}
                   className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${
                     errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                   }`}
                   placeholder="john@example.com" 
                 />
                 {errors.email && <span className="text-[10px] text-red-500 font-semibold">{errors.email}</span>}
               </div>

               {/* Phone */}
               <div className="space-y-1.5">
                 <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                   <Phone className="size-3.5 text-muted-foreground" /> {t("form.phoneLabel")} <span className="text-red-500">*</span>
                 </label>
                 <Input 
                   type="tel" 
                   name="phone" 
                   value={formState.phone}
                   onChange={handleInputChange}
                   className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${
                     errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""
                   }`}
                   placeholder="+91 98765 43210 / +81 90 1234 5678" 
                 />
                 {errors.phone && <span className="text-[10px] text-red-500 font-semibold">{errors.phone}</span>}
               </div>

               {/* LinkedIn */}
               <div className="space-y-1.5">
                 <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                   <LinkIcon className="size-3.5 text-muted-foreground" /> {t("form.linkedinLabel")} <span className="text-red-500">*</span>
                 </label>
                 <Input 
                   type="text" 
                   name="linkedin" 
                   value={formState.linkedin}
                   onChange={handleInputChange}
                   className={`focus-visible:ring-jibb-orange rounded-xl h-11 text-sm ${
                     errors.linkedin ? "border-red-500 focus-visible:ring-red-500" : ""
                   }`}
                   placeholder="https://linkedin.com/in/username" 
                 />
                 {errors.linkedin && <span className="text-[10px] text-red-500 font-semibold">{errors.linkedin}</span>}
               </div>

               {/* Resume Upload */}
               <div className="space-y-1.5">
                 <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                   <FileText className="size-3.5 text-muted-foreground" /> Resume / CV (PDF, DOC, DOCX - Max 5MB) <span className="text-red-500">*</span>
                 </label>
                 <input 
                   type="file" 
                   name="resume" 
                   accept=".pdf,.doc,.docx"
                   onChange={handleFileChange}
                   className={`flex w-full rounded-xl border border-input bg-card px-4 py-2 text-sm text-foreground file:border-0 file:bg-primary/10 file:text-primary file:rounded-lg file:text-xs file:font-semibold file:px-3 file:py-1 file:mr-4 hover:file:bg-primary/20 ${
                     errors.resume ? "border-red-500 focus-visible:ring-red-500" : ""
                   }`}
                 />
                 {errors.resume && <span className="text-[10px] text-red-500 font-semibold">{errors.resume}</span>}
               </div>

               {/* Message */}
               <div className="space-y-1.5">
                 <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                   <Send className="size-3.5 text-muted-foreground" /> {t("form.messageLabel")}
                 </label>
                 <Textarea 
                   name="message" 
                   value={formState.message}
                   onChange={handleInputChange}
                   className="focus-visible:ring-jibb-orange rounded-xl min-h-[100px] text-sm"
                   placeholder="Tell us about yourself and why you'd like to join JIBB..."
                 />
               </div>

               {/* Submit */}
               <div className="pt-3">
                 <AnimatedButton 
                   type="submit" 
                   className="w-full h-11 font-bold rounded-xl shadow-lg bg-jibb-orange text-white text-sm"
                   disabled={isSubmitting}
                 >
                   {isSubmitting ? t("form.submitting") : t("form.submitButton")}
                 </AnimatedButton>
               </div>
             </form>
          </div>
        </div>
      </section>
    </main>
  );
}
