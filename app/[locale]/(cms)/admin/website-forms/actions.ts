"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateFormStatus(
  tableName: "contact_inquiries" | "membership_applications" | "career_applications",
  id: string,
  status: string
) {
  try {
    const supabase = await createClient();

    // If it's a membership approval, we can also record approved_at
    const updateData: any = { status };
    if (tableName === "membership_applications" && status === "approved") {
      updateData.approved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/website-forms");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

export async function getSignedResumeUrl(filePath: string) {
  try {
    const supabase = await createClient();
    
    // Check if the user is an admin before generating the signed URL
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }
    
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { success: false, error: "Forbidden" };
    }

    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(filePath, 60 * 15); // 15 minutes is plenty for download

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, signedUrl: data.signedUrl };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}
