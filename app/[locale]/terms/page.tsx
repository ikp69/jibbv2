import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="footer.terms"
      subtitleKey="footer.terms"
      sectionName="Legal Portal"
    />
  );
}
