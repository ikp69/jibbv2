import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="resourcesMenu.insights"
      subtitleKey="resourcesMenu.insightsDesc"
      sectionName="Bilateral Resources"
    />
  );
}
