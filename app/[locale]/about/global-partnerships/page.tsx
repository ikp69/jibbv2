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
      colorTheme="indigo"
      relatedLinks={[
        { label: "Our Core Team", href: "/about" },
        { label: "Bilateral Partners List", href: "/about/global-partnerships" },
        { label: "Startup Labs", href: "/innovation-hub" }
      ]}
    />
  );
}
