import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const CareerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  position: z.string().min(1, "Position is required"),
  coverLetter: z.string().optional().or(z.literal("")),
  honeypot: z.string().max(0, { message: "Spam detected" }).optional(),
});

export function validateResume(file: File | null | undefined): { isValid: boolean; error?: string } {
  if (!file || file.size === 0) {
    return { isValid: false, error: "Resume file is required" };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: "Resume file size must be less than 5MB" };
  }
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return { isValid: false, error: "Only .pdf, .doc, and .docx files are allowed" };
  }
  return { isValid: true };
}
