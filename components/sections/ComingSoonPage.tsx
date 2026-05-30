import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Hourglass, ShieldCheck, Mail } from "lucide-react";

interface ComingSoonPageProps {
  titleKey: string;
  subtitleKey: string;
  sectionName: string;
}

export function ComingSoonPage({
  titleKey,
  subtitleKey,
  sectionName,
}: ComingSoonPageProps) {
  const t = useTranslations();

  // Safeguard translation lookups
  let title = "Coming Soon";
  try { title = t(titleKey); } catch { title = titleKey.split(".").pop() || titleKey; }

  let subtitle = "This page is currently being curated.";
  try { subtitle = t(subtitleKey); } catch { subtitle = subtitleKey; }

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* ============================================================
          CINEMATIC BANNER
          ============================================================ */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-jibb-gradient">
        {/* Wave pattern overlay */}
        <div aria-hidden="true" className="absolute inset-0 wave-pattern opacity-10 pointer-events-none animate-wave-slide" />
        
        {/* Ambient Glow */}
        <div aria-hidden="true" className="absolute -top-40 right-[15%] w-[450px] h-[450px] bg-jibb-orange/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              {sectionName}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            {title}
          </h1>
          
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </section>

      {/* ============================================================
          COMING SOON DETAILS SHOWCASE
          ============================================================ */}
      <section className="py-20 md:py-28 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-3xl text-center space-y-8">
          <div className="relative rounded-3xl p-8 sm:p-12 bg-card border border-border/80 shadow-jibb-lg overflow-hidden flex flex-col items-center gap-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="p-4 rounded-full bg-primary/5 text-primary animate-soft-pulse">
              <Hourglass className="size-8 text-jibb-orange" />
            </div>

            <div className="space-y-3 max-w-md">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Curating Premium Content
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We are actively developing this section to include bilateral data frameworks, high-resolution strategic case studies, and corporate listings for the Tokyo–Noida industrial axis.
              </p>
            </div>

            <div className="border-t border-border/60 w-full pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="accent" className="w-full font-bold gap-1.5 shadow-md">
                  Inquire Advisory <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/membership" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full font-semibold">
                  Join JIBB Network
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
