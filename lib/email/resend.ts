import { Resend } from "resend";
import dns from "dns";

// Prevent Windows connection suffix redirection (like .domain.name) from breaking Resend API calls in development
if (process.env.NODE_ENV === "development") {
  const originalLookup = dns.lookup;
  // @ts-ignore
  dns.lookup = function (hostname, options, callback) {
    const cb = typeof options === "function" ? options : callback;
    const opts = typeof options === "object" ? options : {};

    if (hostname === "api.resend.com") {
      dns.resolve4("api.resend.com", (err, addresses) => {
        if (err || !addresses || addresses.length === 0) {
          return (originalLookup as any)(hostname, options, callback);
        }
        if (opts.all) {
          const results = addresses.map((addr) => ({ address: addr, family: 4 as const }));
          return (cb as any)(null, results);
        } else {
          return (cb as any)(null, addresses[0], 4);
        }
      });
      return;
    }
    return (originalLookup as any)(hostname, options, callback);
  };
}

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
        from: process.env.RESEND_FROM_EMAIL || "NPO JIBB <noreply@npo-jibb.org>",
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
      console.error("Resend execution error:", {
        message: err?.message,
        cause: err?.cause,
        stack: err?.stack,
      });
      return {
        success: false,
        error: err?.message || "Unknown Resend error",
      };
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
