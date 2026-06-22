"use client";

import Image from "next/image";
import { getAuthorLinkedIn } from "@/lib/authors";
import { useTranslations } from "next-intl";

interface AuthorBoxProps {
  author: string;
  isJa?: boolean;
}

// Map author names to their translation keys
const authorTranslationKeyMap: Record<string, string> = {
  "Varun Tyagi": "varun",
  "Ujjawal Dahiya": "ujjawal",
  "Pratiksha Pandey": "pratiksha",
  "Vardaan Chaudhary": "vardaan",
  "Shigemaro Yasui": "shigemaro",
  "Mai Hashikura": "mai",
  "Hitesh Gupta": "hitesh",
  "Gyanendra Yadav": "gyanendra",
  "Akash Pandey": "akash",
  "Nobuchika Akiya": "nobuchika",
  "Aya Saito": "aya",
};

// Map author names to their images
const authorImageMap: Record<string, string> = {
  "Varun Tyagi": "/leaders/varun-tyagi.png",
  "Ujjawal Dahiya": "/leaders/ujjawal-dahiya.png",
  "Pratiksha Pandey": "/leaders/pratiksha-pandey.png",
  "Vardaan Chaudhary": "/leaders/vardaan-chaudhary.png",
  "Shigemaro Yasui": "/leaders/shigemaro-yasui.png",
  "Mai Hashikura": "/leaders/mai-hashikura.png",
  "Hitesh Gupta": "/leaders/hitesh-gupttaa.png",
  "Gyanendra Yadav": "/leaders/gyanendra-yadav.png",
  "Akash Pandey": "/leaders/akash-pandey.png",
  "Nobuchika Akiya": "/leaders/nobichuka-akiya.png",
  "Aya Saito": "/leaders/aya-saito.png",
};

// LinkedIn SVG Icon Component
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.249-.129.597-.129.946v5.421h-3.554s.05-8.789 0-9.714h3.554v1.375c.427-.659 1.191-1.595 2.898-1.595 2.117 0 3.704 1.384 3.704 4.362v5.572zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.704 0-.955.771-1.704 1.956-1.704 1.184 0 1.915.749 1.915 1.704 0 .946-.731 1.704-1.956 1.704zm1.609 11.597H3.728V9.538h3.218v10.914zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

export function AuthorBox({ author, isJa = false }: AuthorBoxProps) {
  const t = useTranslations("leadershipPage");
  const linkedInUrl = getAuthorLinkedIn(author);
  const authorImage = authorImageMap[author];
  const translationKey = authorTranslationKeyMap[author];

  // Get the unique bio for each author from translations
  const authorBio = translationKey
    ? t(`members.${translationKey}.bio`)
    : "Leadership team member at JIBB";

  return (
    <div className="rounded-3xl p-6 bg-card border border-border/80 shadow-jibb relative overflow-hidden space-y-4">
      <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
      
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
        {isJa ? "著者について" : "About the Author"}
      </h3>

      {/* Image & Name in single row */}
      <div className="flex items-center gap-3">
        {/* Author Image */}
        {authorImage && (
          <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden border border-border/50">
            <Image
              src={authorImage}
              alt={author}
              fill
              className="object-cover object-top"
              sizes="56px"
            />
          </div>
        )}

        {/* Author Name */}
        <h4 className="text-sm font-bold text-foreground">{author}</h4>
      </div>

      {/* Bio - Full width on next row - Unique for each author */}
      <div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {authorBio}
        </p>
      </div>

      {/* LinkedIn Link */}
      {linkedInUrl && (
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-jibb-orange hover:text-jibb-orange/80 transition-colors"
        >
          <LinkedInIcon className="size-3.5" />
          LinkedIn
        </a>
      )}
    </div>
  );
}
