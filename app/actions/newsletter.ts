"use server";

import { createClient } from "@/lib/supabase/server";
import { NewsletterSchema, type NewsletterInput } from "@/app/lib/validation/newsletter";

export async function subscribeToNewsletter(data: NewsletterInput) {
  try {
    // 1. Zod Server-side Validation
    const parsed = NewsletterSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
    }

    const { name, email, source, honeypot } = parsed.data;

    // 2. Honeypot check
    if (honeypot) {
      console.warn("Spam detected via honeypot. Suppressing newsletter subscription.");
      return { success: true };
    }

    // 3. Database Insertion
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        full_name: name ? name.trim() : null,
        email: email.toLowerCase().trim(),
        source,
      });

    if (dbError) {
      // Postgres error code 23505 is unique violation (already subscribed)
      if (dbError.code === "23505") {
        return { success: true, alreadySubscribed: true };
      }
      console.error("Database insert error:", dbError);
      throw new Error(dbError.message);
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("subscribeToNewsletter error:", err);
    const message = err instanceof Error ? err.message : "Failed to subscribe to newsletter";
    return { success: false, error: message };
  }
}
