import { setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ComingSoonPage
      titleKey="resourcesMenu.blog"
      subtitleKey="resourcesMenu.blogDesc"
      sectionName="Bilateral Resources"
    />
  );
}
