import { cn } from "@/lib/utils";

interface PageHeroProps {
  children: React.ReactNode;
  className?: string;
}

export function PageHero({
  children,
  className = "py-20 lg:py-28",
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden bg-jibb-gradient page-hero-section", className)}>
      {/* Radial Gradient Background */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 -z-10 h-[440px] md:h-[600px] w-full [background:radial-gradient(125%_125%_at_50%_10%,var(--background)_40%,var(--secondary)_100%)] rounded-b-xl"
      />

      {/* Wave pattern overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 wave-pattern opacity-10 pointer-events-none animate-wave-slide"
      />

      {/* Ambient Glow Accents */}
      <div
        aria-hidden="true"
        className="absolute -top-40 right-[15%] w-[500px] h-[500px] bg-jibb-indigo/10 rounded-full blur-[120px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-jibb-sakura/8 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Page Content Container */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
