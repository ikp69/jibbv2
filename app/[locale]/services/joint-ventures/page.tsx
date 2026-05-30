import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function JointVenturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="servicesMenu.jointVentures"
      subtitleKey="servicesMenu.jointVenturesDesc"
      sectionName="JIBB Services"
    />
  );
}
