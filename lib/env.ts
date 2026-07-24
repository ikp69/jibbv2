import { z } from "zod";

const envSchema = z.object({
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),

  // Public App Base URL
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default("https://npo-jibb.org"),

  // Resend Email Configuration
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),

  // Upstash Redis Configuration
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Admin Secrets & Integrations
  ADMIN_UPDATE_SECRET: z.string().optional(),
  NEXT_PUBLIC_CALENDLY_URL: z.string().optional(),
  NEXT_PUBLIC_MS_BOOKINGS_URL: z.string().optional(),

  // Node Environment
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    ADMIN_UPDATE_SECRET: process.env.ADMIN_UPDATE_SECRET,
    NEXT_PUBLIC_CALENDLY_URL: process.env.NEXT_PUBLIC_CALENDLY_URL,
    NEXT_PUBLIC_MS_BOOKINGS_URL: process.env.NEXT_PUBLIC_MS_BOOKINGS_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!result.success) {
    const formattedErrors = result.error.format();
    console.error(
      "[ENV_ERROR] Invalid environment variables configuration:",
      JSON.stringify(formattedErrors, null, 2)
    );
    throw new Error(
      `Invalid environment configuration: ${result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`
    );
  }

  return result.data;
}

/**
 * Validated production environment variables singleton.
 * Ensures fail-fast behavior at application startup if critical secrets or URLs are missing/invalid.
 */
export const env = parseEnv();
