import { z } from "zod";

const tierEnum = z.enum(["associate", "silver", "gold", "platinum"]);

// 1. Announcement Schema
export const announcementSchema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    content: z.string().min(5, "Content must be at least 5 characters"),
    bannerImage: z.string().url("Invalid banner image URL").or(z.literal("")).optional(),
    attachment: z.string().url("Invalid attachment URL").or(z.literal("")).optional(),
    externalLink: z.string().url("Invalid external link URL").or(z.literal("")).optional(),
    visibleTiers: z.array(tierEnum).min(1, "Select at least one visible tier"),
    isPinned: z.boolean().default(false),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    publishDate: z.string().optional(),
    expiryDate: z.string().or(z.literal("")).optional(),
  })
  .refine(
    (data) => {
      if (data.publishDate && data.expiryDate) {
        const publish = new Date(data.publishDate);
        const expiry = new Date(data.expiryDate);
        return expiry > publish;
      }
      return true;
    },
    {
      message: "Expiry date must be after publish date",
      path: ["expiryDate"],
    }
  );

// 2. Report Schema
export const reportSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  category: z.enum([
    "Market Intelligence",
    "Reports",
    "Training",
    "Guidelines",
    "Case Studies",
    "Forms",
    "Other",
  ]),
  resourceType: z.enum(["pdf", "image", "video", "spreadsheet", "presentation", "document"]),
  fileUrl: z.string().url("Invalid file URL"),
  fileSize: z.number().int().positive().optional(),
  tags: z.array(z.string()).default([]),
  visibleTiers: z.array(tierEnum).min(1, "Select at least one visible tier"),
});

// 3. Training Program Schema
export const trainingSchema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().optional(),
    category: z.enum([
      "Culture",
      "Language",
      "Corporate",
      "Leadership",
      "Problem Solving",
      "Workshop",
      "Seminar",
    ]),
    duration: z.string().min(1, "Duration description is required"),
    location: z.string().min(2, "Location details are required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    capacity: z.number().int().positive("Capacity must be positive"),
    visibleTiers: z.array(tierEnum).min(1, "Select at least one visible tier"),
    status: z.enum(["draft", "open", "closed", "completed"]).default("draft"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

// 4. Event Schema
export const eventSchema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().optional(),
    location: z.string().min(2, "Location details are required"),
    eventDate: z.string().min(1, "Event date is required"),
    registrationDeadline: z.string().min(1, "Deadline is required"),
    capacity: z.number().int().positive("Capacity must be positive"),
    visibleTiers: z.array(tierEnum).min(1, "Select at least one visible tier"),
    status: z.enum(["draft", "open", "closed", "completed", "cancelled"]).default("draft"),
  })
  .refine(
    (data) => {
      const deadline = new Date(data.registrationDeadline);
      const event = new Date(data.eventDate);
      return deadline < event;
    },
    {
      message: "Registration deadline must be before event date",
      path: ["registrationDeadline"],
    }
  );

export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type TrainingInput = z.infer<typeof trainingSchema>;
export type EventInput = z.infer<typeof eventSchema>;
