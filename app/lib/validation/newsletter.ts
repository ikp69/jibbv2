import { z } from "zod";

export const NewsletterSchema = z.object({
  email: z.string().email("Invalid email format"),
  source: z.string().default("footer"),
  honeypot: z.string().max(0, { message: "Spam detected" }).optional(),
});

export type NewsletterInput = z.infer<typeof NewsletterSchema>;
