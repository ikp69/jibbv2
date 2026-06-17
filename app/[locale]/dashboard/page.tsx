import { createClient } from "@/lib/supabase/server";
import { setRequestLocale } from "next-intl/server";
import { MatchRequestForm } from "./MatchRequestForm";
import { Link } from "@/src/i18n/navigation";
import { 
  FileDown, BookOpen, Layers, Laptop, 
  HelpCircle, Sparkles, Lock, ArrowUpRight, 
  ChevronRight, Calendar, UserCheck 
} from "lucide-react";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  // 1. Fetch user profile
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id || "")
    .single();

  const currentTier = profile?.membership_tier || "associate";

  // 2. Fetch accessible premium resources (automatically filtered by RLS policies!)
  const { data: resources } = await supabase
    .from("premium_resources")
    .select("*")
    .order("created_at", { ascending: false });

  // 3. Define locked teaser resources to encourage upgrades
  const upgradeTeasers = [
    {
      title: "India-Japan Semiconductor Corridor Study 2026",
      title_ja: "日印半導体コリドー調査レポート 2026",
      tier: "gold",
      desc: "Deep dive into manufacturing hubs in Gujarat and talent mapping in Bengaluru.",
      desc_ja: "グジャラート州の製造ハブとベンガルールの人材マッピングの詳細分析。"
    },
    {
      title: "Bilateral Automotive Supply Chain Best Practices",
      title_ja: "二国間自動車サプライチェーン・ベストプラクティス",
      tier: "silver",
      desc: "Operational patterns for Suzuki, Toyota, and Honda suppliers in India.",
      desc_ja: "インドにおけるスズキ、トヨタ、ホンダサプライヤーの業務パターン。"
    },
    {
      title: "JIBB Annual Ecosystem Report & Directory",
      title_ja: "JIBB 年次エコシステム報告書＆ディレクトリ",
      tier: "platinum",
      desc: "Full database of member capabilities and industrial collaboration models.",
      desc_ja: "会員企業の能力と産業協力モデルの完全データベース。"
    }
  ].filter(teaser => {
    // Show teasers of higher tiers than user's current tier
    const tiers = ["associate", "silver", "gold", "platinum", "admin"];
    return tiers.indexOf(teaser.tier) > tiers.indexOf(currentTier);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Panel */}
      <div className="rounded-3xl bg-gradient-to-r from-jibb-indigo-dark to-[#101b38] border border-white/5 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-jibb-orange/10 text-jibb-orange border border-jibb-orange/20">
            <Sparkles className="size-3.5 fill-jibb-orange/15" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {locale === "ja" ? "会員専用ポータル" : "Exclusive Portal"}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {locale === "ja" ? "メンバーダッシュボード" : "Welcome back to JIBB"}
          </h2>
          <p className="text-white/70 text-xs md:text-sm max-w-xl">
            {locale === "ja"
              ? "あなたのプランに合わせたプレミアムデータ、最新レポート、および日印B2Bマッチングサービスをご利用いただけます。"
              : "Access premium bilateral industry reports, B2B collaboration request forms, and partner advisory desks."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="#downloads"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <BookOpen className="size-4 text-jibb-orange" />
            {locale === "ja" ? "レポート一覧" : "View Reports"}
          </a>
          <a
            href="#b2b-desk"
            className="px-4 py-2 rounded-xl bg-jibb-orange hover:bg-jibb-orange-light text-white text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Layers className="size-4" />
            {locale === "ja" ? "マッチング申請" : "Submit B2B Inquiry"}
          </a>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Accessible Resources & Locked Teasers (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Downloads Section */}
          <section id="downloads" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight">
                {locale === "ja" ? "プレミアムライブラリ（ダウンロード可能）" : "Premium Library & Downloads"}
              </h3>
              <span className="text-xs text-white/50 bg-white/5 px-2.5 py-1 rounded-md border border-white/5 uppercase font-semibold">
                {resources?.length || 0} {locale === "ja" ? "件利用可能" : "Available"}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {resources && resources.length > 0 ? (
                resources.map((res) => (
                  <div
                    key={res.id}
                    className="group relative rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-5 flex flex-col justify-between gap-5 transition-all hover:border-white/10"
                  >
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-jibb-orange/10 text-jibb-orange border border-jibb-orange/10 uppercase tracking-wider inline-block">
                        {res.resource_type}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-jibb-orange transition-colors">
                        {locale === "ja" ? res.title_ja : res.title}
                      </h4>
                      <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                        {locale === "ja" ? res.description_ja : res.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] text-white/50">
                      <span>{res.file_size || "Unknown Size"}</span>
                      {/* Standard Mock Download Action */}
                      <button
                        type="button"
                        onClick={() => alert(locale === "ja" ? "ファイルのダウンロードを開始します..." : "Starting download...")}
                        className="h-8 px-3 rounded-lg bg-white/5 hover:bg-jibb-orange hover:text-white border border-white/10 hover:border-jibb-orange text-white font-bold flex items-center gap-1.5 transition-all text-xs"
                      >
                        <FileDown className="size-3.5" />
                        {locale === "ja" ? "ダウンロード" : "Download"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/40 text-xs">
                  {locale === "ja" ? "利用可能なダウンロードはありません。" : "No download resources available."}
                </div>
              )}
            </div>
          </section>

          {/* Locked Resources Segment */}
          {upgradeTeasers.length > 0 && (
            <section className="space-y-4 pt-4">
              <h3 className="text-base font-bold text-white/80">
                {locale === "ja" ? "アップグレードで利用可能になる資料" : "Unlock with Upgrade"}
              </h3>

              <div className="space-y-3">
                {upgradeTeasers.map((teaser, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/40 text-left opacity-75 hover:opacity-95 transition-opacity"
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                          {teaser.tier}
                        </span>
                        <h4 className="text-xs font-bold text-white">
                          {locale === "ja" ? teaser.title_ja : teaser.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed line-clamp-1">
                        {locale === "ja" ? teaser.desc_ja : teaser.desc}
                      </p>
                    </div>
                    <Lock className="size-4 text-white/30 shrink-0" />
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Right Column: B2B Form & Portal Info */}
        <div className="space-y-8">
          
          {/* B2B Matchmaking Desk Form */}
          <section id="b2b-desk">
            <MatchRequestForm locale={locale} />
          </section>

          {/* Additional Portal Quick-links */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {locale === "ja" ? "ポータルクイックナビ" : "Portal Directory"}
            </h3>
            
            <div className="space-y-2 text-xs">
              <a 
                href="#downloads" 
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="size-4 text-jibb-orange" />
                  <span>{locale === "ja" ? "レポート＆文書" : "Reports & Papers"}</span>
                </div>
                <ChevronRight className="size-3.5 text-white/30" />
              </a>

              <Link 
                href="/membership" 
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="size-4 text-jibb-orange" />
                  <span>{locale === "ja" ? "会員プラン比較" : "Upgrade Plan"}</span>
                </div>
                <ChevronRight className="size-3.5 text-white/30" />
              </Link>

              <Link
                href="/events"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="size-4 text-jibb-orange" />
                  <span>{locale === "ja" ? "二国間イベント" : "Upcoming Delegations"}</span>
                </div>
                <ChevronRight className="size-3.5 text-white/30" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
