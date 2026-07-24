"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export async function addLinkedInPost(urnInput: string, secret: string) {
  try {
    // 1. Authenticate with Server Environment Secret via Zod env
    const adminSecret = env.ADMIN_UPDATE_SECRET;
    if (!adminSecret) {
      return { success: false, error: "Admin secret is not configured on the server." };
    }
    const cookieStore = await cookies();
    const effectiveSecret = secret || cookieStore.get("jibb_admin_passcode")?.value;
    if (effectiveSecret !== adminSecret) {
      return { success: false, error: "Invalid admin passcode." };
    }

    // 2. Parse URN from embed code, URLs, or raw URN
    let cleanUrn = urnInput.trim();
    const urnMatch = cleanUrn.match(/urn:li:(share|ugcPost):\d+/);
    if (urnMatch) {
      cleanUrn = urnMatch[0];
    } else {
      return {
        success: false,
        error: "Could not find a valid LinkedIn URN in the input. Ensure it contains 'urn:li:share:[number]' or 'urn:li:ugcPost:[number]'"
      };
    }

    // 3. Insert into database
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from("linkedin_posts")
      .insert({ share_urn: cleanUrn });

    if (dbError) {
      if (dbError.code === "23505") { // unique_violation code
        return { success: false, error: "This post has already been added." };
      }
      console.error("[LINKEDIN_ACTION] Database insert error:", dbError);
      throw new Error(dbError.message);
    }

    // 4. Force on-demand revalidation of the localized homepage layouts
    revalidatePath("/", "layout");

    return { success: true };
  } catch (err: unknown) {
    console.error("[LINKEDIN_ACTION] addLinkedInPost error:", err);
    const message = err instanceof Error ? err.message : "Failed to add LinkedIn post";
    return { success: false, error: message };
  }
}

export async function deleteLinkedInPost(id: string, secret: string) {
  try {
    // 1. Authenticate with Server Environment Secret
    const adminSecret = env.ADMIN_UPDATE_SECRET;
    if (!adminSecret) {
      return { success: false, error: "Admin secret is not configured on the server." };
    }
    const cookieStore = await cookies();
    const effectiveSecret = secret || cookieStore.get("jibb_admin_passcode")?.value;
    if (effectiveSecret !== adminSecret) {
      return { success: false, error: "Invalid admin passcode." };
    }

    // 2. Delete from database
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from("linkedin_posts")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("[LINKEDIN_ACTION] Database delete error:", dbError);
      throw new Error(dbError.message);
    }

    // 3. Force revalidation
    revalidatePath("/", "layout");

    return { success: true };
  } catch (err: unknown) {
    console.error("[LINKEDIN_ACTION] deleteLinkedInPost error:", err);
    const message = err instanceof Error ? err.message : "Failed to delete LinkedIn post";
    return { success: false, error: message };
  }
}

export async function verifyAdminPasscode(secret: string) {
  try {
    const adminSecret = env.ADMIN_UPDATE_SECRET;
    if (!adminSecret) {
      return { success: false, error: "Admin secret is not configured on the server." };
    }
    if (secret === adminSecret) {
      return { success: true };
    }
    return { success: false, error: "Invalid passcode." };
  } catch (err) {
    console.error("[LINKEDIN_ACTION] verifyAdminPasscode error:", err);
    return { success: false, error: "Authentication check failed." };
  }
}
