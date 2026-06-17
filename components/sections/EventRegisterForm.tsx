"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertCircle } from "lucide-react";
import { registerForEvent } from "@/app/actions/event";

export function EventRegisterForm() {
  const t = useTranslations("eventsPage");
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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
        setError(result.error || "Failed to complete event registration.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-300">
          {error && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Honeypot field (hidden from users, visible to bots) */}
          <div className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0 overflow-hidden">
            <label htmlFor="event-website-url">Leave this field blank</label>
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

          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
              {t("fields.name")} *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all font-semibold text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
              {t("fields.email")} *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all font-semibold text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
              {t("fields.company")} *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all font-semibold text-foreground"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                Designation *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Director"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all font-semibold text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                Phone *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all font-semibold text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
              {t("fields.event")} *
            </label>
            <select
              value={formData.event}
              onChange={(e) => setFormData({ ...formData, event: e.target.value })}
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
            {submitting ? t("fields.submitting") : t("fields.submit")} <Sparkles className="size-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
