import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function LeadershipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="aboutMenu.leadership"
      subtitleKey="aboutMenu.leadershipDesc"
      sectionName="About JIBB"
      colorTheme="indigo"
      relatedLinks={[
        { label: "Our Core Team", href: "/about" },
        { label: "Bilateral Partners", href: "/about/global-partnerships" },
        { label: "Bilateral Membership", href: "/membership" }
      ]}
    />
  );
}
