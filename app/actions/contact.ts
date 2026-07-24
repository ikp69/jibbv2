"use server";

import { createClient } from "@/lib/supabase/server";
import { ContactSchema, type ContactInput } from "@/app/lib/validation/contact";
import { sendEmail } from "@/lib/email/resend";
import { getContactNotificationEmail } from "@/lib/email/email-templates";
import { headers } from "next/headers";
import { isRateLimited } from "@/lib/utils/rate-limiter";

export async function submitContactForm(data: ContactInput) {
  try {
    // 0. Rate limiting check
    const headersList = await headers();
    const clientIp = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const { rateLimited, resetSeconds } = await isRateLimited(`contact:${clientIp}`, 3, 60);
    if (rateLimited) {
      return {
        success: false,
        error: `Too many submissions from your network. Please wait ${resetSeconds} seconds before trying again.`,
      };
    }

    // 1. Zod Server-side Validation
    const parsed = ContactSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
    }

    const { inquiryType, name, email, phone, message, honeypot } = parsed.data;

    // Map inquiry type values to full labels
    const inquiryTypeMap: Record<string, string> = {
      membership: "Membership Application",
      trade: "Trade & Partner Matching Support",
      hub: "Innovation Hub & Lab Inquiries",
      general: "General Partnership & Events",
    };

    const inquiryTypeLabel = inquiryTypeMap[inquiryType] || inquiryType;

    // 2. Honeypot check for spam bots
    if (honeypot) {
      console.warn("Spam detected via honeypot field. Suppressing submission.");
      return { success: true }; // Return mock success to fool bots
    }

    // 3. Database Insertion
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from("contact_inquiries")
      .insert({
        inquiry_type: inquiryTypeLabel,
        name,
        email,
        phone: phone || null,
        message,
        status: "new",
      });

    if (dbError) {
      console.error("[CONTACT_ACTION] Database insert error:", dbError);
      throw new Error(dbError.message);
    }

    // 4. Send Email Notification to Admin
    const emailHtml = getContactNotificationEmail({ inquiryType: inquiryTypeLabel, name, email, phone, message });
    const emailResult = await sendEmail({
      to: "hitesh@npo-jibb.org",
      subject: `[Contact Form] ${inquiryTypeLabel.toUpperCase()} - ${name}`,
      html: emailHtml,
      replyTo: email,
    });

    if (!emailResult.success) {
      throw new Error("email_failed");
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("[CONTACT_ACTION] Exception:", err);
    const message = err instanceof Error ? err.message : "Failed to submit contact inquiry";
    return { success: false, error: message };
  }
}
