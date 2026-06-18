import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

if (!resend) {
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
        from: "NPO JIBB <onboarding@resend.dev>",
        to,
        subject,
        html,
        replyTo,
      });

      if (error) {
        console.error("Resend error:", error);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err: any) {
      console.error("Resend execution error:", err);
      return { success: false, error: err.message };
    }
  } else {
    console.log("======================================== MOCK EMAIL ========================================");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Reply-To: ${replyTo || "None"}`);
    console.log("HTML Content:\n", html);
    console.log("=============================================================================================");
    return { success: true, mock: true };
  }
}
