"use server";

import { createClient } from "@/lib/supabase/server";
import { CareerSchema, validateResume } from "@/app/lib/validation/career";
import { sendEmail } from "@/lib/email/resend";
import { getCareerApplicationNotificationEmail } from "@/lib/email/email-templates";

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

    // 3. Validate Resume File
    const resumeVal = validateResume(file);
    if (!resumeVal.isValid || !file) {
      return { success: false, error: resumeVal.error || "Invalid file" };
    }

    // 4. Supabase Client Setup
    const supabase = await createClient();

    // 5. Upload File to Storage
    const fileExt = file.name.split(".").pop();
    const uniqueId = Math.random().toString(36).substring(2, 9);
    const fileName = `${Date.now()}-${uniqueId}.${fileExt}`;
    const storagePath = `${fileName}`;

    // Convert file to arrayBuffer and then Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to 'resumes' bucket
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError);
      throw new Error(`Failed to upload resume: ${uploadError.message}`);
    }

    // Get the Public URL of the uploaded resume
    const { data: { publicUrl } } = supabase.storage
      .from("resumes")
      .getPublicUrl(storagePath);

    // 6. Insert Application Record into Database
    const { error: dbError } = await supabase
      .from("career_applications")
      .insert({
        name,
        email,
        phone,
        position,
        resume_url: publicUrl,
        cover_letter: coverLetter || null,
        status: "new",
      });

    if (dbError) {
      console.error("Database insert error:", dbError);
      // Attempt to clean up uploaded file if DB insert fails
      await supabase.storage.from("resumes").remove([storagePath]);
      throw new Error(dbError.message);
    }

    // 7. Send HR Notification Email
    const emailHtml = getCareerApplicationNotificationEmail({
      name,
      email,
      phone,
      position,
      resumeUrl: publicUrl,
      coverLetter,
    });

    await sendEmail({
      to: "hr@npo-jibb.org",
      subject: `[Career App] ${position} - ${name}`,
      html: emailHtml,
      replyTo: email,
    });

    return { success: true };
  } catch (err: any) {
    console.error("submitCareerApplication error:", err);
    return { success: false, error: err.message || "Failed to submit application" };
  }
}
