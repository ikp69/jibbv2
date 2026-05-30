import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function PartnerInstitutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="hubMenu.partners"
      subtitleKey="hubMenu.partnersDesc"
      sectionName="Innovation Hub"
    />
  );
}
