"use server";

import { createClient } from "@/lib/supabase/server";
import { EventSchema, type EventInput } from "@/app/lib/validation/event";
import { sendEmail } from "@/lib/email/resend";
import { getEventRegistrationNotificationEmail } from "@/lib/email/email-templates";

export async function registerForEvent(data: EventInput) {
  try {
    // 1. Zod Server-side Validation
    const parsed = EventSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
    }

    const { eventId, name, company, designation, email, phone, attendeeType, honeypot } = parsed.data;

    // 2. Honeypot check
    if (honeypot) {
      console.warn("Spam detected via honeypot. Suppressing event registration.");
      return { success: true };
    }

    // 3. Database Insertion
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from("event_registrations")
      .insert({
        event_id: eventId,
        name,
        company,
        designation,
        email,
        phone,
        attendee_type: attendeeType,
      });

    if (dbError) {
      console.error("Database insert error:", dbError);
      throw new Error(dbError.message);
    }

    // 4. Send Email Notification
    const emailHtml = getEventRegistrationNotificationEmail({
      eventId,
      name,
      company,
      designation,
      email,
      phone,
      attendeeType,
    });

    await sendEmail({
      to: "hitesh@npo-jibb.org",
      subject: `[Event Reg] ${eventId} - ${name} (${company})`,
      html: emailHtml,
      replyTo: email,
    });

    return { success: true };
  } catch (err: unknown) {
    console.error("registerForEvent error:", err);
    const message = err instanceof Error ? err.message : "Failed to complete event registration";
    return { success: false, error: message };
  }
}
