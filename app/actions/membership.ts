"use server";

import { createClient } from "@/lib/supabase/server";
import { MembershipSchema, type MembershipInput } from "@/app/lib/validation/membership";
import { sendEmail } from "@/lib/email/resend";
import { 
  getMembershipNotificationEmail, 
  getMembershipConfirmationEmail 
} from "@/lib/email/email-templates";

export async function submitMembershipApplication(data: MembershipInput) {
  try {
    // 1. Zod Server-side Validation
    const parsed = MembershipSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
    }

    const { 
      membershipTier, 
      companyName, 
      contactPerson, 
      email, 
      phone, 
      industry, 
      companySize, 
      message, 
      honeypot 
    } = parsed.data;

    // 2. Honeypot check
    if (honeypot) {
      console.warn("Spam detected via honeypot. Suppressing membership application.");
      return { success: true };
    }

    // 3. Database Insertion
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from("membership_applications")
      .insert({
        membership_tier: membershipTier,
        company_name: companyName,
        contact_person: contactPerson,
        email,
        phone,
        industry: industry || null,
        company_size: companySize || null,
        message: message || null,
        status: "new",
      });

    if (dbError) {
      console.error("Database insert error:", dbError);
      throw new Error(dbError.message);
    }

    // 4. Send Email Notification to Admin (JIBB Membership Team)
    const adminEmailHtml = getMembershipNotificationEmail({
      membershipTier,
      companyName,
      contactPerson,
      email,
      phone,
      industry,
      companySize,
      message,
    });
    await sendEmail({
      to: "membership@npo-jibb.org",
      subject: `[Membership App] ${membershipTier.toUpperCase()} - ${companyName}`,
      html: adminEmailHtml,
      replyTo: email,
    });

    // 5. Send Confirmation Email to Candidate
    const candidateEmailHtml = getMembershipConfirmationEmail({
      contactPerson,
      membershipTier,
    });
    await sendEmail({
      to: email,
      subject: `Your NPO JIBB Membership Application [${membershipTier.toUpperCase()}]`,
      html: candidateEmailHtml,
    });

    return { success: true };
  } catch (err: any) {
    console.error("submitMembershipApplication error:", err);
    return { success: false, error: err.message || "Failed to submit membership application" };
  }
}
