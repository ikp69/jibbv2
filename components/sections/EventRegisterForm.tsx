"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function EventRegisterForm() {
  const t = useTranslations("eventsPage");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    event: "semiconductor",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Mock API submission timeout
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        company: "",
        event: "semiconductor",
        message: "",
      });
    }, 1500);
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
          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
              {t("fields.name")} *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all font-semibold"
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
              className="w-full px-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all font-semibold"
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
              className="w-full px-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
              {t("fields.event")} *
            </label>
            <select
              value={formData.event}
              onChange={(e) => setFormData({ ...formData, event: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all font-semibold"
            >
              <option value="semiconductor">{t("list.semiconductor.title")}</option>
              <option value="cleanEnergy">{t("list.cleanEnergy.title")}</option>
              <option value="startupPitch">{t("list.startupPitch.title")}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
              {t("fields.message")}
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all font-semibold"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full font-bold gap-1.5 shadow-md"
          >
            {submitting ? t("fields.submitting") : t("fields.submit")} <Sparkles className="size-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
