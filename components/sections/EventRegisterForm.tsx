"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertCircle } from "lucide-react";
import { registerForEvent } from "@/app/actions/event";
import { isValidPhone, PHONE_ERROR } from "@/app/lib/validation/phone";

interface FieldErrors {
  name?: string;
  email?: string;
  company?: string;
  designation?: string;
  phone?: string;
  [key: string]: string | undefined;
}

export function EventRegisterForm() {
  const t = useTranslations("eventsPage");
  const tContact = useTranslations("contactPage");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    designation: "",
    phone: "",
    event: "semiconductor",
    attendeeType: "general" as "general" | "vip" | "speaker" | "sponsor",
    honeypot: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Clear a single field error when the user starts typing
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  }

  function validate(): boolean {
    const errs: FieldErrors = {};

    if (!formData.name.trim()) {
      errs.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Invalid email format";
    }

    if (!formData.company.trim()) {
      errs.company = "Company name is required";
    }

    if (!formData.designation.trim()) {
      errs.designation = "Designation is required";
    }

    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!isValidPhone(formData.phone)) {
      errs.phone = PHONE_ERROR;
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setSubmitting(true);

    try {
      const result = await registerForEvent({
        eventId: formData.event,
        name: formData.name,
        company: formData.company,
        designation: formData.designation,
        email: formData.email,
        phone: formData.phone,
        attendeeType: formData.attendeeType,
        honeypot: formData.honeypot,
      });

      if (result.success) {
        setSuccess(true);
        setFieldErrors({});
        setFormData({
          name: "",
          email: "",
          company: "",
          designation: "",
          phone: "",
          event: "semiconductor",
          attendeeType: "general",
          honeypot: "",
        });
      } else {
        setServerError(result.error || "Failed to complete event registration.");
      }
    } catch (err: unknown) {
      console.error(err);
      setServerError("An unexpected error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 text-sm bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all font-semibold text-foreground ${
      fieldErrors[field] ? "border-red-500 focus:ring-red-500/30" : "border-border"
    }`;

  return (
    <div className="relative rounded-3xl p-8 bg-card border border-border shadow-jibb overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />

      {success ? (
        <div className="space-y-4 text-center py-12 animate-in fade-in duration-300">
          <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <Sparkles className="size-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            {t("fields.success")}
          </h3>
          <Button
            variant="outline"
            onClick={() => setSuccess(false)}
            className="font-semibold"
          >
            Register Another Person
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4 animate-in fade-in duration-300">
          {/* Server-level error banner */}
          {serverError && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Honeypot field (hidden from users, visible to bots) */}
          <div className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0 overflow-hidden">
            <label htmlFor="event-website-url">{tContact("form.honeypotLabel")}</label>
            <input
              id="event-website-url"
              type="text"
              name="honeypot"
              tabIndex={-1}
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              autoComplete="off"
            />
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
              {t("fields.name")} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass("name")}
            />
            {fieldErrors.name && (
              <p className="text-[10px] text-red-500 font-semibold mt-0.5">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
              {t("fields.email")} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass("email")}
            />
            {fieldErrors.email && (
              <p className="text-[10px] text-red-500 font-semibold mt-0.5">{fieldErrors.email}</p>
            )}
          </div>

          {/* Company */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
              {t("fields.company")} *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={inputClass("company")}
            />
            {fieldErrors.company && (
              <p className="text-[10px] text-red-500 font-semibold mt-0.5">{fieldErrors.company}</p>
            )}
          </div>

          {/* Designation + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                Designation *
              </label>
              <input
                type="text"
                name="designation"
                placeholder="e.g. Director"
                value={formData.designation}
                onChange={handleChange}
                className={inputClass("designation")}
              />
              {fieldErrors.designation && (
                <p className="text-[10px] text-red-500 font-semibold mt-0.5">{fieldErrors.designation}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass("phone")}
              />
              {fieldErrors.phone && (
                <p className="text-[10px] text-red-500 font-semibold mt-0.5">{fieldErrors.phone}</p>
              )}
            </div>
          </div>

          {/* Event */}
          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
              {t("fields.event")} *
            </label>
            <select
              name="event"
              value={formData.event}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all font-semibold text-foreground"
            >
              <option value="semiconductor">{t("list.semiconductor.title")}</option>
              <option value="cleanEnergy">{t("list.cleanEnergy.title")}</option>
              <option value="startupPitch">{t("list.startupPitch.title")}</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full font-bold gap-1.5 shadow-md bg-jibb-orange text-white hover:bg-jibb-orange/90 border-none rounded-xl h-11"
          >
            {submitting ? t("fields.submitting") : t("fields.submit")}{" "}
            <Sparkles className="size-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
