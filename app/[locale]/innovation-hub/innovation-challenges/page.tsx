import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function InnovationChallengesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="hubMenu.challenges"
      subtitleKey="hubMenu.challengesDesc"
      sectionName="Innovation Hub"
    />
  );
}
