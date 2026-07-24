import { createAdminClient } from "@/lib/supabase/admin";
import { headers } from "next/headers";

export type AuditLogInput = {
  userId: string;
  action: string;
  tableName: string;
  recordId: string;
  oldValues?: unknown;
  newValues?: unknown;
};

/**
 * Enterprise Audit Service to log security events and database mutations.
 */
export class AuditService {
  static async log(input: AuditLogInput): Promise<void> {
    try {
      const adminClient = createAdminClient();
      const headersList = await headers();
      const userAgent = headersList.get("user-agent") || undefined;
      const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

      await adminClient.from("audit_logs").insert({
        user_id: input.userId,
        action: input.action,
        table_name: input.tableName,
        record_id: input.recordId,
        ip_address: ipAddress,
        user_agent: userAgent,
        old_values: input.oldValues ?? null,
        new_values: input.newValues ?? null,
      });
    } catch (auditErr) {
      console.warn(`[AUDIT_SERVICE] Log failure for action ${input.action}:`, auditErr);
    }
  }
}
