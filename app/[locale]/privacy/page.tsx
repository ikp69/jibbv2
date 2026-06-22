import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/PageHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Link } from "@/src/i18n/navigation";
import { TableOfContents } from "@/components/ui/TableOfContents";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Share2,
  UserCheck,
  Globe,
  Mail,
  AlertCircle,
  RefreshCw,
  Cookie,
  FileText,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://npo-jibb.org";
  const title =
    locale === "ja"
      ? "プライバシーポリシー | 日印ビジネス機構"
      : "Privacy Policy - Japan India Business Bureau";
  const description =
    locale === "ja"
      ? "JIBBはお客様の個人情報を責任を持って取り扱います。本プライバシーポリシーでは、データの収集・利用・保護方針をご説明します。"
      : "Learn how JIBB collects, uses, and safeguards your personal data. Your privacy is our priority — read our full policy here.";

  return {
    title,
    description,
    keywords: [
      "privacy policy",
      "data protection",
      "personal data",
      "GDPR compliance",
      "data privacy",
      "information security",
      "cookie policy",
      "user privacy",
      "data collection",
      "privacy JIBB",
      "プライバシー",
      "データ保護",
      "個人情報",
      "セキュリティ",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/${locale}/privacy`,
      siteName: "JIBB - Japan India Business Bureau",
      locale: locale === "en" ? "en_US" : "ja_JP",
      alternateLocale: locale === "en" ? "ja_JP" : "en_US",
      images: [
        {
          url: `${baseUrl}/images/og/privacy-og.jpg`,
          width: 1200,
          height: 630,
          alt: "JIBB Privacy Policy — Data Protection & Security",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/og/privacy-og.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/privacy`,
      languages: {
        en: `${baseUrl}/en/privacy`,
        ja: `${baseUrl}/ja/privacy`,
      },
    },
  };
}

const sections = [
  {
    id: "information-we-collect",
    icon: Database,
    iconColor: "text-jibb-indigo",
    iconBg: "bg-jibb-indigo/5",
    title: "Information We Collect",
    content: [
      {
        subtitle: "Information You Provide Directly",
        body: "When you register for membership, attend our events, submit an inquiry through our contact form, or subscribe to our newsletter, we collect personal information such as your full name, email address, phone number, company name, job title, and any messages or documents you share with us.",
      },
      {
        subtitle: "Information Collected Automatically",
        body: "When you visit our website, we automatically collect certain technical data including your IP address, browser type and version, operating system, referring URLs, pages visited, time spent on pages, and device identifiers. This is collected via cookies and similar tracking technologies to help us improve your experience.",
      },
      {
        subtitle: "Information from Third Parties",
        body: "We may receive information about you from business partners, social media platforms (if you interact with our profiles), and public databases to supplement the information you provide and help us better serve your professional needs.",
      },
    ],
  },
  {
    id: "how-we-use",
    icon: Eye,
    iconColor: "text-jibb-orange",
    iconBg: "bg-jibb-orange/5",
    title: "How We Use Your Information",
    content: [
      {
        subtitle: "Service Delivery & Member Support",
        body: "We use your information to process membership applications, facilitate introductions between Japanese and Indian businesses, respond to your inquiries, and provide you with the event registrations, matchmaking services, and resources you request.",
      },
      {
        subtitle: "Communications & Updates",
        body: "With your consent, we send newsletters, industry reports, event invitations, and updates about Japan-India business opportunities relevant to your sectors of interest. You may unsubscribe at any time via the link in any email.",
      },
      {
        subtitle: "Platform Improvement & Analytics",
        body: "We use aggregated, anonymised data to analyse usage patterns, improve our website experience, optimise content relevance, and develop new services that better connect our bilateral member community.",
      },
      {
        subtitle: "Legal & Compliance Obligations",
        body: "We may process your data to comply with applicable laws in Japan and India, respond to lawful requests from authorities, enforce our terms of service, and protect the rights and safety of JIBB, its members, and the public.",
      },
    ],
  },
  {
    id: "data-sharing",
    icon: Share2,
    iconColor: "text-jibb-sakura",
    iconBg: "bg-jibb-sakura/5",
    title: "Data Sharing & Disclosure",
    content: [
      {
        subtitle: "Facilitated Business Introductions",
        body: "As a bilateral business bureau, our core service involves connecting members across borders. With your explicit consent, we may share relevant professional information (name, company, role, business interests) with potential Japanese or Indian business partners as part of our matchmaking and introduction services.",
      },
      {
        subtitle: "Trusted Service Providers",
        body: "We work with carefully selected third-party providers for services such as email delivery, event management platforms, website hosting, and CRM tools. These providers are contractually obligated to handle your data securely and only for the purposes we specify.",
      },
      {
        subtitle: "We Never Sell Your Data",
        body: "JIBB does not sell, rent, or trade your personal information to any third party for their own marketing or commercial purposes. Your data is used exclusively to serve you and our bilateral mission.",
      },
      {
        subtitle: "Legal Disclosures",
        body: "We may disclose your information if required by law, court order, or governmental authority in Japan or India, or when we believe disclosure is necessary to protect our legal rights or prevent fraud.",
      },
    ],
  },
  {
    id: "data-security",
    icon: Lock,
    iconColor: "text-jibb-indigo",
    iconBg: "bg-jibb-indigo/5",
    title: "Data Security",
    content: [
      {
        subtitle: "Technical Safeguards",
        body: "We implement industry-standard security measures including TLS/SSL encryption for all data in transit, encrypted storage for sensitive records, access controls, and regular security audits. Our infrastructure is hosted on secure, enterprise-grade cloud platforms.",
      },
      {
        subtitle: "Organisational Measures",
        body: "Access to personal data within JIBB is restricted to staff who need it to perform their roles. All team members are trained on data protection best practices, and we maintain internal policies governing the handling, storage, and disposal of personal information.",
      },
      {
        subtitle: "Data Breach Response",
        body: "In the unlikely event of a data breach that poses risk to your rights, we will notify affected individuals and relevant authorities within the timeframes required by applicable law, and take immediate steps to contain and remediate the incident.",
      },
    ],
  },
  {
    id: "your-rights",
    icon: UserCheck,
    iconColor: "text-jibb-orange",
    iconBg: "bg-jibb-orange/5",
    title: "Your Rights",
    content: [
      {
        subtitle: "Access & Portability",
        body: "You have the right to request a copy of the personal information we hold about you and to receive it in a structured, commonly used format. Simply contact us at vc@npo-jibb.org and we will respond within 30 days.",
      },
      {
        subtitle: "Correction & Deletion",
        body: "You may request the correction of inaccurate data or, where there is no legitimate reason for us to retain it, the deletion of your personal information. Note that certain data may be required for legal or contractual purposes.",
      },
      {
        subtitle: "Withdrawal of Consent",
        body: "Where our processing relies on your consent, you may withdraw it at any time. This will not affect the lawfulness of processing before withdrawal. You can unsubscribe from marketing communications at any time.",
      },
      {
        subtitle: "Objection & Restriction",
        body: "You have the right to object to certain types of processing or to request that we restrict how we use your data while a request is being assessed. We will honour all valid requests in line with applicable data protection law.",
      },
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    iconColor: "text-jibb-sakura",
    iconBg: "bg-jibb-sakura/5",
    title: "Cookies & Tracking",
    content: [
      {
        subtitle: "Essential Cookies",
        body: "These cookies are necessary for the website to function correctly — they enable secure login, session management, and language preferences. They cannot be disabled as they are required for basic site functionality.",
      },
      {
        subtitle: "Analytics Cookies",
        body: "We use analytics tools (such as Google Analytics in anonymised mode) to understand how visitors interact with our website. This helps us improve content and navigation. You can opt out via our cookie banner or your browser settings.",
      },
      {
        subtitle: "Managing Your Cookie Preferences",
        body: "You can manage or disable cookies through your browser settings at any time. Please note that disabling certain cookies may affect the functionality of some parts of our website.",
      },
    ],
  },
  {
    id: "international-transfers",
    icon: Globe,
    iconColor: "text-jibb-indigo",
    iconBg: "bg-jibb-indigo/5",
    title: "International Data Transfers",
    content: [
      {
        subtitle: "Cross-Border Operations",
        body: "As a Japan-India bilateral organisation headquartered in both Tokyo and Noida, your data may be transferred to and processed in Japan, India, and other countries where our service providers operate. These countries may have different data protection laws than your country of residence.",
      },
      {
        subtitle: "Transfer Safeguards",
        body: "We ensure appropriate safeguards are in place for all international transfers, including contractual clauses, data processing agreements, and compliance with applicable cross-border data transfer regulations in both Japan (Act on Protection of Personal Information — APPI) and India (Digital Personal Data Protection Act — DPDPA).",
      },
    ],
  },
  {
    id: "updates",
    icon: RefreshCw,
    iconColor: "text-jibb-orange",
    iconBg: "bg-jibb-orange/5",
    title: "Policy Updates",
    content: [
      {
        subtitle: "Changes to This Policy",
        body: "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. The date of the most recent revision appears at the top of this page. For material changes, we will notify registered members by email.",
      },
      {
        subtitle: "Continued Use",
        body: "Your continued use of our website or services after any update constitutes your acceptance of the revised policy. We encourage you to review this page periodically to stay informed about how we protect your data.",
      },
    ],
  },
];

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const effectiveDate = "June 19, 2025";
  const lastUpdated = "June 19, 2026";

  return (
    <main className="flex-1 bg-background text-foreground">
      {/* ============================================================
          HERO
          ============================================================ */}
      <PageHero className="py-24 lg:py-32" bgText="PRIVACY">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Shield className="size-3.5 text-jibb-orange" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              Legal &amp; Compliance
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Privacy Policy
          </h1>

          <p className="text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
            At JIBB, your privacy is not an afterthought — it is a commitment.
            This policy explains what data we collect, why we collect it, and how we protect it.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <FileText className="size-3.5 text-white/60" />
              <span className="text-xs text-white/70">Effective: {effectiveDate}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <RefreshCw className="size-3.5 text-white/60" />
              <span className="text-xs text-white/70">Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </PageHero>

      {/* ============================================================
          POLICY CONTENT & SIDEBAR
          ============================================================ */}
      <section className="py-16 md:py-24 bg-background">
        <div className="section-container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar Table of Contents */}
            <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24 self-start">
              <TableOfContents />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 jibb-prose space-y-16">
              {sections.map((section, sectionIndex) => {
                const Icon = section.icon;
                return (
                  <div key={section.id} id={section.id} className="scroll-mt-24">
                    <ScrollReveal>
                      <div className="space-y-6">
                        {/* Section Header */}
                        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                          <div className={`p-2.5 rounded-xl ${section.iconBg} shrink-0 flex items-center justify-center`}>
                            <Icon className={`size-5 ${section.iconColor}`} />
                          </div>
                          <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight m-0 leading-none">
                            {section.title}
                          </h2>
                        </div>

                        {/* Subsections */}
                        <div className="space-y-6 pl-0 md:pl-2">
                          {section.content.map((item, i) => (
                            <div key={i} className="space-y-2">
                              <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-jibb-orange shrink-0" />
                                {item.subtitle}
                              </h3>
                              <p className="text-sm md:text-base text-muted-foreground leading-relaxed pl-3.5">
                                {item.body}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTACT / QUESTIONS
          ============================================================ */}
      <section className="py-16 md:py-20 bg-jibb-gradient-subtle border-t border-border/20">
        <div className="section-container max-w-4xl">
          <ScrollReveal>
            <div className="relative rounded-3xl p-8 md:p-12 bg-jibb-gradient text-white overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-jibb-orange/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-5">
                <div className="p-3 rounded-2xl bg-white/10 inline-flex">
                  <Mail className="size-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Questions About Your Privacy?
                </h2>
                <p className="text-sm md:text-base text-white/75 max-w-xl mx-auto leading-relaxed">
                  If you have any questions, concerns, or requests related to this Privacy Policy or how we handle your personal data, our Data Protection point of contact is available to assist you.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                  <a
                    href="mailto:vc@npo-jibb.org"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-jibb-indigo font-bold text-sm hover:bg-white/90 transition-colors shadow-lg"
                  >
                    <Mail className="size-4" />
                    vc@npo-jibb.org
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    Contact Form
                  </Link>
                </div>
                <p className="text-xs text-white/50 mt-4">
                  Tokyo: Tameike Suzuki Building 3F, 1-2-13 Akasaka, Minato-ku, Tokyo, Japan<br />
                  Noida: 6th Floor, 162, Sector 136, Arihant Business Centre, Noida, Uttar Pradesh, India
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
