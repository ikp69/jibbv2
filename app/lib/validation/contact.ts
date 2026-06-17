import { z } from "zod";

export const ContactSchema = z.object({
  inquiryType: z.string().min(1, "Inquiry type is required"),
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Message details must be at least 10 characters long"),
  honeypot: z.string().max(0, { message: "Spam detected" }).optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;
