export type NavItem = {
  label: string;
  path: string;
  icon: string;
  isPlaceholder?: boolean;
};

export type NavGroup = {
  title?: string;
  items: NavItem[];
};

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", path: "/admin/dashboard", icon: "LayoutDashboard" },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Announcements", path: "/admin/announcements", icon: "Megaphone" },
      { label: "Market Reports", path: "/admin/reports", icon: "FileText" },
      { label: "Newsletters", path: "/admin/newsletters", icon: "Newspaper" },
      { label: "Training Programs", path: "/admin/training", icon: "BookOpen" },
      { label: "Invite-Only Events", path: "/admin/events", icon: "Calendar" },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Business Matching", path: "/admin/business-matching", icon: "Briefcase" },
      { label: "Collaboration", path: "/admin/collaboration", icon: "ShieldCheck" },
    ],
  },
  {
    title: "Members",
    items: [
      { label: "Manage Members", path: "/admin/members", icon: "Users" },
      { label: "Member Directory", path: "/admin/member-directory", icon: "Building" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Media Library", path: "/admin/media-library", icon: "FolderOpen" },
      { label: "Website Forms", path: "/admin/website-forms", icon: "FileSpreadsheet" },
      { label: "Audit Logs", path: "/admin/audit-logs", icon: "History" },
      { label: "Settings", path: "/admin/settings", icon: "Settings" },
    ],
  },
];

export const PORTAL_NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", path: "/portal/dashboard", icon: "LayoutDashboard" },
    ],
  },
  {
    title: "Grow & Learn",
    items: [
      { label: "Announcements", path: "/portal/announcements", icon: "Megaphone" },
      { label: "Market Reports", path: "/portal/reports", icon: "FileText" },
      { label: "Newsletters", path: "/portal/newsletters", icon: "Newspaper" },
      { label: "Business Matching", path: "/portal/business-matching", icon: "Briefcase" },
      { label: "Training Programs", path: "/portal/training", icon: "BookOpen" },
      { label: "Collaboration", path: "/portal/collaboration", icon: "ShieldCheck" },
      { label: "Invite-Only Events", path: "/portal/events", icon: "Calendar" },
    ],
  },
  {
    title: "Japan Engagement",
    items: [
      { label: "Exhibition Support", path: "/portal/exhibition-support", icon: "HelpCircle", isPlaceholder: true },
      { label: "Delegation to Japan", path: "/portal/delegation-japan", icon: "Calendar", isPlaceholder: true },
      { label: "Japan Delegations", path: "/portal/delegation-meet", icon: "Users", isPlaceholder: true },
    ],
  },
  {
    title: "Networking",
    items: [
      { label: "Member Directory", path: "/portal/member-directory", icon: "Building" },
      { label: "Company Profile", path: "/portal/profile", icon: "User" },
    ],
  },
];
