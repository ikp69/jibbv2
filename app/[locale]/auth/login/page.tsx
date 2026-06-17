import { setRequestLocale } from "next-intl/server";
import { LoginForm } from "./LoginForm";
import { Link } from "@/src/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-4 overflow-hidden bg-[#0F1629]">
      {/* Cinematic Glowing Background Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-glow-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] -z-10 animate-float" />
      
      {/* Back to Home Button */}
      <div className="absolute top-8 left-4 md:left-8 z-20">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <ArrowLeft className="size-3.5" />
          {locale === "ja" ? "ホームに戻る" : "Back to Home"}
        </Link>
      </div>

      {/* Form Container */}
      <div className="w-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <LoginForm />
      </div>
    </main>
  );
}
