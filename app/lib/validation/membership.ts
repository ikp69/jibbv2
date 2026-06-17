import { z } from "zod";

export const MembershipSchema = z.object({
  membershipTier: z.enum(["associate", "silver", "gold", "platinum"]),
  companyName: z.string().min(1, "Company name is required"),
  contactPerson: z.string().min(1, "Contact person name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number is required and must be valid"),
  industry: z.string().min(1, "Industry classification is required"),
  companySize: z.string().min(1, "Company size description is required"),
  message: z.string().optional().or(z.literal("")),
  honeypot: z.string().max(0, { message: "Spam detected" }).optional(),
});

export type MembershipInput = z.infer<typeof MembershipSchema>;
