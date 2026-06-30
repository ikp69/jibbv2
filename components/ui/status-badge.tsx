import React from "react";
import { Badge } from "./badge";

type StatusType =
  | "draft"
  | "published"
  | "active"
  | "inactive"
  | "pending"
  | "approved"
  | "closed"
  | "completed"
  | "cancelled"
  | "rejected"
  | "suspended"
  | "open"
  | string;

type StatusBadgeProps = {
  status: StatusType;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase().trim();

  let variant: "default" | "secondary" | "accent" | "muted" | "outline" | "destructive" | "success" = "muted";
  let label = status;

  switch (normalized) {
    case "draft":
      variant = "muted";
      label = "Draft";
      break;
    case "published":
    case "active":
    case "open":
      variant = "success";
      label = normalized === "open" ? "Open" : normalized === "active" ? "Active" : "Published";
      break;
    case "pending":
      variant = "accent"; // amber / orange accent
      label = "Pending";
      break;
    case "approved":
      variant = "default"; // blue/primary
      label = "Approved";
      break;
    case "reviewed":
      variant = "secondary";
      label = "Reviewed";
      break;
    case "closed":
      variant = "outline";
      label = "Closed";
      break;
    case "completed":
      variant = "secondary";
      label = "Completed";
      break;
    case "inactive":
    case "suspended":
    case "cancelled":
    case "rejected":
      variant = "destructive";
      label = normalized === "suspended" ? "Suspended" : normalized === "inactive" ? "Inactive" : normalized === "cancelled" ? "Cancelled" : "Rejected";
      break;
  }

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
