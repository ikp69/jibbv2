import { z } from "zod";
import { isValidPhone, PHONE_ERROR } from "./phone";

export const MembershipSchema = z.object({
  membershipTier: z.enum(["associate", "silver", "gold", "platinum"]),
  companyName: z.string().min(1, "Company name is required"),
  contactPerson: z.string().min(1, "Contact person name is required"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine(isValidPhone, PHONE_ERROR),
  // industry and companySize are optional at the schema level
  industry: z.string().optional().or(z.literal("")),
  companySize: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
  honeypot: z.string().max(0, { message: "Spam detected" }).optional(),
});

export type MembershipInput = z.infer<typeof MembershipSchema>;
