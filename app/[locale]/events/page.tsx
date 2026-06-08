import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { Calendar, MapPin, Sparkles, GraduationCap } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { EventRegisterForm } from "@/components/sections/EventRegisterForm";
import { EventGallery } from "@/components/sections/EventGallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: `${t("eventsPage.title")} — Japan India Business Bureau`,
    description: t("eventsPage.subtitle"),
  };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const upcomingEvents = ["semiconductor", "cleanEnergy", "startupPitch"];
  const pastEvents = ["evTech2025"];

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* Cinematic Banner */}
      <PageHero className="py-20 lg:py-28" bgText="EVENTS">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <GraduationCap className="size-3.5 text-jibb-orange" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              {t("eventsPage.title")}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {t("eventsPage.title")}
          </h1>
          
          <p className="text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t("eventsPage.subtitle")}
          </p>
        </div>
      </PageHero>

      {/* Main Content Columns */}
      <section className="py-16 md:py-24 bg-jibb-gradient-subtle">
        <div className="section-container max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left Column: Events Lists */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Upcoming Events */}
              <div className="space-y-6">
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2 text-left">
                  <span className="h-2.5 w-2.5 rounded-full bg-jibb-orange animate-soft-pulse" />
                  {t("eventsPage.upcomingTitle")}
                </h2>
                
                <div className="space-y-6">
                  {upcomingEvents.map((key) => (
                    <div
                      key={key}
                      className="group p-6 bg-card border border-border/80 hover:border-jibb-orange/30 hover:shadow-md rounded-2xl transition-all duration-300 space-y-3 text-left relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-jibb-orange" />
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-bold">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-primary" />
                          <span>{t(`eventsPage.list.${key}.date`)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-primary" />
                          <span>{t(`eventsPage.list.${key}.loc`)}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors leading-snug">
                        {t(`eventsPage.list.${key}.title`)}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {t(`eventsPage.list.${key}.desc`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Events */}
              <div className="space-y-6">
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2 text-left">
                  <span className="h-2.5 w-2.5 rounded-full bg-jibb-indigo" />
                  {t("eventsPage.pastTitle")}
                </h2>
                
                <div className="space-y-6">
                  {pastEvents.map((key) => (
                    <div
                      key={key}
                      className="group p-6 bg-card border border-border/65 hover:border-jibb-indigo/35 hover:shadow-md rounded-2xl transition-all duration-300 space-y-3 text-left relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-jibb-indigo opacity-80" />
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-bold">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-primary" />
                          <span>{t(`eventsPage.list.${key}.date`)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-primary" />
                          <span>{t(`eventsPage.list.${key}.loc`)}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-black text-foreground tracking-tight opacity-90 leading-snug">
                        {t(`eventsPage.list.${key}.title`)}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {t(`eventsPage.list.${key}.desc`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Registration Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2 text-left">
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                  {t("eventsPage.registerTitle")}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t("eventsPage.registerSubtitle")}
                </p>
              </div>
              <EventRegisterForm />
            </div>

          </div>
        </div>
      </section>

      <EventGallery />
    </main>
  );
}
