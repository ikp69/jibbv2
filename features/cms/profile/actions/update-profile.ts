"use server";

import { createClient } from "@/lib/supabase/server";
import { profileUpdateSchema, type ProfileUpdateInput } from "../schemas/profile-schema";
import { headers } from "next/headers";

export type ProfileResult = {
  success: boolean;
  error?: string;
};

export async function updateProfile(input: ProfileUpdateInput): Promise<ProfileResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = profileUpdateSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input data",
      };
    }

    const data = parsed.data;

    // Get previous details for logs
    const { data: oldProfile } = await supabase
      .from("profiles")
      .select("full_name, designation, phone, website, city, company_description, looking_for, show_in_directory, company_logo")
      .eq("id", user.id)
      .single();

    // Update profile
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.fullName,
        designation: data.designation,
        phone: data.phone,
        website: data.website || null,
        city: data.city || null,
        company_description: data.companyDescription || null,
        looking_for: data.lookingFor,
        show_in_directory: data.showInDirectory,
        company_logo: data.companyLogo || null,
      })
      .eq("id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    // Write audit log
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "update_profile",
      table_name: "profiles",
      record_id: user.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      old_values: oldProfile,
      new_values: data,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}
