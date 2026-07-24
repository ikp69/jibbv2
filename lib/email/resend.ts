import { Resend } from "resend";
import { env } from "@/lib/env";

const apiKey = env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

if (!resend && env.NODE_ENV === "development") {
  console.warn("⚠️ Warning: RESEND_API_KEY is not defined in the environment. Emails will be logged to the console instead of being sent.");
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL || "Japan-India Business Bureau - JIBB (NPO) <noreply@npo-jibb.org>",
        to,
        subject,
        html,
        replyTo,
      });

      if (error) {
        console.error("[EMAIL_SERVICE] Resend dispatch error:", error);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown Resend error";
      console.error("[EMAIL_SERVICE] Resend execution exception:", { message });
      return {
        success: false,
        error: message,
      };
    }
  } else {
    if (env.NODE_ENV === "development") {
      console.log("======================================== MOCK EMAIL ========================================");
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Reply-To: ${replyTo || "None"}`);
      console.log("HTML Content:\n", html);
      console.log("=============================================================================================");
    }
    return { success: true, mock: true };
  }
}
