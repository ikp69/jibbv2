"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Building, Briefcase, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  // Supabase client is created lazily inside handlers so it never runs during SSR/prerender
  // (avoids build failures when env vars are absent at build time)

  // Authentication Mode: 'login' | 'register'
  const [mode, setMode] = useState<"login" | "register">("login");

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [designation, setDesignation] = useState("");
  const [membershipTier, setMembershipTier] = useState("associate");

  // UX States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Field errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!email.trim()) {
      errs.email = t("emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = t("invalidEmail");
    }

    if (!password || password.length < 6) {
      errs.password = t("passwordRequired");
    }

    // Register-mode: validate required profile fields
    if (mode === "register") {
      if (!fullName.trim()) {
        errs.fullName = "Full name is required";
      }
      if (password && password.length < 8) {
        errs.password = "Password must be at least 8 characters";
      }
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      const supabase = createClient();

      if (mode === "login") {
        // Sign In Flow
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        } else {
          // Refresh and redirect to dashboard
          router.refresh();
          router.push("/dashboard");
        }
      } else {
        // Register (Sign Up) Flow
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim() || "JIBB Member",
              company_name: companyName.trim(),
              designation: designation.trim(),
              membership_tier: membershipTier,
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
        } else {
          // Check if session was automatically started or confirmation is pending
          if (data.session) {
            router.refresh();
            router.push("/dashboard");
          } else {
            setSuccessMsg(t("registerSuccess"));
            // Reset form
            setEmail("");
            setPassword("");
            setFullName("");
            setCompanyName("");
            setDesignation("");
            setMembershipTier("associate");
          }
        }
      }
    } catch (err) {
      setError(t("errorGeneric"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Background glow effects */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-jibb-orange/30 to-blue-600/30 blur-2xl opacity-75 -z-10 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

      <Card className="border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden text-white">
        <CardHeader className="space-y-3 p-8 text-center border-b border-white/5">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
            <ShieldCheck className="size-6 text-jibb-orange animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-white/70 text-xs leading-relaxed max-w-sm mx-auto">
            {t("subtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Supabase Missing Configuration Warning */}
          {!(
            process.env.NEXT_PUBLIC_SUPABASE_URL && 
            process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-url.supabase.co" &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "placeholder-anon-key"
          ) && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">🔧 Supabase Setup Required</p>
                <p className="opacity-90 mt-0.5 leading-relaxed">
                  Authentication keys are missing. Please add your credentials to the <code>.env.local</code> file in <code>my-app/</code> to enable logins.
                </p>
              </div>
            </motion.div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccessMsg(null);
                setFieldErrors({});
              }}
              className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                mode === "login" ? "bg-white/10 text-jibb-orange shadow-md" : "text-white/60 hover:text-white"
              }`}
            >
              {t("signIn")}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
                setSuccessMsg(null);
                setFieldErrors({});
              }}
              className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                mode === "register" ? "bg-white/10 text-jibb-orange shadow-md" : "text-white/60 hover:text-white"
              }`}
            >
              {t("signUp")}
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{t("errorTitle")}</p>
                <p className="opacity-90 mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs"
            >
              <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Verification Pending</p>
                <p className="opacity-90 mt-0.5">{successMsg}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <AnimatePresence mode="popLayout">
              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                      {t("fullName")} <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (fieldErrors.fullName) setFieldErrors(prev => { const c = { ...prev }; delete c.fullName; return c; });
                        }}
                        className={`pl-10 h-11 bg-white/5 border-white/10 text-white focus:border-jibb-orange focus:ring-jibb-orange/20 ${
                          fieldErrors.fullName ? "border-red-500 focus:ring-red-500/20" : ""
                        }`}
                      />
                    </div>
                    {fieldErrors.fullName && <span className="text-[10px] text-red-400 font-medium">{fieldErrors.fullName}</span>}
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                      {t("companyName")}
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                      <Input
                        type="text"
                        placeholder="Acme Japan Corp"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="pl-10 h-11 bg-white/5 border-white/10 text-white focus:border-jibb-orange focus:ring-jibb-orange/20"
                      />
                    </div>
                  </div>

                  {/* Designation */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                      {t("designation")}
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                      <Input
                        type="text"
                        placeholder="VP of Manufacturing"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="pl-10 h-11 bg-white/5 border-white/10 text-white focus:border-jibb-orange focus:ring-jibb-orange/20"
                      />
                    </div>
                  </div>

                  {/* Membership Tier Select */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                      {t("membershipTier")}
                    </label>
                    <div className="relative">
                      <select
                        value={membershipTier}
                        onChange={(e) => setMembershipTier(e.target.value)}
                        className="flex h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-jibb-orange/20 focus:border-jibb-orange transition-all duration-200"
                      >
                        <option value="associate" className="bg-neutral-900 text-white">{t("associate")}</option>
                        <option value="silver" className="bg-neutral-900 text-white">{t("silver")}</option>
                        <option value="gold" className="bg-neutral-900 text-white">{t("gold")}</option>
                        <option value="platinum" className="bg-neutral-900 text-white">{t("platinum")}</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                {t("email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => { const c = { ...prev }; delete c.email; return c; });
                  }}
                  className={`pl-10 h-11 bg-white/5 text-white border-white/10 focus:border-jibb-orange focus:ring-jibb-orange/20 ${
                    fieldErrors.email ? "border-red-500 focus:ring-red-500/20" : ""
                  }`}
                />
              </div>
              {fieldErrors.email && <span className="text-[10px] text-red-400 font-medium">{fieldErrors.email}</span>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                {t("password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors(prev => { const c = { ...prev }; delete c.password; return c; });
                  }}
                  className={`pl-10 pr-10 h-11 bg-white/5 text-white border-white/10 focus:border-jibb-orange focus:ring-jibb-orange/20 ${
                    fieldErrors.password ? "border-red-500 focus:ring-red-500/20" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {fieldErrors.password && <span className="text-[10px] text-red-400 font-medium">{fieldErrors.password}</span>}
            </div>

            {/* Submit Button */}
            <AnimatedButton
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-jibb-orange hover:bg-jibb-orange/90 text-white font-bold rounded-xl shadow-md border-none flex items-center justify-center gap-2 mt-4 select-none shrink-0"
              wrapperClassName="w-full mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {mode === "login" ? t("signingIn") : t("signingUp")}
                </>
              ) : (
                <>
                  <Sparkles className="size-4 text-white fill-white/10" />
                  {mode === "login" ? t("signIn") : t("signUp")}
                </>
              )}
            </AnimatedButton>
          </form>
        </CardContent>

        <CardFooter className="p-8 pt-0 text-center border-t border-white/5 bg-white/[0.02]">
          <p className="text-white/60 text-xs w-full">
            {mode === "login" ? (
              <>
                {t("noAccount")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                    setSuccessMsg(null);
                    setFieldErrors({});
                  }}
                  className="text-jibb-orange font-bold hover:underline"
                >
                  {t("signUp")}
                </button>
              </>
            ) : (
              <>
                {t("haveAccount")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setSuccessMsg(null);
                    setFieldErrors({});
                  }}
                  className="text-jibb-orange font-bold hover:underline"
                >
                  {t("signIn")}
                </button>
              </>
            )}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
