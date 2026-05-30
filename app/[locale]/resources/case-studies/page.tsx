import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="resourcesMenu.caseStudies"
      subtitleKey="resourcesMenu.caseStudiesDesc"
      sectionName="Bilateral Resources"
    />
  );
}
