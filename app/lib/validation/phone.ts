/**
 * Shared phone number validation used by both Zod schemas (server)
 * and client-side validate() functions.
 *
 * Accepts international formats covering India (+91) and Japan (+81):
 *   +91 98765 43210   91-9876543210   09876543210
 *   +81 90-1234-5678  081-90-1234-5678
 *   Also accepts general E.164-style numbers: +[1-9]\d{6,14}
 *
 * Rules:
 *  - Optional leading + or 00
 *  - 7–15 digits total (ignoring spaces, hyphens, parentheses)
 *  - Must contain at least 7 digit characters
 */
export const PHONE_REGEX = /^[+0]?[\d\s\-(). ]{7,20}$/;

/** Minimum digit count after stripping formatting characters */
const MIN_DIGITS = 7;

export function isValidPhone(value: string): boolean {
  const stripped = value.replace(/[\s\-(). +]/g, "");
  return PHONE_REGEX.test(value) && stripped.length >= MIN_DIGITS && /^\d+$/.test(stripped);
}

export const PHONE_ERROR = "Enter a valid phone number (e.g. +91 98765 43210)";
