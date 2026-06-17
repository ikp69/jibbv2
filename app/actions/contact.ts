"use server";

import { createClient } from "@/lib/supabase/server";
import { ContactSchema, type ContactInput } from "@/app/lib/validation/contact";
import { sendEmail } from "@/lib/email/resend";
import { getContactNotificationEmail } from "@/lib/email/email-templates";

export async function submitContactForm(data: ContactInput) {
  try {
    // 1. Zod Server-side Validation
    const parsed = ContactSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
    }

    const { inquiryType, name, email, phone, message, honeypot } = parsed.data;

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
        inquiry_type: inquiryType,
        name,
        email,
        phone: phone || null,
        message,
        status: "new",
      });

    if (dbError) {
      console.error("Database insert error:", dbError);
      throw new Error(dbError.message);
    }

    // 4. Send Email Notification to Admin
    const emailHtml = getContactNotificationEmail({ inquiryType, name, email, phone, message });
    await sendEmail({
      to: "gurpreet@npo-jibb.org",
      subject: `[Contact Form] ${inquiryType.toUpperCase()} - ${name}`,
      html: emailHtml,
      replyTo: email,
    });

    return { success: true };
  } catch (err: unknown) {
    console.error("submitContactForm error:", err);
    const message = err instanceof Error ? err.message : "Failed to submit contact inquiry";
    return { success: false, error: message };
  }
}
