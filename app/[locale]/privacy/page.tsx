import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="footer.privacy"
      subtitleKey="footer.privacy"
      sectionName="Legal Portal"
    />
  );
}
