"use server";

import { createClient } from "@/lib/supabase/server";
import { ExhibitionInquirySchema, type ExhibitionInquiryInput } from "@/app/lib/validation/exhibition";
import { sendEmail } from "@/lib/email/resend";
import { getExhibitionInquiryNotificationEmail } from "@/lib/email/email-templates";

export async function submitExhibitionInquiry(data: ExhibitionInquiryInput) {
  try {
    // 1. Zod Server-side Validation
    const parsed = ExhibitionInquirySchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
    }

    const { eventName, name, email, phone, message, honeypot } = parsed.data;

    // 2. Honeypot check for spam bots
    if (honeypot) {
      console.warn("Spam detected via honeypot field. Suppressing submission.");
      return { success: true };
    }

    // 3. Database Insertion (Save into contact_inquiries)
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from("contact_inquiries")
      .insert({
        inquiry_type: `Japan Pavilion: ${eventName}`,
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
    const emailHtml = getExhibitionInquiryNotificationEmail({ eventName, name, email, phone, message });
    const emailResult = await sendEmail({
      to: "hitesh@npo-jibb.org",
      subject: `[Exhibition Inquiry] ${eventName.toUpperCase()} - ${name}`,
      html: emailHtml,
      replyTo: email,
    });

    if (!emailResult.success) {
      throw new Error("email_failed");
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("submitExhibitionInquiry error:", err);
    const message = err instanceof Error ? err.message : "Failed to submit exhibition inquiry";
    return { success: false, error: message };
  }
}
