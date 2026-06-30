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
