export interface ProgramItem {
  time: string
  speaker: string
  org: string
  topic: string
  isBreak: boolean
  isHighlight?: boolean
  detailsTitle?: string
  details?: string[]
}

export interface EventLocaleData {
  tagline: string
  title: string
  titleHighlight: string
  titleEnd: string
  subtitle: string
  date: string
  dateDay: string
  time: string
  receptionTime: string
  venue: string
  venueAddress: string
  format: string
  seminarCapacity: string
  receptionCapacity: string
  deadline: string
  program: ProgramItem[]
  organizer: string
  coOrganizers?: string[]
  specialSupport?: string
  supporters?: string[]
  specialCooperation?: string
  mediaPartner?: string
  secretariat?: string
  access?: string
  airport?: string
  overview?: string
  whoShouldAttend?: string[]
}

export interface EventData {
  id: string
  slug: string
  eventDate: string // ISO date string of the actual event
  timeZone: "Asia/Tokyo" | "Asia/Kolkata"
  en: EventLocaleData
  ja: EventLocaleData
  posterEn: string
  posterJa: string
  registrationUrl: string
  mapUrl?: string
  flyerUrl?: string
  icon: string // material symbol name
}

/**
 * Determines if an event has concluded based on the calendar date (YYYY-MM-DD)
 * in the host event's local timezone.
 * Using the event's timezone (instead of the viewer's timezone) ensures that 
 * the event turns "past" at exactly 00:00 local time in its host country, 
 * regardless of where the viewer is located.
 */
export function isPastEvent(
  eventDate: string,
  timeZone: "Asia/Tokyo" | "Asia/Kolkata"
): boolean {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  const todayStr = formatter.format(new Date()) // Returns 'YYYY-MM-DD' in that timezone
  return eventDate < todayStr
}

export const eventsData: EventData[] = [
  {
    id: 'manufacturing',
    slug: 'india-japan-manufacturing-collaboration-2026',
    eventDate: '2026-07-03',
    timeZone: 'Asia/Tokyo',
    icon: 'precision_manufacturing',
    en: {
      tagline: "Unlocking India's Manufacturing Growth Story (3 July 2026)",
      title: "Unlocking India's",
      titleHighlight: "Manufacturing Growth",
      titleEnd: "Story",
      subtitle: "Investment, Partnerships, and Market Entry Opportunities for Japanese Manufacturing Companies",
      date: "Friday, July 3, 2026",
      dateDay: "Friday",
      time: "13:30 - 17:00",
      receptionTime: "16:10 - 16:30",
      venue: "Ginza Blossom (Chuo City Central Hall)",
      venueAddress: "7th Floor, Margaret, 2-15-6 Ginza, Chuo-ku, Tokyo 104-0061 (TEL: 03-3542-8585)",
      access: "1-minute walk from Exit 1 of Shintomicho Station (Tokyo Metro Yurakucho Line) | 6-minute walk from Exit 5 of Higashi-Ginza Station (Tokyo Metro Hibiya Line and Toei Asakusa Line)",
      format: "Hybrid (Online and In-Person,Free of Charge)",
      seminarCapacity: "80 Participants (First-Come, First-Served)",
      receptionCapacity: "",
      deadline: "July 3, 2026",
      overview: "India is emerging as one of the world's most attractive manufacturing destinations, supported by strong economic growth, expanding domestic demand, competitive production capabilities, and proactive government policies.\n\nThis seminar will provide Japanese manufacturers with practical insights into investment opportunities, policy incentives, partnership models, and market entry pathways across key industrial sectors.\n\nThe session is specially designed for companies engaged in machine tools, semiconductor manufacturing equipment, factory automation, industrial machinery, robotics, precision engineering, and advanced manufacturing technologies.",
      whoShouldAttend: [
        "Machine Tools",
        "Industrial Machinery",
        "Semiconductor Manufacturing Equipment",
        "Factory Automation",
        "Robotics",
        "Precision Engineering",
        "Advanced Manufacturing Technologies"
      ],
      program: [
        { time: '13:30-14:00', speaker: '', org: '', topic: 'Registration and Networking', isBreak: true },
        {
          time: '14:00-14:10',
          speaker: 'Invest India & JIBB Representatives',
          org: 'Invest India / JIBB',
          topic: 'Welcome Remarks',
          isBreak: false,
          detailsTitle: 'Overview',
          details: ['India Japan industrial cooperation', 'Objectives of the seminar']
        },
        {
          time: '14:10-14:55',
          speaker: 'Invest India Representative',
          org: 'Invest India',
          topic: "India's Manufacturing Opportunity: Why India, Why Now",
          isBreak: false,
          detailsTitle: 'Topics Covered',
          details: [
            "Investment opportunities in India's manufacturing sector",
            "Growth outlook for machine tools and industrial machinery",
            "Semiconductor ecosystem development and opportunities",
            "Government incentives and policy support",
            "Industrial partnerships and joint venture opportunities",
            "Support available through Invest India and JIBB for market entry"
          ]
        },
        {
          time: '14:55-15:25',
          speaker: 'JIBB Representative',
          org: 'JIBB',
          topic: 'From Strategy to Setup: How JIBB Supports Successful Market Entry into India',
          isBreak: false,
          detailsTitle: 'Topics Covered',
          details: [
            "Selecting the right manufacturing location",
            "Identifying strategic joint ventures and business partners",
            "Understanding central and state government incentive schemes",
            "Regulatory requirements and compliance roadmap",
            "Licenses, approvals, and clearances required for manufacturing operations",
            "End to end project execution support",
            "Case study of a Japanese company's successful entry into India"
          ]
        },
        {
          time: '15:25-15:50',
          speaker: 'Association Speakers',
          org: 'JMTBA / SEAJ / JMF / JARA',
          topic: 'Industry Perspectives from Japanese Manufacturing Associations',
          isBreak: false,
          detailsTitle: 'Topics',
          details: ["Industry outlook", "Expectations from the Indian market", "Areas for India Japan industrial collaboration"]
        },
        {
          time: '15:50-16:10',
          speaker: 'Invest India, JIBB & Association Reps',
          org: 'Panel',
          topic: 'Panel Discussion and Open Q&A',
          isBreak: false,
          detailsTitle: 'Discussion Themes',
          details: [
            "Opportunities and challenges for Japanese manufacturers in India",
            "Building successful India Japan partnerships",
            "Future outlook for manufacturing collaboration"
          ]
        },
        { time: '16:10-16:30', speaker: '', org: '', topic: 'Networking Session and Individual Consultations', isBreak: false, isHighlight: true },
        { time: '16:30', speaker: 'JIBB Representative', org: 'JIBB', topic: 'Closing Remarks', isBreak: false }
      ],
      organizer: "Invest India (Government of India)",
      coOrganizers: ["NPO Japan India Business Bureau (JIBB)"],
      specialSupport: "Japan-India Consulting Co., Ltd. (Secretariat)",
      supporters: [
        "Japan Machine Tool Builders' Association",
        "Semiconductor Equipment Association of Japan",
        "Japan Machinery Federation",
        "Japan Robot Association"
      ],
      specialCooperation: "",
      mediaPartner: "",
      secretariat: ""
    },
    ja: {
      tagline: "インド製造業の成長ストーリー（2026年7月3日）",
      title: "インド製造業の",
      titleHighlight: "成長ストーリーを紐解く",
      titleEnd: "セミナー",
      subtitle: "日本製造企業向け投資・パートナーシップ・市場参入機会",
      date: "2026年7月3日（金）",
      dateDay: "金曜日",
      time: "14:00〜17:00",
      receptionTime: "16:10〜16:30",
      venue: "銀座ブロッサム（中央会館）",
      venueAddress: "〒104-0061 東京都中央区銀座2-15-6 7階 マーガレット (TEL: 03-3542-8585)",
      access: "新富町駅（東京メトロ有楽町線）出口1から徒歩1分 | 東銀座駅（東京メトロ日比谷線・都営浅草線）出口5から徒歩6分",
      format: "ハイブリッド形式（オンラインと対面、無料）",
      seminarCapacity: "80名",
      receptionCapacity: "",
      deadline: "7月3日（金）",
      overview: "インドは、力強い経済成長、拡大する国内需要、競争力のある生産能力、積極的な政府の政策に支えられ、世界で最も魅力的な製造業の目的地の一つとして浮上しています。\n\n本セミナーでは、日本の製造業企業に向けて、主要産業分野における投資機会、政策インセンティブ、パートナーシップモデル、市場参入経路に関する実用的な洞察を提供します。\n\n本セッションは、工作機械、半導体製造装置、ファクトリーオートメーション、産業機械、ロボット工学、精密機械工学、および高度な製造技術に携わる企業向けに特別に設計されています。",
      whoShouldAttend: ["工作機械", "産業機械", "半導体製造装置", "ファクトリーオートメーション", "ロボット工学", "精密工学", "先端製造技術"],
      program: [
        { time: '13:30-14:00', speaker: '', org: '', topic: '受付・ネットワーキング', isBreak: true },
        { time: '14:00-14:10', speaker: 'インベスト・インディア / JIBB 代表者', org: 'Invest India / JIBB', topic: '開会挨拶・本セミナーの目的', isBreak: false, detailsTitle: '概要', details: ['日印産業協力の現状と方向性', '本セミナーの目的'] },
        { time: '14:10-14:55', speaker: 'インベスト・インディア 代表者', org: 'Invest India', topic: 'インドの製造業における機会：なぜ今、インドなのか', isBreak: false, detailsTitle: '主なテーマ', details: ['インド製造業セクターにおける投資機会', '工作機械および産業機械の成長見通し', '半導体エコシステムの開発と機会', '政府のインセンティブと政策支援', '産業パートナーシップおよび合弁事業の機会', 'インベスト・インディアおよびJIBBによる市場参入支援'] },
        { time: '14:55-15:25', speaker: 'JIBB 代表者', org: 'JIBB', topic: '戦略から設立まで：JIBBが支援するインド市場への進出成功ロードマップ', isBreak: false, detailsTitle: '主なテーマ', details: ['適切な製造拠点の選定', '戦略的合弁パートナーおよびビジネスパートナーの特定', '中央政府および州政府のインセンティブ制度の理解', '規制要件とコンプライアンス・ロードマップ', '製造操業に必要な許認可・承認手続き', 'エンドツーエンドのプロジェクト実行支援', '日本企業のインド進出成功事例ケーススタディ'] },
        { time: '15:25-15:50', speaker: '各業界団体 代表者', org: 'JMTBA / SEAJ / JMF / JARA', topic: '日本の製造業関連団体からの業界動向・展望', isBreak: false, detailsTitle: 'トピック', details: ['業界の展望・ロードマップ', 'インド市場への期待', '日印産業協力の重点分野'] },
        { time: '15:50-16:10', speaker: 'インベスト・インディア、JIBB、業界団体代表者', org: 'パネル', topic: 'パネルディスカッションと質疑応答', isBreak: false, detailsTitle: 'ディスカッションテーマ', details: ['在印日本系製造企業の機会と課題', '日印パートナーシップ構築の成功要因', '製造業における今後の協力関係の展望'] },
        { time: '16:10-16:30', speaker: '', org: '', topic: 'ネットワーキング・個別相談会', isBreak: false, isHighlight: true },
        { time: '16:30', speaker: 'JIBB 代表者', org: 'JIBB', topic: '閉会挨拶', isBreak: false }
      ],
      organizer: "インベスト・インディア（インド政府）",
      coOrganizers: ["NPO法人 日本インドビジネスビューロー（JIBB）"],
      specialSupport: "日印コンサルティング株式会社",
      supporters: ["一般社団法人日本工作機械工業会", "一般社団法人日本半導体製造装置協会", "一般社団法人日本機械工業連合会", "一般社団法人日本ロボット工業会"],
      specialCooperation: "",
      mediaPartner: "",
      secretariat: ""
    },
    posterEn: '/events/JIBB_Event_3_July_2026_square.jpg',
    posterJa: '/events/JIBB_Event_3_July_2026_square.jpg',
    registrationUrl: 'https://forms.office.com/r/d7tMkBLaq8',
    mapUrl: 'https://maps.app.goo.gl/kAAERz983N4dShL77',
    flyerUrl: '/events/invest-india_seminar_invitation_jp.pdf'
  },
  {
    id: 'semicon',
    slug: 'semicon-india-2026',
    eventDate: '2026-04-28',
    timeZone: 'Asia/Tokyo',
    icon: 'memory',
    en: {
      tagline: 'Semicon India 2026 (Sep 17-19, 2026)',
      title: '1st Exhibition Briefing &',
      titleHighlight: 'Semiconductor Market',
      titleEnd: 'Outlook Seminar',
      subtitle: "Join us for an exclusive briefing on India's semiconductor market and the Japan Pavilion exhibition opportunity at Semicon India 2026 in New Delhi.",
      date: 'April 28, 2026',
      dateDay: 'Tuesday',
      time: '14:00 - 17:45',
      receptionTime: '17:45 - 19:30',
      venue: 'Plaza F, Tokyo',
      venueAddress: '15 Rokubancho, Chiyoda-ku, Tokyo 102-0085',
      format: 'Hybrid',
      seminarCapacity: '100',
      receptionCapacity: '60',
      deadline: 'April 24, 2026',
      program: [
        { time: '14:00-14:05', speaker: 'Mr. Tatsutoshi Suzuki (JISC Chairman / Toho Koki Chairman)', org: 'JISC', topic: 'Opening Remarks', isBreak: false },
        { time: '14:05-14:10', speaker: 'Mr. Yasuhiko Takeno (President & CEO)', org: 'GNC', topic: 'Greetings', isBreak: false },
        { time: '14:10-14:15', speaker: 'Mr. Ashok Chandak (President)', org: 'IESA', topic: 'Greetings (Online)', isBreak: false },
        { time: '14:15-14:45', speaker: 'Dr. Toshiro Doi (Kyushu Univ. Professor Emeritus / CMP Committee Founder)', org: 'CMP Committee', topic: 'Greetings & CMP Committee Introduction', isBreak: false },
        { time: '14:45-15:15', speaker: 'Mr. Hirokuni Hiyama (Ebara Corp. Technical Advisor / CMP Committee Honorary Chair)', org: 'CMP Committee', topic: 'Global Semiconductor Trends & CMP Equipment', isBreak: false },
        { time: '15:15-16:05', speaker: 'Mr. Ashok Chandak (President)', org: 'IESA', topic: 'India Market Status & Outlook (Online)', isBreak: false },
        { time: '16:05-16:10', speaker: '', org: '', topic: 'Semicon India 2026 Video Introduction', isBreak: true },
        { time: '16:10-16:25', speaker: 'TBA', org: 'IESA', topic: 'Semicon India 2026 Exhibition Details (Online)', isBreak: false },
        { time: '16:25-16:45', speaker: 'Mr. Takuya Nishimura (General Manager)', org: 'Toho Koki', topic: 'One Year Performance Evaluation After India Entry', isBreak: false },
        { time: '16:45-17:05', speaker: 'Mr. Norihisa Akitani (Director)', org: 'JISC', topic: 'Semicon India Trends', isBreak: false },
        { time: '17:05-17:25', speaker: 'Mr. Sai Chandra Teja (Green PMU COO / Indobox Partner / JISC Member)', org: 'Green PMU', topic: 'Accelerating Japan-India Semiconductor Industry', isBreak: false },
        { time: '17:25-17:35', speaker: 'Mr. Shigeru Yasui (CEO)', org: 'JIBB / JISC', topic: 'Japan Pavilion Benefits, JISC Functions, Business Center & IT Talent', isBreak: false },
        { time: '17:35-17:45', speaker: '', org: '', topic: 'Q&A Session', isBreak: true },
        { time: '17:45-19:30', speaker: '', org: '', topic: 'Reception (Networking Party)', isBreak: false, isHighlight: true }
      ],
      organizer: 'India Electronics & Semiconductor Association (IESA)',
      coOrganizers: ['NPO Japan India Business Bureau (JIBB)'],
      specialSupport: 'JSPE Planarization CMP Technical Committee',
      supporters: ['FOURIN Inc.', 'Indobox Inc.'],
      specialCooperation: 'Global Net Corporation (GNC)',
      mediaPartner: 'Nikkan Kogyo Shimbun',
      secretariat: 'Japan India Consulting (JIC)'
    },
    ja: {
      tagline: 'Semicon India 2026（2026年9月17日〜19日 / ニューデリー）',
      title: '第一回 出展説明会 及び',
      titleHighlight: 'インド半導体市場の現状と展望',
      titleEnd: 'セミナー',
      subtitle: 'インド市場への具体的な進出方法 ―「セミコンインディア2026ジャパンパビリオン出展募集」―',
      date: '2026年4月28日',
      dateDay: '火曜日',
      time: '14:00〜17:45',
      receptionTime: '17:45〜19:30',
      venue: 'プラザエフ（東京）',
      venueAddress: '〒102-0085 東京都千代田区六番町15番地',
      format: 'ハイブリッド（会場＋オンライン）',
      seminarCapacity: '100名',
      receptionCapacity: '60名',
      deadline: '4月24日（金）',
      program: [
        { time: '14:00-14:05', speaker: '鈴木辰俊 氏（JISC会長 / 東邦鋼機製作所 会長）', org: 'JISC', topic: '開会挨拶', isBreak: false },
        { time: '14:05-14:10', speaker: '武野泰彦 氏（代表取締役社長）', org: 'GNC', topic: 'ご挨拶', isBreak: false },
        { time: '14:10-14:15', speaker: 'Ashok Chandak 氏（President）', org: 'IESA', topic: 'ご挨拶（オンライン）', isBreak: false },
        { time: '14:15-14:45', speaker: '土肥俊郎 氏（九州大学 名誉教授 / CMP専門委員会 創設者・名誉会長）', org: 'CMP専門委員会', topic: 'ご挨拶 ― CMP専門委員会の設立経緯・紹介', isBreak: false },
        { time: '14:45-15:15', speaker: '檜山浩國 氏（荏原製作所 技監 / CMP専門委員会 名誉委員長）', org: 'CMP専門委員会', topic: '半導体世界情勢とCMP装置', isBreak: false },
        { time: '15:15-16:05', speaker: 'Ashok Chandak 氏（President）', org: 'IESA', topic: 'インド市場の現状と展望（オンライン）', isBreak: false },
        { time: '16:05-16:10', speaker: '', org: '', topic: 'Semicon India 2026 ビデオ紹介', isBreak: true },
        { time: '16:10-16:25', speaker: '※登壇者名は後日確定', org: 'IESA', topic: 'Semicon India 2026 展示会説明（オンライン）', isBreak: false },
        { time: '16:25-16:45', speaker: '西村拓也 氏（事業統括部長）', org: '東邦鋼機製作所', topic: 'インド進出から一年での実績評価', isBreak: false },
        { time: '16:45-17:05', speaker: '穐谷宜親 氏（ディレクター）', org: 'JISC', topic: 'インドセミコンの流れ', isBreak: false },
        { time: '17:05-17:25', speaker: 'サイ・チャンドラ・テジャ 氏（Green PMU COO / Indobox パートナー / JISC委員）', org: 'Green PMU', topic: '日印間での半導体産業を加速させるための提案・方法・高度人材について', isBreak: false },
        { time: '17:25-17:35', speaker: '安井重麿 氏（CEO）', org: 'JIBB / JISC', topic: 'ジャパンパビリオンのメリット、JISCの機能紹介、日印半導体ビジネスセンター開設、インドIT人材の雇用について', isBreak: false },
        { time: '17:35-17:45', speaker: '', org: '', topic: '質疑応答', isBreak: true },
        { time: '17:45-19:30', speaker: '', org: '', topic: 'レセプション（懇親会）', isBreak: false, isHighlight: true }
      ],
      organizer: 'インド電子・半導体工業会（IESA）',
      coOrganizers: ['NPO法人 日本インドビジネスビューロー（JIBB）'],
      specialSupport: '精密工学会「プラナリゼーションCMPとその応用専門委員会」',
      supporters: ['株式会社FOURIN（フォーイン）', 'Indobox株式会社'],
      specialCooperation: 'グローバルネット株式会社（GNC）',
      mediaPartner: '日刊工業新聞（予定）',
      secretariat: '日印コンサルティング株式会社（JIC）'
    },
    posterEn: '/events/semicon-india-2026-en.png',
    posterJa: '/events/semicon-india-2026-ja.jpeg',
    registrationUrl: 'https://forms.office.com/r/0F9ajnDpp2'
  },
  {
    id: 'mobility',
    slug: 'bharat-mobility-2026',
    eventDate: '2026-05-11',
    timeZone: 'Asia/Tokyo',
    icon: 'directions_car',
    en: {
      tagline: 'Bharat Mobility 2027 (Feb 4-7, 2027)',
      title: '4th Bharat Mobility 2027 &',
      titleHighlight: 'India Automotive Business',
      titleEnd: 'Entry Seminar',
      subtitle: "ACMA delegation visits Japan! Learn about India's automotive market outlook and entry methods, plus the Bharat Mobility 2027 exhibition opportunity.",
      date: 'May 11, 2026',
      dateDay: 'Monday',
      time: '13:00 - 17:50',
      receptionTime: '',
      venue: 'Ginza Blossom, Tokyo',
      venueAddress: '2-15-6 Ginza, Chuo-ku, Tokyo 104-0061',
      format: 'Hybrid',
      seminarCapacity: '100',
      receptionCapacity: '',
      deadline: 'April 30, 2026',
      program: [
        { time: '13:00-14:00', speaker: '', org: '', topic: 'Registration', isBreak: true },
        { time: '14:00-14:05', speaker: 'Yosuke Yanagase', org: 'JIBB', topic: 'Opening Remarks', isBreak: false },
        { time: '14:05-14:25', speaker: 'Masashi Kono', org: 'JETRO', topic: 'Support for Japanese Companies Entering India', isBreak: false },
        { time: '14:25-14:45', speaker: 'TBA', org: 'JAPIA', topic: "JAPIA's India Market Initiatives", isBreak: false },
        { time: '14:45-15:00', speaker: 'Vinnie Mehta (Director General)', org: 'ACMA', topic: 'Greetings from ACMA (Online)', isBreak: false },
        { time: '15:00-15:40', speaker: 'Lokesh Raina (Deputy Executive Director)', org: 'ACMA', topic: 'India Automotive Industry Outlook', isBreak: false },
        { time: '15:40-16:10', speaker: 'Tetsuo Kubo & Kazuaki Funahashi', org: 'FOURIN', topic: 'Middle East Situation Impact & India Automotive Market Report', isBreak: false },
        { time: '16:10-16:40', speaker: 'Lokesh Raina', org: 'ACMA', topic: 'Bharat Mobility 2027 Exhibition Guide', isBreak: false },
        { time: '16:40-17:10', speaker: 'Masatoshi Nishimoto', org: 'S&P Global Mobility', topic: 'India Market Mid-to-Long Term Forecast', isBreak: false },
        { time: '17:10-17:40', speaker: 'Seiichi Kondo', org: 'Resonac', topic: 'Why is Semiconductor Industry Profitability High? Comparison with Automotive', isBreak: false },
        { time: '17:40-17:50', speaker: '', org: '', topic: 'Q&A', isBreak: false, isHighlight: true }
      ],
      organizer: 'Automotive Component Manufacturers Association of India (ACMA)',
      coOrganizers: [],
      specialSupport: 'Japan Auto Parts Industries Association (JAPIA)',
      supporters: ['NPO Japan India Business Bureau (JIBB)'],
      specialCooperation: 'FOURIN Inc., S&P Global Mobility, JISC',
      mediaPartner: 'Nikkan Kogyo Shimbun',
      secretariat: 'Japan India Consulting (JIC)'
    },
    ja: {
      tagline: 'Bharat Mobility 2027（2027年2月4日〜7日）',
      title: '第4回 Bharat Mobility 2027 &',
      titleHighlight: 'インド自動車ビジネス',
      titleEnd: '進出セミナー',
      subtitle: 'インド自動車産業 〜市場展望と進出方法〜 インド自動車部品工業会（ACMA）来日！',
      date: '2026年5月11日',
      dateDay: '月曜日',
      time: '13:00〜17:50',
      receptionTime: '',
      venue: '銀座ブロッサム（中央会館）会議室「マーガレット」',
      venueAddress: '〒104-0061 東京都中央区銀座2-15-6',
      format: 'ハイブリッド（会場＋オンライン）',
      seminarCapacity: '100名',
      receptionCapacity: '',
      deadline: '4月30日（木）',
      program: [
        { time: '13:00-14:00', speaker: '', org: '', topic: '受付', isBreak: true },
        { time: '14:00-14:05', speaker: '柳ヶ瀨 洋介 氏（名誉理事）', org: 'JIBB', topic: '開会挨拶', isBreak: false },
        { time: '14:05-14:25', speaker: '河野 将史 氏（調査部主幹）', org: 'JETRO', topic: 'インドにおける日本企業の進出支援など', isBreak: false },
        { time: '14:25-14:45', speaker: 'TBA', org: 'JAPIA', topic: 'インド市場に向けてのJAPIAの取り組み', isBreak: false },
        { time: '14:45-15:00', speaker: 'Vinnie Mehta 氏（Director General）', org: 'ACMA', topic: 'ACMAからの挨拶（オンライン）', isBreak: false },
        { time: '15:00-15:40', speaker: 'Lokesh Raina 氏（Deputy Executive Director）', org: 'ACMA', topic: 'インド自動車産業展望', isBreak: false },
        { time: '15:40-16:10', speaker: '久保 鉄男 氏 & 舟橋 一晃 氏', org: 'フォーイン', topic: '中東有事の影響について & インド自動車市場の報告', isBreak: false },
        { time: '16:10-16:40', speaker: 'Lokesh Raina 氏', org: 'ACMA', topic: 'Bharat Mobility 2027 出展案内', isBreak: false },
        { time: '16:40-17:10', speaker: '西本 真敏 氏（ダイレクター）', org: 'S&P Global Mobility', topic: 'インド市場の中長期 未来市場予測', isBreak: false },
        { time: '17:10-17:40', speaker: '近藤 誠一 氏', org: 'レゾナック', topic: '半導体産業の利益率はどうして高いのか？自動車産業と比較してみる', isBreak: false },
        { time: '17:40-17:50', speaker: '', org: '', topic: '質疑応答', isBreak: false, isHighlight: true }
      ],
      organizer: 'インド自動車部品工業会（ACMA）',
      coOrganizers: [],
      specialSupport: '日本自動車部品工業会（JAPIA）',
      supporters: ['NPO法人日本インドビジネスビューロー（JIBB）'],
      specialCooperation: '株式会社フォーイン / S&P Global Mobility / 日印半導体コミッティ（JISC）',
      mediaPartner: '日刊工業新聞社（予定）',
      secretariat: '日印コンサルティング株式会社（JIC）'
    },
    posterEn: '/events/bharat-mobility-2027-en.png',
    posterJa: '/events/bharat-mobility-2027-ja.jpeg',
    registrationUrl: 'https://forms.office.com/r/UbXevM8d3Y'
  },
  {
    id: 'imtex',
    slug: 'imtex-2027',
    eventDate: '2027-01-21',
    timeZone: 'Asia/Kolkata',
    icon: 'precision_manufacturing',
    en: {
      tagline: 'IMTEX 2027 (Jan 21-27, 2027)',
      title: 'IMTEX',
      titleHighlight: '2027',
      titleEnd: 'International Machine Tool & Manufacturing Technology Exhibition',
      subtitle: 'Smarter Mobility For a Better Tomorrow',
      date: 'January 21-27, 2027',
      dateDay: 'Thursday',
      time: 'TBA',
      receptionTime: '',
      venue: 'BIEC, Bengaluru',
      venueAddress: 'BIEC, Bengaluru, India',
      format: 'In-Person Exhibition',
      seminarCapacity: 'TBA',
      receptionCapacity: '',
      deadline: 'TBA',
      overview: 'IMTEX is India\'s premier machine tool and manufacturing technologies exhibition, attracting participants from across the globe. This is an excellent opportunity for Japanese machine tool manufacturers and precision engineering companies to explore the Indian market and establish business partnerships.',
      whoShouldAttend: [
        'Machine Tool Manufacturers',
        'Precision Engineering Companies',
        'Industrial Machinery Suppliers',
        'Technology Providers',
        'Business Partners'
      ],
      program: [],
      organizer: 'IMTEX',
      coOrganizers: ['NPO Japan India Business Bureau (JIBB)'],
      specialSupport: '',
      supporters: [],
      specialCooperation: '',
      mediaPartner: '',
      secretariat: ''
    },
    ja: {
      tagline: 'IMTEX 2027（2027年1月21日〜27日）',
      title: 'IMTEX',
      titleHighlight: '2027',
      titleEnd: '国際工作機械・製造技術展示会',
      subtitle: 'より良い明日のための工作機械・先進製造技術',
      date: '2027年1月21日〜27日',
      dateDay: '木曜日',
      time: '未定',
      receptionTime: '',
      venue: 'BIEC（バンガロール国際展示センター）',
      venueAddress: 'インド、ベンガルール、BIEC',
      format: '対面展示会',
      seminarCapacity: '未定',
      receptionCapacity: '',
      deadline: '未定',
      overview: 'IMTEXはインドの最高レベルの工作機械および製造技術展示会で、世界中から参加者が集まります。日本の工作機械メーカーと精密工学企業がインド市場を探索し、ビジネスパートナーシップを確立する絶好の機会です。',
      whoShouldAttend: [
        '工作機械メーカー',
        '精密工学企業',
        '産業機械サプライヤー',
        'テクノロジープロバイダー',
        'ビジネスパートナー'
      ],
      program: [],
      organizer: 'IMTEX',
      coOrganizers: ['NPO法人 日本インドビジネスビューロー（JIBB）'],
      specialSupport: '',
      supporters: [],
      specialCooperation: '',
      mediaPartner: '',
      secretariat: ''
    },
    posterEn: '/events/imtex-2027-event.png',
    posterJa: '/events/imtex-2027-event.png',
    registrationUrl: 'https://www.imtex.in/',
    flyerUrl: ''
  },
  {
    id: 'semicon-upcoming',
    slug: 'semicon-india-2026-upcoming',
    eventDate: '2026-09-17',
    timeZone: 'Asia/Kolkata',
    icon: 'memory',
    en: {
      tagline: 'SEMICON India 2026 (Sep 17-19, 2026)',
      title: 'SEMICON India',
      titleHighlight: '2026',
      titleEnd: '',
      subtitle: 'Transform Tomorrow at SEMICON® India 2026',
      date: 'September 17-19, 2026',
      dateDay: 'Thursday',
      time: 'TBA',
      receptionTime: '',
      venue: 'Yashobhoomi',
      venueAddress: 'Yashobhoomi, Delhi, India',
      format: 'In-Person Exhibition',
      seminarCapacity: 'TBA',
      receptionCapacity: '',
      deadline: 'TBA',
      overview: 'SEMICON India is the leading semiconductor industry exhibition showcasing cutting-edge technologies and innovations. This event provides an excellent platform for Japanese semiconductor companies to explore market opportunities and establish strategic partnerships in India\'s rapidly growing semiconductor ecosystem.',
      whoShouldAttend: [
        'Semiconductor Manufacturers',
        'Equipment Suppliers',
        'Technology Innovators',
        'Business Partners',
        'Industry Stakeholders'
      ],
      program: [],
      organizer: 'India Semiconductor Mission (ISM)',
      coOrganizers: ['NPO Japan India Business Bureau (JIBB)'],
      specialSupport: '',
      supporters: [],
      specialCooperation: '',
      mediaPartner: '',
      secretariat: ''
    },
    ja: {
      tagline: 'SEMICON India 2026（2026年9月17日〜19日）',
      title: 'SEMICON India',
      titleHighlight: '2026',
      titleEnd: '',
      subtitle: 'SEMICON® India 2026 で明日の産業を変革',
      date: '2026年9月17日〜19日',
      dateDay: '木曜日',
      time: '未定',
      receptionTime: '',
      venue: 'ヤショブーミ',
      venueAddress: 'インド、デリー、ヤショブーミ',
      format: '対面展示会',
      seminarCapacity: '未定',
      receptionCapacity: '',
      deadline: '未定',
      overview: 'SEMICON Indiaは最先端の技術と革新を展示する業界をリードする半導体展示会です。このイベントは、日本の半導体企業がインドの急速に成長する半導体エコシステムにおける市場機会を探索し、戦略的パートナーシップを確立するための優れたプラットフォームを提供します。',
      whoShouldAttend: [
        '半導体メーカー',
        '機器サプライヤー',
        'テクノロジーイノベーター',
        'ビジネスパートナー',
        '業界ステークホルダー'
      ],
      program: [],
      organizer: 'インド半導体ミッション（ISM）',
      coOrganizers: ['NPO法人 日本インドビジネスビューロー（JIBB）'],
      specialSupport: '',
      supporters: [],
      specialCooperation: '',
      mediaPartner: '',
      secretariat: ''
    },
    posterEn: '/events/semicon-india-2026-event.png',
    posterJa: '/events/semicon-india-2026-event.png',
    registrationUrl: 'https://www.semiconindia.org/',
    flyerUrl: ''
  },
  {
    id: 'mobility-upcoming',
    slug: 'bharat-mobility-2027-upcoming',
    eventDate: '2027-02-04',
    timeZone: 'Asia/Kolkata',
    icon: 'directions_car',
    en: {
      tagline: 'Bharat Mobility 2027 (Feb 4-9, 2027)',
      title: 'Bharat Mobility',
      titleHighlight: '2027',
      titleEnd: 'Global Expo',
      subtitle: 'Smarter Mobility For a Better Tomorrow',
      date: 'February 4-9, 2027',
      dateDay: 'Thursday',
      time: 'TBA',
      receptionTime: '',
      venue: 'Bharat Mandapam, Pragati Maidan',
      venueAddress: 'Bharat Mandapam, Pragati Maidan, New Delhi, India',
      format: 'In-Person Exhibition',
      seminarCapacity: 'TBA',
      receptionCapacity: '',
      deadline: 'TBA',
      overview: 'Bharat Mobility is India\'s premier automotive industry exhibition showcasing the latest innovations in automotive technology, electric vehicles, and sustainable mobility solutions. This is an ideal platform for Japanese automotive and component manufacturers to explore market opportunities and strengthen partnerships.',
      whoShouldAttend: [
        'Automotive Manufacturers',
        'Component Suppliers',
        'Technology Providers',
        'Distributors',
        'Industry Partners'
      ],
      program: [],
      organizer: 'ACMA',
      coOrganizers: ['NPO Japan India Business Bureau (JIBB)'],
      specialSupport: '',
      supporters: [],
      specialCooperation: '',
      mediaPartner: '',
      secretariat: ''
    },
    ja: {
      tagline: 'Bharat Mobility 2027（2027年2月4日〜9日）',
      title: 'Bharat Mobility',
      titleHighlight: '2027',
      titleEnd: 'グローバルエキスポ',
      subtitle: 'より良い明日のためのスマートモビリティ',
      date: '2027年2月4日〜9日',
      dateDay: '木曜日',
      time: '未定',
      receptionTime: '',
      venue: 'バーラト・マンダパム（プラガティ・マイダン）',
      venueAddress: 'インド、ニューデリー、プラガティ・マイダン、バーラト・マンダパム',
      format: '対面展示会',
      seminarCapacity: '未定',
      receptionCapacity: '',
      deadline: '未定',
      overview: 'Bharat Mobilityはインドの自動車業界における最高レベルの展示会で、自動車技術、電気自動車、持続可能なモビリティソリューションの最新イノベーションを展示しています。日本の自動車および部品メーカーが市場機会を探索し、パートナーシップを強化するための理想的なプラットフォームです。',
      whoShouldAttend: [
        '自動車メーカー',
        '部品サプライヤー',
        'テクノロジープロバイダー',
        'ディストリビューター',
        '業界パートナー'
      ],
      program: [],
      organizer: 'ACMA',
      coOrganizers: ['NPO法人 日本インドビジネスビューロー（JIBB）'],
      specialSupport: '',
      supporters: [],
      specialCooperation: '',
      mediaPartner: '',
      secretariat: ''
    },
    posterEn: '/events/bharat-mobility-2027-event.png',
    posterJa: '/events/bharat-mobility-2027-event.png',
    registrationUrl: 'https://www.bharat-mobility.com/',
    flyerUrl: ''
  }
]

export function getEventBySlug(slug: string): EventData | undefined {
  return eventsData.find(e => e.slug === slug)
}

export const upcomingEvents = eventsData
  .filter(e => !isPastEvent(e.eventDate, e.timeZone))
  .sort((a, b) => a.eventDate.localeCompare(b.eventDate))

export const pastEvents = eventsData
  .filter(e => isPastEvent(e.eventDate, e.timeZone))
  .sort((a, b) => a.eventDate.localeCompare(b.eventDate))

