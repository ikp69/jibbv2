import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function InnovationConsultingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="servicesMenu.consulting"
      subtitleKey="servicesMenu.consultingDesc"
      sectionName="JIBB Services"
    />
  );
}
