import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function EcosystemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="aboutMenu.ecosystem"
      subtitleKey="aboutMenu.ecosystemDesc"
      sectionName="About JIBB"
    />
  );
}
