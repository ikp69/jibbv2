import { z } from "zod";

const tierEnum = z.enum(["associate", "silver", "gold", "platinum"]);

// 1. Business Opportunity Schema
export const opportunitySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  industry: z.enum([
    "Semiconductors",
    "Manufacturing",
    "Healthcare",
    "Automotive",
    "Electronics",
    "Energy",
    "Infrastructure",
    "Food",
    "General",
  ]),
  country: z.enum(["Japan", "India", "Both"]),
  lookingFor: z.array(z.string()).min(1, "Specify at least one requirement"),
  deadline: z.string().min(1, "Deadline date is required"),
  visibleTiers: z.array(tierEnum).min(1, "Select at least one visible tier"),
  status: z.enum(["draft", "published", "closed"]).default("draft"),
});

// 2. Opportunity Interest Submission Schema
export const opportunityInterestSchema = z.object({
  opportunityId: z.string().uuid("Invalid opportunity ID"),
  message: z.string().min(10, "Your pitch message must be at least 10 characters"),
  supportingDocumentUrl: z.string().url("Invalid supporting document URL").or(z.literal("")).optional(),
});

// 3. Collaboration Opportunity Schema
export const collaborationSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  industry: z.string().min(2, "Industry is required"),
  visibleTiers: z.array(tierEnum).min(1, "Select at least one visible tier"),
  status: z.enum(["draft", "published", "closed"]).default("draft"),
});

// 4. Collaboration Interest Submission Schema
export const collaborationInterestSchema = z.object({
  collaborationId: z.string().uuid("Invalid collaboration ID"),
  message: z.string().min(10, "Your pitch message must be at least 10 characters"),
});

export type OpportunityInput = z.infer<typeof opportunitySchema>;
export type OpportunityInterestInput = z.infer<typeof opportunityInterestSchema>;
export type CollaborationInput = z.infer<typeof collaborationSchema>;
export type CollaborationInterestInput = z.infer<typeof collaborationInterestSchema>;
