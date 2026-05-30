import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="resourcesMenu.newsletter"
      subtitleKey="resourcesMenu.newsletterDesc"
      sectionName="Bilateral Resources"
    />
  );
}
