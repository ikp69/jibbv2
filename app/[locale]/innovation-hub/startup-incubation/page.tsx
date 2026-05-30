import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function StartupIncubationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="hubMenu.incubation"
      subtitleKey="hubMenu.incubationDesc"
      sectionName="Innovation Hub"
    />
  );
}
