import { z } from "zod";

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2, "Representative name must be at least 2 characters"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  phone: z.string().min(5, "Phone number is required"),
  website: z.string().url("Invalid website format").or(z.literal("")).optional(),
  city: z.string().optional(),
  companyDescription: z.string().optional(),
  lookingFor: z.array(z.string()).default([]),
  showInDirectory: z.boolean().default(true),
  companyLogo: z.string().url("Invalid logo URL format").or(z.literal("")).optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
