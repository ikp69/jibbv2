/**
 * Centralized Production Structured JSON Logger.
 * Emits uniform JSON log events for observability dashboards (Datadog, Axiom, Vercel Logs).
 * Automatically redacts sensitive fields (passwords, tokens, secrets).
 */

export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogPayload {
  message: string;
  context?: string;
  metadata?: Record<string, unknown>;
  error?: Error | unknown;
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value !== "object" || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  const sanitized: Record<string, unknown> = {};
  const sensitiveKeys = new Set(["password", "token", "access_token", "serviceKey", "secret", "authorization"]);

  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (sensitiveKeys.has(k.toLowerCase())) {
      sanitized[k] = "[REDACTED]";
    } else {
      sanitized[k] = sanitizeValue(v);
    }
  }

  return sanitized;
}

export class Logger {
  private static emit(level: LogLevel, payload: LogPayload): void {
    const timestamp = new Date().toISOString();
    const formattedMeta = payload.metadata ? sanitizeValue(payload.metadata) : undefined;
    const errorMessage = payload.error instanceof Error ? payload.error.message : payload.error ? String(payload.error) : undefined;

    const event = {
      timestamp,
      level,
      context: payload.context || "APP",
      message: payload.message,
      ...(formattedMeta ? { metadata: formattedMeta } : {}),
      ...(errorMessage ? { error: errorMessage } : {}),
    };

    const output = JSON.stringify(event);

    switch (level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      case "info":
        console.info(output);
        break;
      case "debug":
        if (process.env.NODE_ENV === "development") {
          console.debug(output);
        }
        break;
    }
  }

  static info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    Logger.emit("info", { message, context, metadata });
  }

  static warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    Logger.emit("warn", { message, context, metadata });
  }

  static error(message: string, error?: Error | unknown, context?: string, metadata?: Record<string, unknown>): void {
    Logger.emit("error", { message, error, context, metadata });
  }
}
