import { z } from "zod";

export const EventSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company name is required"),
  designation: z.string().min(1, "Designation is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  attendeeType: z.enum(["general", "vip", "speaker", "sponsor"]).default("general"),
  honeypot: z.string().max(0, { message: "Spam detected" }).optional(),
});

export type EventInput = z.infer<typeof EventSchema>;
