import Image from "next/image";
import { cn } from "@/lib/utils";

/* ============================================================
   ChatBubble — Shared story conversation primitive.
   Replaces three separate inline bubble implementations to
   guarantee consistent styling across DesktopStoryHero,
   MobileStoryHero, and StorySection.
   ============================================================ */

export type Speaker = "kenji" | "aarav";

interface ChatBubbleProps {
  speaker: Speaker;
  name: string;
  location: string;
  children: React.ReactNode;
  /** Extra classes applied to the outer wrapper */
  className?: string;
  /** Size variant — "default" for desktop hero, "sm" for mobile/section */
  size?: "default" | "sm";
}

const SPEAKER_META: Record<Speaker, {
  avatarSrc: string;
  avatarAlt: string;
  glassClass: string;
  badgeClass: string;
  avatarBg: string;
}> = {
  kenji: {
    avatarSrc: "/mascots/kenji.png",
    avatarAlt: "Kenji — Tech Executive from Tokyo",
    glassClass: "bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl",
    badgeClass: "bg-jibb-indigo/[0.06] text-jibb-indigo/70 border border-jibb-indigo/[0.08]",
    avatarBg: "bg-jibb-indigo",
  },
  aarav: {
    avatarSrc: "/mascots/aarav.png",
    avatarAlt: "Aarav — Startup Founder from Noida",
    glassClass: "bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl",
    badgeClass: "bg-jibb-orange/[0.06] text-jibb-orange/80 border border-jibb-orange/[0.08]",
    avatarBg: "bg-jibb-orange",
  },
};

export function ChatBubble({
  speaker,
  name,
  location,
  children,
  className,
  size = "default",
}: ChatBubbleProps) {
  const isKenji = speaker === "kenji";
  const meta = SPEAKER_META[speaker];

  const isDefault = size === "default";

  return (
    <div
      className={cn(
        "flex w-full",
        isKenji ? "justify-start" : "justify-end",
        className
      )}
    >
      <div
        className={cn(
          "flex items-end gap-2.5",
          isDefault ? "max-w-[88%] md:max-w-[80%]" : "max-w-[88%]",
          !isKenji && "flex-row-reverse"
        )}
      >
        {/* ── Mascot Avatar (head crop) ── */}
        <div
          className={cn(
            "shrink-0 rounded-full overflow-hidden shadow-md relative",
            isDefault ? "w-9 h-9 md:w-11 md:h-11" : "w-8 h-8",
            meta.avatarBg
          )}
        >
          <Image
            src={meta.avatarSrc}
            alt={meta.avatarAlt}
            fill
            className="object-cover object-top scale-[1.6] translate-y-[15%]"
            sizes="44px"
          />
        </div>

        {/* ── Message block ── */}
        <div className={cn(!isKenji && "items-end flex flex-col")}>
          {/* Name + location badge */}
          <div
            className={cn(
              "flex items-center gap-2 mb-1",
              !isKenji && "justify-end"
            )}
          >
            <span
              className={cn(
                "font-bold text-foreground/90",
                isDefault ? "text-xs" : "text-[10px]"
              )}
            >
              {name}
            </span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full font-medium tracking-wider",
                isDefault ? "text-[9px] md:text-[10px]" : "text-[9px]",
                meta.badgeClass
              )}
            >
              {location}
            </span>
          </div>

          {/* Glassmorphic bubble using CSS custom properties for radius */}
          <div
            className={cn(
              meta.glassClass,
              "text-left text-foreground/80 leading-relaxed",
              isDefault
                ? "p-3.5 md:p-5 text-[13px] md:text-[15px] md:leading-[1.7]"
                : "p-3.5 text-[13px] leading-[1.65]"
            )}
            style={{
              borderRadius: isKenji
                ? "var(--bubble-radius-kenji)"
                : "var(--bubble-radius-aarav)",
            }}
          >
            &ldquo;{children}&rdquo;
          </div>
        </div>
      </div>
    </div>
  );
}
