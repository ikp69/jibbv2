import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function CenterOfExcellencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="hubMenu.coe"
      subtitleKey="hubMenu.coeDesc"
      sectionName="Innovation Hub"
    />
  );
}
