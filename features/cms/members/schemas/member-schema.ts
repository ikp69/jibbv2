import { z } from "zod";

export const memberSchema = z
  .object({
    companyName: z.string().min(2, "Company name is required"),
    representativeName: z.string().min(2, "Representative name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(5, "Phone number is required"),
    designation: z.string().min(2, "Designation is required"),
    membershipTier: z.enum(["associate", "silver", "gold", "platinum"]),
    membershipStartDate: z.string().min(1, "Start date is required"),
    membershipEndDate: z.string().min(1, "End date is required"),
    industry: z.string().min(2, "Industry sector is required"),
    country: z.string().min(2, "Country is required"),
    city: z.string().optional(),
    website: z.string().url("Invalid website URL format").or(z.literal("")).optional(),
    companyDescription: z.string().optional(),
    lookingFor: z.array(z.string()).default([]),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.membershipStartDate);
      const end = new Date(data.membershipEndDate);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["membershipEndDate"],
    }
  );

export type MemberInput = z.infer<typeof memberSchema>;
