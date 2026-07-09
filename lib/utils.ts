import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function recordViewedResource(resource: {
  id: string;
  title: string;
  category: string;
  resource_type: string;
  file_url: string;
}) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("jibb_recently_viewed_resources");
    let list = raw ? JSON.parse(raw) : [];
    // Remove if duplicate
    list = list.filter((item: any) => item.id !== resource.id);
    // Add to front
    list.unshift({
      id: resource.id,
      title: resource.title,
      category: resource.category,
      resource_type: resource.resource_type,
      file_url: resource.file_url,
      viewedAt: new Date().toISOString()
    });
    // Limit to 8 items
    list = list.slice(0, 8);
    localStorage.setItem("jibb_recently_viewed_resources", JSON.stringify(list));
  } catch (e) {
    console.error("Failed to record viewed resource in localStorage:", e);
  }
}

