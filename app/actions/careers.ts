"use server";

import { createClient } from "@/lib/supabase/server";
import { CareerSchema, validateResume, validateResumeMagicBytes } from "@/app/lib/validation/career";
import { sendEmail } from "@/lib/email/resend";
import { getCareerApplicationNotificationEmail } from "@/lib/email/email-templates";

// Signed URL expiry: 7 days — long enough for HR to review without a permanent link
const RESUME_SIGNED_URL_EXPIRY_SECONDS = 60 * 60 * 24 * 7;

export async function submitCareerApplication(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const position = formData.get("position") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const honeypot = formData.get("honeypot") as string;
    const file = formData.get("resume") as File | null;

    // 1. Validate Form Fields
    const parsed = CareerSchema.safeParse({
      name,
      email,
      phone,
      position,
      coverLetter,
      honeypot,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
    }

    // 2. Honeypot check
    if (honeypot) {
      console.warn("Spam detected via honeypot. Suppressing career application.");
      return { success: true };
    }

    // 3. Validate Resume File — MIME type check (client-reported)
    const resumeVal = validateResume(file);
    if (!resumeVal.isValid || !file) {
      return { success: false, error: resumeVal.error || "Invalid file" };
    }

    // 4. Magic byte validation — verifies true file format, not just browser-reported MIME type
    const arrayBuffer = await file.arrayBuffer();
    if (!validateResumeMagicBytes(arrayBuffer)) {
      return { success: false, error: "File content does not match a valid PDF, DOC, or DOCX format." };
    }

    const buffer = Buffer.from(arrayBuffer);

    // 5. Supabase Client Setup
    const supabase = await createClient();

    // 6. Upload File to Storage (resumes bucket must be set to PRIVATE in Supabase dashboard)
    const fileExt = file.name.split(".").pop();
    const uniqueId = Math.random().toString(36).substring(2, 9);
    const storagePath = `${Date.now()}-${uniqueId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError);
      throw new Error(`Failed to upload resume: ${uploadError.message}`);
    }

    // 7. Generate a short-lived signed URL for the HR notification email.
    //    The storage path (not the URL) is saved in the DB so admins can
    //    generate fresh signed URLs on demand without relying on a permanent link.
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("resumes")
      .createSignedUrl(storagePath, RESUME_SIGNED_URL_EXPIRY_SECONDS);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      // Non-fatal: application still saved, but email won't have the link
      console.error("Failed to generate signed URL for resume:", signedUrlError);
    }

    const resumeSignedUrl = signedUrlData?.signedUrl ?? "(link unavailable — check admin panel)";

    // 8. Insert Application Record — store the storage path, not a permanent public URL
    const { error: dbError } = await supabase
      .from("career_applications")
      .insert({
        name,
        email,
        phone,
        position,
        resume_url: storagePath, // path only; generate signed URL on demand in admin
        cover_letter: coverLetter || null,
        status: "new",
      });

    if (dbError) {
      console.error("Database insert error:", dbError);
      // Attempt to clean up the uploaded file if DB insert fails
      await supabase.storage.from("resumes").remove([storagePath]);
      throw new Error(dbError.message);
    }

    // 9. Send HR Notification Email with the time-limited signed URL
    const emailHtml = getCareerApplicationNotificationEmail({
      name,
      email,
      phone,
      position,
      resumeUrl: resumeSignedUrl,
      coverLetter,
    });

    await sendEmail({
      to: "hr@npo-jibb.org",
      subject: `[Career App] ${position} - ${name}`,
      html: emailHtml,
      replyTo: email,
    });

    return { success: true };
  } catch (err: unknown) {
    console.error("submitCareerApplication error:", err);
    const message = err instanceof Error ? err.message : "Failed to submit application";
    return { success: false, error: message };
  }
}
