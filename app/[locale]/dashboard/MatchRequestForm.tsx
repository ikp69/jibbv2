"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { submitMatchmakingRequest } from "@/app/actions/matchmaking";

export function MatchRequestForm({ locale }: { locale: string }) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [sector, setSector] = useState("manufacturing");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !details.trim()) {
      setError(locale === "ja" ? "すべてのフィールドを入力してください。" : "Please fill in all fields.");
      return;
    }

    if (title.trim().length < 5) {
      setError(locale === "ja" ? "タイトルは5文字以上で入力してください。" : "Title must be at least 5 characters long.");
      return;
    }

    if (details.trim().length < 15) {
      setError(locale === "ja" ? "詳細は15文字以上で入力してください。" : "Details must be at least 15 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await submitMatchmakingRequest({
        title: title.trim(),
        details: details.trim(),
        targetSector: sector,
      });

      if (!result.success) {
        setError(result.error || (locale === "ja" ? "エラーが発生しました。" : "Something went wrong"));
      } else {
        setSuccess(true);
        setTitle("");
        setDetails("");
      }
    } catch (err: any) {
      setError(err.message || (locale === "ja" ? "エラーが発生しました。" : "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8 space-y-3"
        >
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle className="size-6 animate-bounce" />
          </div>
          <h4 className="text-base font-bold">
            {locale === "ja" ? "リクエストが送信されました！" : "Request Submitted!"}
          </h4>
          <p className="text-xs text-white/60 max-w-xs mx-auto">
            {locale === "ja" 
              ? "JIBBのアドバイザーが内容を確認し、マッチング可能な企業をご案内いたします。" 
              : "Our JIBB advisors will review your details and match you with potential partners shortly."}
          </p>
          <AnimatedButton
            variant="outline"
            size="sm"
            onClick={() => setSuccess(false)}
            className="mt-4 border-white/10 hover:bg-white/5 text-xs text-white"
          >
            {locale === "ja" ? "新しい案件を登録する" : "Submit Another Request"}
          </AnimatedButton>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-jibb-orange">
            {locale === "ja" ? "B2B コラボレーション窓口" : "B2B Collaboration Desk"}
          </h3>
          <p className="text-xs text-white/60">
            {locale === "ja"
              ? "探している提携先（製造委託、共同研究開発、販売代理店など）の条件を入力してください。"
              : "Specify what partnership matching you are seeking (manufacturing, co-innovation, distribution channels, etc.)."}
          </p>

          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/10 text-red-400 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
              {locale === "ja" ? "案件タイトル" : "Inquiry Title"}
            </label>
            <Input
              type="text"
              placeholder={locale === "ja" ? "例：日本におけるSaaS販売パートナーの開拓" : "e.g. Seeking CNC Machining Partner in Gujarat"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 bg-white/5 border-white/10 text-xs text-white placeholder:text-white/30 focus:border-jibb-orange focus:ring-jibb-orange/20"
            />
          </div>

          {/* Sector Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
              {locale === "ja" ? "対象セクター" : "Target Sector"}
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-jibb-orange/20 focus:border-jibb-orange transition-all duration-200"
            >
              <option value="manufacturing" className="bg-neutral-900 text-white">
                {locale === "ja" ? "先進製造業" : "Advanced Manufacturing"}
              </option>
              <option value="semiconductors" className="bg-neutral-900 text-white">
                {locale === "ja" ? "半導体" : "Semiconductors"}
              </option>
              <option value="automotive" className="bg-neutral-900 text-white">
                {locale === "ja" ? "自動車部品" : "Automotive Components"}
              </option>
              <option value="it_tech" className="bg-neutral-900 text-white">
                {locale === "ja" ? "IT & ソフトウェア" : "IT & Software"}
              </option>
              <option value="renewable_energy" className="bg-neutral-900 text-white">
                {locale === "ja" ? "再生可能エネルギー" : "Renewable Energy"}
              </option>
            </select>
          </div>

          {/* Details */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
              {locale === "ja" ? "具体的な要件 / 条件" : "Details & Target Profile"}
            </label>
            <Textarea
              placeholder={locale === "ja" ? "提携の目的や求める企業の規模・技術力などを記述してください。" : "Describe target partner capabilities, project scope, and timelines."}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[90px] bg-white/5 border-white/10 text-xs text-white placeholder:text-white/30 focus:border-jibb-orange focus:ring-jibb-orange/20"
            />
          </div>

          {/* Submit */}
          <AnimatedButton
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-jibb-orange hover:bg-jibb-orange/90 text-white font-bold rounded-xl shadow-md border-none flex items-center justify-center gap-2 text-xs shrink-0"
          >
            {isLoading ? "..." : (
              <>
                <Send className="size-3.5" />
                {locale === "ja" ? "案件を登録する" : "Submit Inquiry"}
              </>
            )}
          </AnimatedButton>
        </form>
      )}
    </div>
  );
}
