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
      colorTheme="orange"
      relatedLinks={[
        { label: "Our Core Services", href: "/services" },
        { label: "Co-Innovation Sandbox", href: "/services/innovation-consulting" },
        { label: "Market Entry Advisory", href: "/services/market-entry" }
      ]}
    />
  );
}
