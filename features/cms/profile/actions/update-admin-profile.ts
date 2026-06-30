"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { headers } from "next/headers";

const adminProfileUpdateSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
});

export type AdminProfileResult = {
  success: boolean;
  error?: string;
};

export async function updateAdminProfile(input: {
  companyName: string;
  designation: string;
}): Promise<AdminProfileResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = adminProfileUpdateSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input data",
      };
    }

    // Verify role is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, company_name, designation")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Access denied. Administrator privileges required." };
    }

    // Update profiles
    const { error } = await supabase
      .from("profiles")
      .update({
        company_name: parsed.data.companyName,
        designation: parsed.data.designation,
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
      action: "update_admin_profile",
      table_name: "profiles",
      record_id: user.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      old_values: {
        company_name: profile.company_name,
        designation: profile.designation,
      },
      new_values: parsed.data,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}
