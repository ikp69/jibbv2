import { z } from "zod";
import { isValidPhone, PHONE_ERROR } from "./phone";

export const ExhibitionInquirySchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  name: z.string().min(1, "Full name or company name is required"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine(isValidPhone, PHONE_ERROR),
  message: z.string().min(10, "Message details must be at least 10 characters long"),
  honeypot: z.string().max(0, { message: "Spam detected" }).optional(),
});

export type ExhibitionInquiryInput = z.infer<typeof ExhibitionInquirySchema>;
