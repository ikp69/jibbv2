import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/PageHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Link } from "@/src/i18n/navigation";
import { TableOfContents } from "@/components/ui/TableOfContents";
import {
  FileText,
  Users,
  ShieldAlert,
  Scale,
  Globe,
  Mail,
  RefreshCw,
  Ban,
  Handshake,
  BadgeCheck,
  CreditCard,
  Gavel,
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
      ? "利用規約 | 日印ビジネス機構"
      : "Terms of Service — Japan India Business Bureau";
  const description =
    locale === "ja"
      ? "JIBBのウェブサイトおよびサービスをご利用いただく前に、本利用規約をお読みください。"
      : "Please read JIBB's Terms of Service before using our website or services. These terms govern your relationship with the Japan India Business Bureau.";

  return {
    title,
    description,
    keywords: [
      "terms of service",
      "service terms",
      "legal terms",
      "user agreement",
      "terms and conditions",
      "service agreement",
      "website terms",
      "membership terms",
      "legal agreement",
      "JIBB terms",
      "利用規約",
      "サービス利用条件",
      "会員規約",
      "法的条件",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/${locale}/terms`,
      siteName: "JIBB — Japan India Business Bureau",
      locale: locale === "en" ? "en_US" : "ja_JP",
      alternateLocale: locale === "en" ? "ja_JP" : "en_US",
      images: [
        {
          url: `${baseUrl}/images/og/terms-og.jpg`,
          width: 1200,
          height: 630,
          alt: "JIBB Terms of Service",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/og/terms-og.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/terms`,
      languages: {
        en: `${baseUrl}/en/terms`,
        ja: `${baseUrl}/ja/terms`,
      },
    },
  };
}

const sections = [
  {
    id: "acceptance",
    icon: BadgeCheck,
    iconColor: "text-jibb-indigo",
    iconBg: "bg-jibb-indigo/5",
    title: "Acceptance of Terms",
    content: [
      {
        subtitle: "Agreement to Terms",
        body: "By accessing or using the JIBB website (npo-jibb.org), registering for membership, attending our events, or engaging with any of our services, you confirm that you have read, understood, and agree to be bound by these Terms of Service, along with our Privacy Policy. If you do not agree, please discontinue use of our services immediately.",
      },
      {
        subtitle: "Eligibility",
        body: "Our services are intended for business professionals, companies, governmental bodies, and institutions engaged in or seeking to engage in cross-border activities between Japan and India. By using our services, you represent that you are at least 18 years of age and have the legal authority to enter into binding agreements.",
      },
      {
        subtitle: "Modifications",
        body: "JIBB reserves the right to update or modify these Terms at any time. We will post the revised version on this page with an updated date. For material changes, registered members will be notified by email. Continued use of our services after any such modification constitutes your acceptance of the revised Terms.",
      },
    ],
  },
  {
    id: "services",
    icon: Handshake,
    iconColor: "text-jibb-orange",
    iconBg: "bg-jibb-orange/5",
    title: "Our Services",
    content: [
      {
        subtitle: "Service Description",
        body: "JIBB (Japan India Business Bureau) is a non-profit bilateral organisation that facilitates cross-border business partnerships, market entry support, investment facilitation, innovation collaboration, event programming, and knowledge sharing between Japan and India. Our services are provided through our website, member portal, events, and direct advisory engagements.",
      },
      {
        subtitle: "Service Availability",
        body: "While we strive to maintain consistent service availability, JIBB does not guarantee uninterrupted access to our website or digital services. We may temporarily suspend access for maintenance, updates, or due to circumstances beyond our reasonable control, including force majeure events.",
      },
      {
        subtitle: "No Guaranteed Outcomes",
        body: "JIBB provides facilitation, introductions, and advisory services in good faith. However, we do not guarantee specific business outcomes, deal closures, investment returns, or partnership results. Success depends on many factors beyond our control, including the parties involved and prevailing market conditions.",
      },
      {
        subtitle: "Third-Party Services",
        body: "Our services may integrate with or link to third-party platforms, tools, and websites. JIBB is not responsible for the content, accuracy, or practices of third-party services, and your use of such services is governed by their respective terms and policies.",
      },
    ],
  },
  {
    id: "membership",
    icon: Users,
    iconColor: "text-jibb-sakura",
    iconBg: "bg-jibb-sakura/5",
    title: "Membership & Accounts",
    content: [
      {
        subtitle: "Account Registration",
        body: "To access certain services, you may need to register for a JIBB account or membership. You agree to provide accurate, current, and complete information during registration, and to update it as necessary. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
      },
      {
        subtitle: "Membership Categories",
        body: "JIBB offers various membership tiers (Corporate, Associate, Government/Institutional) with different benefits and obligations. Details of each tier, including any applicable fees, are set out in our Membership Programme documentation, which forms part of these Terms by reference.",
      },
      {
        subtitle: "Member Conduct",
        body: "Members agree to engage with other members, JIBB staff, and event participants in a professional, respectful manner consistent with the spirit of bilateral cooperation. Any conduct that is discriminatory, fraudulent, defamatory, or harmful to JIBB's reputation or other members may result in immediate suspension or termination of membership.",
      },
      {
        subtitle: "Account Termination",
        body: "You may cancel your membership at any time by contacting us. JIBB reserves the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or cause harm to other members or the organisation, with or without prior notice depending on the severity of the violation.",
      },
    ],
  },
  {
    id: "payments",
    icon: CreditCard,
    iconColor: "text-jibb-indigo",
    iconBg: "bg-jibb-indigo/5",
    title: "Fees & Payments",
    content: [
      {
        subtitle: "Membership Fees",
        body: "Certain JIBB membership tiers and premium services are subject to fees as outlined in the applicable programme documentation. All fees are stated in the currency specified at the time of transaction and are exclusive of applicable taxes (including GST in India and consumption tax in Japan), which are the responsibility of the payer.",
      },
      {
        subtitle: "Payment Terms",
        body: "Fees are due in advance for the relevant membership period. JIBB reserves the right to modify membership fees with reasonable notice. Continued use of fee-based services after a price change constitutes acceptance of the new fee structure.",
      },
      {
        subtitle: "Refund Policy",
        body: "Membership fees are generally non-refundable once the membership period has commenced, except where required by applicable consumer protection law. For event registrations, refund eligibility and timelines are specified in the individual event terms communicated at registration.",
      },
    ],
  },
  {
    id: "intellectual-property",
    icon: FileText,
    iconColor: "text-jibb-orange",
    iconBg: "bg-jibb-orange/5",
    title: "Intellectual Property",
    content: [
      {
        subtitle: "JIBB Content",
        body: "All content published on the JIBB website — including text, graphics, logos, reports, event materials, and software — is the property of the Japan India Business Bureau or its content licensors and is protected by applicable intellectual property laws in Japan, India, and internationally. You may not reproduce, distribute, or create derivative works from our content without express written permission.",
      },
      {
        subtitle: "Limited Licence to Users",
        body: "We grant you a limited, non-exclusive, non-transferable licence to access and use our website and services for your personal or internal business purposes. This licence does not permit commercial exploitation, scraping, or systematic downloading of our content.",
      },
      {
        subtitle: "Your Content",
        body: "When you submit content to JIBB (such as company profiles, event descriptions, or articles for our resources section), you grant JIBB a non-exclusive, royalty-free, worldwide licence to use, publish, and display that content in connection with our services. You represent that you own or have the necessary rights to grant this licence.",
      },
      {
        subtitle: "Trademark Notice",
        body: "\"JIBB\", \"Japan India Business Bureau\", and associated logos and marks are trademarks of the Japan India Business Bureau. Unauthorised use of our trademarks is strictly prohibited.",
      },
    ],
  },
  {
    id: "prohibited-conduct",
    icon: Ban,
    iconColor: "text-jibb-sakura",
    iconBg: "bg-jibb-sakura/5",
    title: "Prohibited Conduct",
    content: [
      {
        subtitle: "Prohibited Uses",
        body: "You agree not to use our services to: (a) engage in any unlawful activity or violation of applicable regulations in Japan or India; (b) transmit spam, malware, or harmful code; (c) impersonate any person or entity; (d) collect data about other users without their consent; (e) interfere with the security or integrity of our systems; (f) use our platform for activities unrelated to Japan-India business collaboration; or (g) engage in any conduct that could damage JIBB's reputation or relationships with members and partners.",
      },
      {
        subtitle: "Anti-Corruption Compliance",
        body: "All users and members of JIBB must comply with applicable anti-bribery and anti-corruption laws, including Japan's Unfair Competition Prevention Act and India's Prevention of Corruption Act. JIBB takes a zero-tolerance approach to corruption and will cooperate fully with any lawful investigation.",
      },
    ],
  },
  {
    id: "liability",
    icon: ShieldAlert,
    iconColor: "text-jibb-indigo",
    iconBg: "bg-jibb-indigo/5",
    title: "Limitation of Liability",
    content: [
      {
        subtitle: "Disclaimer of Warranties",
        body: "JIBB's website and services are provided on an \"as is\" and \"as available\" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that our services will be error-free, uninterrupted, or free from harmful components.",
      },
      {
        subtitle: "Limitation of Damages",
        body: "To the maximum extent permitted by applicable law, JIBB and its officers, directors, employees, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or any business outcomes facilitated through our platform — even if we have been advised of the possibility of such damages.",
      },
      {
        subtitle: "Cap on Liability",
        body: "In no event shall JIBB's total liability to you for all claims arising from or related to these Terms or our services exceed the total amount of membership fees, if any, paid by you to JIBB in the twelve (12) months preceding the claim.",
      },
    ],
  },
  {
    id: "governing-law",
    icon: Gavel,
    iconColor: "text-jibb-orange",
    iconBg: "bg-jibb-orange/5",
    title: "Governing Law & Disputes",
    content: [
      {
        subtitle: "Governing Law",
        body: "These Terms shall be governed by and construed in accordance with the laws of Japan, without regard to conflict of law principles, given JIBB's primary headquarters in Tokyo. For matters specifically arising from operations in India, applicable Indian law shall apply to the extent required by Indian statutory requirements.",
      },
      {
        subtitle: "Dispute Resolution",
        body: "In the event of a dispute arising from or relating to these Terms or our services, the parties agree to first attempt resolution through good-faith negotiation. If unresolved within 30 days, disputes may be referred to mediation before pursuing formal legal proceedings.",
      },
      {
        subtitle: "Jurisdiction",
        body: "Subject to the dispute resolution process above, both parties submit to the exclusive jurisdiction of the courts located in Tokyo, Japan for matters governed by Japanese law, or the appropriate courts in Noida/Delhi NCR, India, for matters specifically arising under Indian law.",
      },
    ],
  },
  {
    id: "international",
    icon: Globe,
    iconColor: "text-jibb-sakura",
    iconBg: "bg-jibb-sakura/5",
    title: "International Use",
    content: [
      {
        subtitle: "Cross-Border Compliance",
        body: "Our services are operated from Japan and India and are intended for users in both countries and internationally. By using our services, you agree to comply with all applicable local laws in your jurisdiction. You are responsible for determining whether your use of our services is legal in your country of residence.",
      },
      {
        subtitle: "Export Controls",
        body: "You agree not to use our services in violation of applicable export control laws and regulations, including those administered by Japan's Ministry of Economy, Trade and Industry (METI) and India's Directorate General of Foreign Trade (DGFT).",
      },
    ],
  },
];

export default async function TermsPage({
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
      <PageHero className="py-24 lg:py-32" bgText="TERMS">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Scale className="size-3.5 text-jibb-orange" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              Legal &amp; Compliance
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Terms of Service
          </h1>

          <p className="text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
            These terms govern your access to and use of JIBB's website, membership, and services. 
            Please read them carefully before engaging with us.
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
          TERMS CONTENT & SIDEBAR
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
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-jibb-indigo shrink-0" />
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

              {/* Severability & Entire Agreement */}
              <ScrollReveal>
                <div className="rounded-2xl p-6 md:p-8 bg-card border border-border/50 shadow-jibb space-y-4">
                  <h2 className="text-lg font-bold text-foreground tracking-tight">General Provisions</h2>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="space-y-1.5">
                      <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Severability</p>
                      <p className="leading-relaxed">If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Entire Agreement</p>
                      <p className="leading-relaxed">These Terms, together with our Privacy Policy and any applicable membership documentation, constitute the entire agreement between you and JIBB.</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Waiver</p>
                      <p className="leading-relaxed">Failure by JIBB to enforce any right or provision under these Terms shall not be deemed a waiver of that right or provision in the future.</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Assignment</p>
                      <p className="leading-relaxed">You may not assign your rights or obligations under these Terms without JIBB's prior written consent. JIBB may assign its rights freely in connection with a reorganisation or business transfer.</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTACT / LEGAL QUERIES
          ============================================================ */}
      <section className="py-16 md:py-20 bg-jibb-gradient-subtle border-t border-border/20">
        <div className="section-container max-w-4xl">
          <ScrollReveal>
            <div className="relative rounded-3xl p-8 md:p-12 bg-jibb-gradient text-white overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-jibb-orange/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-5">
                <div className="p-3 rounded-2xl bg-white/10 inline-flex">
                  <Gavel className="size-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Legal Queries & Concerns
                </h2>
                <p className="text-sm md:text-base text-white/75 max-w-xl mx-auto leading-relaxed">
                  If you have any questions about these Terms, wish to report a violation, or need to contact our legal team regarding a specific matter, please reach out directly.
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
                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <Link href="/privacy" className="text-xs text-white/50 hover:text-white/80 transition-colors underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  <span className="text-white/20">·</span>
                  <span className="text-xs text-white/50">
                    Tokyo: Tameike Suzuki Building 3F, 1-2-13 Akasaka, Minato-ku, Tokyo · Noida: 6th Floor, 162, Sector 136, Arihant Business Centre, Noida, Uttar Pradesh
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
