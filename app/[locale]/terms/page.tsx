import { setRequestLocale, getTranslations } from "next-intl/server";
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
      : "Terms of Service - Japan India Business Bureau";
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
      siteName: "JIBB - Japan India Business Bureau",
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

const sectionsEn = [
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

const sectionsJa = [
  {
    id: "acceptance",
    icon: BadgeCheck,
    iconColor: "text-jibb-indigo",
    iconBg: "bg-jibb-indigo/5",
    title: "規約の同意",
    content: [
      {
        subtitle: "本規約への同意",
        body: "JIBBのウェブサイト（npo-jibb.org）へのアクセス、会員登録、イベント参加、またはサービスの利用を行うことにより、お客様は本利用規約およびプライバシーポリシーを読み、理解し、これらに拘束されることに同意したものとみなされます。同意いただけない場合は、直ちにサービスの利用を中止してください。",
      },
      {
        subtitle: "利用資格",
        body: "当団体のサービスは、日本とインドのクロスボーダー事業に従事している、または関心を持つビジネス専門家、企業、政府機関、研究機関を対象としています。サービスを利用することにより、お客様は18歳以上であり、法的な契約を結ぶ権限を有していることを表明するものとします。",
      },
      {
        subtitle: "規約の変更",
        body: "JIBBは、理由の如何を問わず本規約を随時変更する権利を有します。変更後の規約は更新日とともに本ページに掲載されます。重要な変更がある場合は、登録会員へメールで通知いたします。変更後も継続してサービスを利用された場合、改定後の規約に同意したものとみなされます。",
      },
    ],
  },
  {
    id: "services",
    icon: Handshake,
    iconColor: "text-jibb-orange",
    iconBg: "bg-jibb-orange/5",
    title: "提供サービス",
    content: [
      {
        subtitle: "サービス概要",
        body: "日印ビジネスビューロー（JIBB）は、日本とインド間の国境を越えたビジネスパートナーシップ、市場参入支援、投資促進、イノベーション協働、各種イベント、知見共有を促進する非営利二国間機関です。サービスは、ウェブサイト、会員ポータル、イベント、直接のコンサルティングを通じて提供されます。",
      },
      {
        subtitle: "サービスの提供状況",
        body: "当団体は安定したサービス提供に努めますが、ウェブサイトやデジタルサービスの中断のないアクセスを保証するものではありません。保守点検、システム更新、または不可抗力を含む合理的な管理を超える事情により、サービスを一時的に停止する場合があります。",
      },
      {
        subtitle: "成果の非保証",
        body: "JIBBは誠意を持ってマッチング、引き合わせ、アドバイスを提供します。しかし、特定のビジネス成果、成約、投資リターン、パートナーシップ結果を保証するものではありません。成功は関与する当事者や市場状況など、当団体の管理外の多様な要因に依存します。",
      },
      {
        subtitle: "第三者サービス",
        body: "当団体のサービスは、第三者のプラットフォーム、ツール、ウェブサイトと連携またはリンクしている場合があります。JIBBは第三者サービスのコンテンツ、正確性、運用について責任を負わず、それらの利用は当該第三者の利用規約およびポリシーに従います。",
      },
    ],
  },
  {
    id: "membership",
    icon: Users,
    iconColor: "text-jibb-sakura",
    iconBg: "bg-jibb-sakura/5",
    title: "会員制度・アカウント",
    content: [
      {
        subtitle: "アカウント登録",
        body: "一部のサービスを利用するには、JIBBアカウントまたは会員登録が必要です。登録時には正確かつ最新の情報を入力し、必要に応じて更新することに同意するものとします。アカウント情報の機密保持およびアカウント下で行われるすべての活動については、お客様自身が責任を負います。",
      },
      {
        subtitle: "会員区分",
        body: "JIBBは、異なる特典と義務を持つ複数の会員ランク（法人、アソシエイト、政府・機関）を提供しています。各プランの詳細および費用は、本規約の一部を構成する会員プログラムドキュメントに定められています。",
      },
      {
        subtitle: "会員の行動規範",
        body: "会員は、二国間協力の精神に基づき、他の会員、JIBBスタッフ、イベント参加者とプロフェッショナルかつ敬意を持った態度で対話することに同意するものとします。差別的、詐欺的、中傷的、またはJIBBの信用・他会員に悪影響を与える行為を行った場合、即座に会員資格が停止または取消されることがあります。",
      },
      {
        subtitle: "解約・アカウント終了",
        body: "お客様は当団体にお問い合わせいただくことで、いつでも会員資格を解約できます。JIBBは、本規約に違反した場合、詐欺的行為を行った場合、または組織や他会員に害を及ぼした場合、事前通知の有無を問わずアカウントを停止または終了する権利を留保します。",
      },
    ],
  },
  {
    id: "payments",
    icon: CreditCard,
    iconColor: "text-jibb-indigo",
    iconBg: "bg-jibb-indigo/5",
    title: "料金および支払い",
    content: [
      {
        subtitle: "会費・サービス料金",
        body: "特定プランの会費および有料サービスには、該当ドキュメントに記載された料金が適用されます。表示価格には該当する税金（インドのGST、日本の消費税等）は含まれておらず、支払者の負担となります。",
      },
      {
        subtitle: "支払い条件",
        body: "会費は該当する会員期間の前に前払いするものとします。JIBBは事前通知をもって会費を変更する権利を有します。価格変更後も継続して有料サービスを利用した場合、新料金体系に同意したものとみなされます。",
      },
      {
        subtitle: "返金方針",
        body: "消費者保護法で要求される場合を除き、一度開始された会員期間の会費は原則として返金いたしかねます。イベント参加費の返金規定および期限については、各イベント申込時の利用規約に準拠します。",
      },
    ],
  },
  {
    id: "intellectual-property",
    icon: FileText,
    iconColor: "text-jibb-orange",
    iconBg: "bg-jibb-orange/5",
    title: "知的財産権",
    content: [
      {
        subtitle: "JIBBコンテンツの権利",
        body: "JIBBウェブサイトに掲載されているすべてのコンテンツ（文章、画像、ロゴ、調査レポート、イベント資料、ソフトウェア等）は、日印ビジネスビューローまたは権利者に帰属し、日本、インド、および国際的な知的財産権法によって保護されています。書面による事前の許諾なしに、複製、頒布、二次的著作物の作成を行うことを禁止します。",
      },
      {
        subtitle: "ユーザーへの限定的ライセンス",
        body: "当団体は、お客様の個人利用または社内業務利用の目的に限り、ウェブサイトおよびサービスにアクセスし利用するための非独占的かつ譲渡不能な限定ライセンスを付与します。商用目的での不正利用、データスクレイピング、大量ダウンロードは禁止されています。",
      },
      {
        subtitle: "投稿コンテンツ",
        body: "お客様がJIBBにコンテンツ（会社概要、イベント説明、記事等）を提出・投稿した場合、当団体に対してサービスに関連して当該コンテンツを使用・出版・表示するための全世界的かつロイヤリティフリーの非独占的ライセンスを付与したものとみなします。",
      },
      {
        subtitle: "商標について",
        body: "「JIBB」、「Japan India Business Bureau」、および関連するロゴやマークは日印ビジネスビューローの商標です。事前の書面による許可なくこれらを使用することは厳重に禁止されています。",
      },
    ],
  },
  {
    id: "prohibited-conduct",
    icon: Ban,
    iconColor: "text-jibb-sakura",
    iconBg: "bg-jibb-sakura/5",
    title: "禁止事項",
    content: [
      {
        subtitle: "禁止行為",
        body: "以下の行為を禁止します：(a) 日本またはインドの適用法令に違反する行為、(b) スパムや悪意のあるコードの送信、(c) 第三者へのなりすまし、(d) 承諾なしの他ユーザーデータの収集、(e) システムのセキュリティや完全性への妨害、(f) 日印ビジネス協力と無関係な目的でのプラットフォーム利用、(g) JIBBの信用やパートナー関係を著しく損なう行為。",
      },
      {
        subtitle: "反汚職コンプライアンス",
        body: "すべてのユーザーおよび会員は、日本の不正競争防止法やインドの汚職防止法を含む、該当する贈収賄・防腐法を遵守しなければなりません。JIBBは汚職行為に対してゼロ・トレランス（毅然とした態度）で臨み、法的な捜査に全面的に協力します。",
      },
    ],
  },
  {
    id: "liability",
    icon: ShieldAlert,
    iconColor: "text-jibb-indigo",
    iconBg: "bg-jibb-indigo/5",
    title: "免責事項・責任制限",
    content: [
      {
        subtitle: "保証の否認",
        body: "JIBBのウェブサイトおよびサービスは「現状有姿」かつ「提供可能な限度」で提供され、商品性、特定目的への適合性、権利侵害の不在を含め、明示または黙示を問わずいかなる保証も行いません。エラーや中断のない完全な動作品質を保証するものではありません。",
      },
      {
        subtitle: "損害賠償の制限",
        body: "適用法令が許容する最大限において、JIBBおよびその役員、理事、従業員、パートナーは、サービスの利用やビジネス結果から生じた間接的、偶発的、特別、結果的、または懲罰的損害について、事前予見の有無を問わず一切の責任を負いません。",
      },
      {
        subtitle: "責任の限度額",
        body: "本規約またはサービスに関連してお客様が破る損害賠償請求において、JIBBが負う損害賠償責任の総額は、請求発生前12ヶ月間にお客様がJIBBに支払った会費等の総額を上限とします。",
      },
    ],
  },
  {
    id: "governing-law",
    icon: Gavel,
    iconColor: "text-jibb-orange",
    iconBg: "bg-jibb-orange/5",
    title: "準拠法および紛争解決",
    content: [
      {
        subtitle: "準拠法",
        body: "本規約は、JIBBの主たる本部が東京に所在することから、法抵触の原則に関わらず日本法に準拠し、同法に従って解釈されます。ただし、インド国内での事業運営に起因する特定事項については、インドの法定要件に基づき該当するインド法が適用されます。",
      },
      {
        subtitle: "紛争解決",
        body: "本規約またはサービスに関して紛争が生じた場合、当事者はまず誠実な協議による解決を図るものとします。30日以内に解決しない場合、法的措置に移行する前に調停手続に付すことができます。",
      },
      {
        subtitle: "管轄裁判所",
        body: "上記の紛争解決手続きに従い、日本法が適用される事項については東京地方裁判所を、インド法が適用される事項についてはインド・ノイダ/デリー首都圏の管轄裁判所を第一審の専属的合意管轄裁判所とします。",
      },
    ],
  },
  {
    id: "international",
    icon: Globe,
    iconColor: "text-jibb-sakura",
    iconBg: "bg-jibb-sakura/5",
    title: "国際利用について",
    content: [
      {
        subtitle: "クロスボーダー・コンプライアンス",
        body: "当団体のサービスは日本およびインドから運営されており、両国および世界各国のユーザーを対象としています。サービスを利用することにより、お客様は居住国の適用法令を遵守することに同意したものとみなされます。",
      },
      {
        subtitle: "安全保障貿易管理",
        body: "日本の経済産業省（METI）やインドの外国貿易総局（DGFT）が管轄する安全保障貿易管理・輸出管理法令に違反してサービスを利用することはできません。",
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
  const tTerms = await getTranslations("terms");

  const effectiveDate = locale === "ja" ? "2025年6月19日" : "June 19, 2025";
  const lastUpdated = locale === "ja" ? "2026年6月19日" : "June 19, 2026";
  const sections = locale === "ja" ? sectionsJa : sectionsEn;

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
              {locale === "ja" ? "法務・コンプライアンス" : "Legal & Compliance"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            {locale === "ja" ? "利用規約" : "Terms of Service"}
          </h1>

          <p className="text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
            {locale === "ja"
              ? "本規約は、JIBBのウェブサイト、会員制度、および各種サービスのご利用条件を定めるものです。ご利用前に必ずお読みください。"
              : "These terms govern your access to and use of JIBB's website, membership, and services. Please read them carefully before engaging with us."}
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <FileText className="size-3.5 text-white/60" />
              <span className="text-xs text-white/70">
                {locale === "ja" ? `施行日: ${effectiveDate}` : `Effective: ${effectiveDate}`}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <RefreshCw className="size-3.5 text-white/60" />
              <span className="text-xs text-white/70">
                {locale === "ja" ? `最終更新日: ${lastUpdated}` : `Last Updated: ${lastUpdated}`}
              </span>
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
              {sections.map((section) => {
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
                          <h2 id={section.id} className="text-xl md:text-2xl font-bold text-foreground tracking-tight m-0 leading-none">
                            {section.title}
                          </h2>
                        </div>

                        {/* Subsections */}
                        <div className="space-y-6 pl-0 md:pl-2">
                          {section.content.map((item, i) => {
                            const subId = `${section.id}-sub-${i}`;
                            return (
                              <div key={i} id={subId} className="space-y-2 scroll-mt-24">
                                <h3 id={`h3-${subId}`} className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-jibb-indigo shrink-0" />
                                  {item.subtitle}
                                </h3>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed pl-3.5">
                                  {item.body}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>
                );
              })}

              {/* Severability & Entire Agreement */}
              <ScrollReveal>
                <div className="rounded-2xl p-6 md:p-8 bg-card border border-border/50 shadow-jibb space-y-4">
                  <h2 className="text-lg font-bold text-foreground tracking-tight">
                    {tTerms("generalProvisions")}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="space-y-1.5">
                      <p className="font-semibold text-foreground text-xs uppercase tracking-wider">
                        {tTerms("severability")}
                      </p>
                      <p className="leading-relaxed">
                        {tTerms("severabilityDesc")}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-semibold text-foreground text-xs uppercase tracking-wider">
                        {tTerms("entireAgreement")}
                      </p>
                      <p className="leading-relaxed">
                        {tTerms("entireAgreementDesc")}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-semibold text-foreground text-xs uppercase tracking-wider">
                        {tTerms("waiver")}
                      </p>
                      <p className="leading-relaxed">
                        {tTerms("waiverDesc")}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-semibold text-foreground text-xs uppercase tracking-wider">
                        {tTerms("assignment")}
                      </p>
                      <p className="leading-relaxed">
                        {tTerms("assignmentDesc")}
                      </p>
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
                  {locale === "ja" ? "法務に関するご相談・お問い合わせ" : "Legal Queries & Concerns"}
                </h2>
                <p className="text-sm md:text-base text-white/75 max-w-xl mx-auto leading-relaxed">
                  {locale === "ja"
                    ? "本規約に関するご質問、違反のご報告、その他法的相談については、以下より当団体の法務窓口まで直接ご連絡ください。"
                    : "If you have any questions about these Terms, wish to report a violation, or need to contact our legal team regarding a specific matter, please reach out directly."}
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
                    {locale === "ja" ? "お問い合わせフォーム" : "Contact Form"}
                  </Link>
                </div>
                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <Link href="/privacy" className="text-xs text-white/50 hover:text-white/80 transition-colors underline underline-offset-2">
                    {locale === "ja" ? "プライバシーポリシー" : "Privacy Policy"}
                  </Link>
                  <span className="text-white/20">·</span>
                  <span className="text-xs text-white/50">
                    {locale === "ja"
                      ? "東京：東京都港区赤坂1-2-13 溜池鈴木ビル3F · ノイダ：インド ウッタル・プラデーシュ州 ノイダ セクター136, 162 アリハント・ビジネスセンター 6階"
                      : "Tokyo: Tameike Suzuki Building 3F, 1-2-13 Akasaka, Minato-ku, Tokyo · Noida: JIBB, 6th Floor, 162, Sector 136, Arihant Business Centre, Noida, Uttar Pradesh"}
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
