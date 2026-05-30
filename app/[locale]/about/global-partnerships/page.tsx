import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function GlobalPartnershipsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="aboutMenu.partnerships"
      subtitleKey="aboutMenu.partnershipsDesc"
      sectionName="About JIBB"
    />
  );
}
