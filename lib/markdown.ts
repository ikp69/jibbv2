import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

export interface MarkdownPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
  featured: boolean;
  contentHtml: string;
  locale: string;
  corridor?: string;
  client?: string;
  impact?: string;
}

export type PostType = "blog" | "insights" | "thought-leadership";

const CONTENT_DIRECTORY = path.join(process.cwd(), "content");

/**
 * Reads a markdown post by its slug, parses metadata and body.
 * Falls back to English if the localized file is not found.
 */
export async function getPostBySlug(
  type: PostType,
  slug: string,
  locale: string
): Promise<MarkdownPost | null> {
  try {
    let filePath = path.join(CONTENT_DIRECTORY, type, locale, `${slug}.md`);

    // Verify requested localized file exists
    let fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);

    // Fallback to English if Japanese doesn't exist
    if (!fileExists && locale !== "en") {
      filePath = path.join(CONTENT_DIRECTORY, type, "en", `${slug}.md`);
      fileExists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);
    }

    if (!fileExists) {
      return null;
    }

    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // Convert markdown to HTML, then sanitize to prevent XSS if content
    // is ever edited outside of the repository (e.g., CMS integration).
    const rawHtml = await marked.parse(content);
    const contentHtml = sanitizeHtml(rawHtml, {
      allowedTags: [
        ...sanitizeHtml.defaults.allowedTags,
        "img", "figure", "figcaption", "details", "summary",
      ],
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "class", "width", "height", "loading"],
        "*": ["class", "id"],
        a: ["href", "name", "target", "rel"],
      },
      // Ensure external links open safely
      transformTags: {
        a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
      },
    });

    return {
      slug,
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
      author: data.author || "",
      image: data.image || "",
      tags: data.tags || [],
      featured: data.featured ?? false,
      contentHtml,
      locale,
      corridor: data.corridor,
      client: data.client,
      impact: data.impact,
    };
  } catch (error) {
    console.error(`Error parsing markdown post for ${type}/${slug} in locale ${locale}:`, error);
    return null;
  }
}

/**
 * Retrieves all markdown posts of a certain type, sorted by date descending.
 */
export async function getAllPosts(
  type: PostType,
  locale: string
): Promise<MarkdownPost[]> {
  try {
    const localeDir = path.join(CONTENT_DIRECTORY, type, locale);

    let files: string[] = [];
    try {
      files = await fs.readdir(localeDir);
    } catch {
      // If directory for Japanese/other locale doesn't exist, load English list
      if (locale !== "en") {
        try {
          const fallbackDir = path.join(CONTENT_DIRECTORY, type, "en");
          files = await fs.readdir(fallbackDir);
        } catch {
          return [];
        }
      } else {
        return [];
      }
    }

    const posts: MarkdownPost[] = [];

    for (const file of files) {
      if (file.endsWith(".md")) {
        const slug = file.replace(/\.md$/, "");
        const post = await getPostBySlug(type, slug, locale);
        if (post) {
          posts.push(post);
        }
      }
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error(`Error fetching all posts for ${type} in locale ${locale}:`, error);
    return [];
  }
}

/**
 * Returns all unique slugs for a content type.
 * Reads from both "en" and "ja" directories and deduplicates.
 * Used by generateStaticParams in detail pages.
 */
export async function getAllSlugs(type: PostType): Promise<string[]> {
  const locales = ["en", "ja"];
  const slugSet = new Set<string>();

  for (const locale of locales) {
    const dir = path.join(CONTENT_DIRECTORY, type, locale);
    try {
      const files = await fs.readdir(dir);
      for (const file of files) {
        if (file.endsWith(".md")) {
          slugSet.add(file.replace(/\.md$/, ""));
        }
      }
    } catch {
      // Directory may not exist for this locale, skip
    }
  }

  return Array.from(slugSet);
}
