import { z } from "zod";
import { isValidPhone, PHONE_ERROR } from "./phone";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const CareerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine(isValidPhone, PHONE_ERROR),
  position: z.string().min(1, "Position is required"),
  coverLetter: z.string().optional().or(z.literal("")),
  honeypot: z.string().max(0, { message: "Spam detected" }).optional(),
});

/**
 * Validates resume file by MIME type (browser-reported) AND magic bytes
 * (the actual binary signature). This prevents spoofed file type attacks.
 */
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

/**
 * Validates file magic bytes on the server side.
 * Must be called with an ArrayBuffer already read from the file.
 * - PDF:  starts with %PDF  → 25 50 44 46
 * - DOCX: PK zip header     → 50 4B 03 04
 * - DOC:  Compound Binary   → D0 CF 11 E0
 */
export function validateResumeMagicBytes(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer.slice(0, 8));

  const isPDF  = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
  const isDOCX = bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04;
  const isDOC  = bytes[0] === 0xD0 && bytes[1] === 0xCF && bytes[2] === 0x11 && bytes[3] === 0xE0;

  return isPDF || isDOCX || isDOC;
}
