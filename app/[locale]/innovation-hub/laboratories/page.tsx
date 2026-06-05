import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function LaboratoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="hubMenu.labs"
      subtitleKey="hubMenu.labsDesc"
      sectionName="Innovation Hub"
      colorTheme="sakura"
      relatedLinks={[
        { label: "Innovation Hub Overview", href: "/innovation-hub" },
        { label: "Co-Innovation Timeline", href: "/about" },
        { label: "Startup Incubation", href: "/innovation-hub/startup-incubation" }
      ]}
    />
  );
}
