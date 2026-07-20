import { z } from "zod";

// Exhibition Support Form Validation Schema
export const exhibitionSupportSchema = z.object({
  exhibitionName: z.string().min(2, "Exhibition name is required"),
  participationType: z.enum(["exhibitor", "visitor", "speaker", "other"]),
  supportNeeded: z.array(z.string()).min(1, "Please select at least one type of support"),
  preferredDate: z.string().min(1, "Preferred date/timeframe is required"),
  comments: z.string().optional(),
});

// Delegation to Japan Form Validation Schema
export const delegationJapanSchema = z.object({
  sector: z.string().min(2, "Industry sector is required"),
  preferredDates: z.string().min(2, "Preferred visit dates are required"),
  interests: z.array(z.string()).min(1, "Please select at least one core interest"),
  delegateCount: z.number().min(1, "Must have at least 1 delegate").max(50, "Max delegates is 50"),
  comments: z.string().optional(),
});

// Japan Inbound Delegations Form Validation Schema
export const delegationMeetSchema = z.object({
  targetDelegation: z.string().min(2, "Target delegation name is required"),
  pitchPurpose: z.string().min(10, "Please describe your pitch (min 10 characters)"),
  showcaseDetails: z.string().min(10, "Please describe products/services to showcase (min 10 characters)"),
  preferredTimeSlot: z.string().min(1, "Preferred B2B time slot is required"),
});
