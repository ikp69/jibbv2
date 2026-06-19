"use server";

import { createClient } from "@/lib/supabase/server";
import { MatchmakingSchema, type MatchmakingInput } from "@/app/lib/validation/matchmaking";
import { sendEmail } from "@/lib/email/resend";
import { getMatchRequestNotificationEmail } from "@/lib/email/email-templates";

export async function submitMatchmakingRequest(data: MatchmakingInput) {
  try {
    const supabase = await createClient();

    // 1. Verify User Session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in to submit a matchmaking request." };
    }

    // 2. Validate input
    const parsed = MatchmakingSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
    }

    const { title, details, targetSector } = parsed.data;

    // 3. Database Insertion
    const { error: dbError } = await supabase
      .from("business_matches")
      .insert({
        member_id: user.id,
        title,
        details,
        target_sector: targetSector,
        status: "new",
      });

    if (dbError) {
      console.error("Database insert error:", dbError);
      throw new Error(dbError.message);
    }

    // 4. Retrieve Profile data for notification enrichments
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, company_name")
      .eq("id", user.id)
      .single();

    const memberName = profile?.full_name || user.email || "Unknown Member";

    // 5. Send Notification Email to JIBB Partnerships Team
    const emailHtml = getMatchRequestNotificationEmail({
      memberName: profile ? `${profile.full_name} (${profile.company_name})` : memberName,
      memberEmail: user.email || "",
      title,
      targetSector,
      details,
    });

    await sendEmail({
      to: "hitesh@npo-jibb.org",
      subject: `[B2B Match Request] ${targetSector.toUpperCase()} - ${profile?.company_name || memberName}`,
      html: emailHtml,
      replyTo: user.email,
    });

    return { success: true };
  } catch (err: unknown) {
    console.error("submitMatchmakingRequest error:", err);
    const message = err instanceof Error ? err.message : "Failed to submit matchmaking request";
    return { success: false, error: message };
  }
}
