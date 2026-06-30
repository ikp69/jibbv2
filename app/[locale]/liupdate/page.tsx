"use client";

import { useState, useEffect } from "react";
import { addLinkedInPost, deleteLinkedInPost, verifyAdminPasscode } from "@/app/actions/linkedin";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Shield, Send, CheckCircle, AlertCircle, RefreshCw, Trash2, Calendar, Eye, EyeOff, Globe, Lock, Unlock } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";

export default function LinkedInUpdatePage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authFormSecret, setAuthFormSecret] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [form, setForm] = useState({ urn: "" });
  const [posts, setPosts] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"live" | "past">("live");
  const [previewId, setPreviewId] = useState<string | null>(null);

  // Fetch posts from Supabase
  const fetchPosts = async () => {
    try {
      const supabase = createClient();
      const { data, error: dbError } = await supabase
        .from("linkedin_posts")
        .select("id, share_urn, created_at")
        .order("created_at", { ascending: false });

      if (data && !dbError) {
        setPosts(data);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };

    const storedPasscode = getCookie("jibb_admin_passcode") || sessionStorage.getItem("jibb_admin_passcode");
    if (storedPasscode) {
      setPasscode(storedPasscode);
      setIsAuthorized(true);
    }
    fetchPosts();
  }, []);

  const handleVerifyPasscode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authFormSecret.trim()) {
      setAuthError("Passcode is required.");
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    try {
      const result = await verifyAdminPasscode(authFormSecret.trim());
      if (result.success) {
        setPasscode(authFormSecret.trim());
        setIsAuthorized(true);
        sessionStorage.setItem("jibb_admin_passcode", authFormSecret.trim());
        document.cookie = `jibb_admin_passcode=${authFormSecret.trim()}; path=/; max-age=2592000; SameSite=Lax`;
      } else {
        setAuthError(result.error || "Invalid passcode.");
      }
    } catch (err) {
      console.error(err);
      setAuthError("Failed to authenticate with server.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("jibb_admin_passcode");
    document.cookie = "jibb_admin_passcode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    setPasscode("");
    setAuthFormSecret("");
    setIsAuthorized(false);
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.urn) {
      setError("Please paste a LinkedIn post link, embed code, or URN.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await addLinkedInPost(form.urn, passcode);
      if (result.success) {
        setSuccess(true);
        setForm({ urn: "" }); // Clear URN
        await fetchPosts(); // Refresh list
      } else {
        setError(result.error || "Failed to add post. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Verify database availability and credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post from the feed?")) {
      return;
    }

    try {
      const result = await deleteLinkedInPost(id, passcode);
      if (result.success) {
        setSuccess(true);
        setError(null);
        await fetchPosts();
      } else {
        setError(result.error || "Failed to delete post.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while attempting to delete the post.");
    }
  };

  // Divide URNs into Live (first 4) and Past (rest)
  const livePosts = posts.slice(0, 4);
  const pastPosts = posts.slice(4);

  // Authentication Gate Screen
  if (!isAuthorized) {
    return (
      <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300 min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-jibb-orange/10 flex items-center justify-center text-jibb-orange">
              <Lock className="size-6 animate-pulse" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
              Passcode Required
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Please enter your JIBB operations passcode to access the LinkedIn update feed portal.
            </p>
          </div>

          <div className="bg-card py-8 px-6 border border-border/80 shadow-jibb-lg rounded-3xl">
            <form className="space-y-6" onSubmit={handleVerifyPasscode}>
              {authError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
                  <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-500" />
                  <div>
                    <p className="font-semibold text-xs">{authError}</p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="passcode" className="block text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2">
                  Security Passcode
                </label>
                <div className="mt-1">
                  <Input
                    id="passcode"
                    name="passcode"
                    type="password"
                    autoComplete="current-password"
                    value={authFormSecret}
                    onChange={(e) => setAuthFormSecret(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="focus-visible:ring-jibb-orange rounded-xl h-11 text-sm text-center tracking-widest"
                  />
                </div>
              </div>

              <div>
                <AnimatedButton
                  type="submit"
                  disabled={isVerifying}
                  className="w-full h-11 bg-jibb-orange text-white font-bold rounded-xl shadow-lg text-sm flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" />
                      Authorizing...
                    </>
                  ) : (
                    <>
                      <Unlock className="size-4" />
                      Unlock Portal
                    </>
                  )}
                </AnimatedButton>
              </div>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // Dashboard Page Content (Once Authorized)
  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      <PageHero className="py-20 lg:py-24" bgText="OPERATIONS">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Shield className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              Operations Portal Active
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            LinkedIn Feed Sync
          </h1>

          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Instantly synchronize and cache public LinkedIn updates. Paste embed codes, view live/past feeds, and manage active slots.
          </p>

          <div className="flex justify-center gap-3 pt-4">
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-jibb-orange">
              ON-DEMAND REVALIDATION
            </span>
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
          </div>
        </div>
      </PageHero>

      <section className="py-12 bg-jibb-gradient-subtle section-container max-w-5xl">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-border/80 text-xs font-bold hover:bg-muted/80 rounded-xl transition-all inline-flex items-center gap-2 shadow-sm"
          >
            <Lock className="size-3.5 text-jibb-orange" />
            <span>Lock Session</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Form (Col Span 5) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-6 sm:p-8 bg-card border border-border/80 shadow-jibb-lg overflow-hidden text-left">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Add LinkedIn Post
              </h3>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                Paste the LinkedIn URL, iframe embed code, or URN here. The system will automatically extract and configure the post URN.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-500" />
                    <div>
                      <p className="font-semibold">Update Rejected</p>
                      <p className="text-xs opacity-90 mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle className="size-5 shrink-0 mt-0.5 text-emerald-500" />
                    <div>
                      <p className="font-semibold">Feed Sync Successful</p>
                      <p className="text-xs opacity-90 mt-0.5">The URN has been synchronized and homepage static layout is re-compiled.</p>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider block">
                    Post Embed / URL / URN
                  </label>
                  <textarea
                    name="urn"
                    value={form.urn}
                    onChange={(e) => setForm(prev => ({ ...prev, urn: e.target.value }))}
                    placeholder="Paste embed code (<iframe...>), post URL, or raw URN"
                    className="flex min-h-[120px] w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jibb-orange focus-visible:ring-offset-2"
                    required
                  />
                </div>

                <div className="pt-2">
                  <AnimatedButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 bg-jibb-orange text-white font-bold rounded-xl shadow-lg text-sm flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="size-4 animate-spin" />
                        Syncing feed...
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Sync to Feed
                      </>
                    )}
                  </AnimatedButton>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: List of Live & Past URNs (Col Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl p-6 bg-card border border-border/80 shadow-jibb-lg text-left">
              {/* Tab selector */}
              <div className="flex border-b border-border/40 pb-px mb-6">
                <button
                  onClick={() => setActiveTab("live")}
                  className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-colors duration-300 border-b-2 text-center ${activeTab === "live"
                    ? "border-jibb-orange text-primary dark:text-[#7b9fe0]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Live Feed ({livePosts.length}/4)
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-colors duration-300 border-b-2 text-center ${activeTab === "past"
                    ? "border-jibb-orange text-primary dark:text-[#7b9fe0]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Past Archives ({pastPosts.length})
                </button>
              </div>

              {/* Feed lists */}
              <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1 sleek-scrollbar">
                {(activeTab === "live" ? livePosts : pastPosts).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Globe className="size-8 mx-auto opacity-30 mb-2" />
                    <p className="text-sm font-medium">No posts available in this tab.</p>
                  </div>
                ) : (
                  (activeTab === "live" ? livePosts : pastPosts).map((post) => {
                    const isPreviewing = previewId === post.id;
                    const dateAdded = new Date(post.created_at).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });

                    return (
                      <div
                        key={post.id}
                        className="p-4 rounded-2xl bg-muted/30 border border-border/40 hover:border-primary/20 hover:bg-muted/40 transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-bold">
                              URN: {post.share_urn}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <Calendar className="size-3.5" />
                              <span>Added {dateAdded}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Preview trigger */}
                            <button
                              onClick={() => setPreviewId(isPreviewing ? null : post.id)}
                              className="p-2 hover:bg-muted dark:hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                              title="Toggle Preview"
                            >
                              {isPreviewing ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>

                            {/* Delete trigger */}
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-red-500/80 hover:text-red-500 transition-colors"
                              title="Delete Post"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Embed Iframe Preview */}
                        {isPreviewing && (
                          <div className="border border-border/40 rounded-xl overflow-hidden bg-background h-[360px] animate-in fade-in slide-in-from-top-2 duration-300">
                            <iframe
                              src={`https://www.linkedin.com/embed/feed/update/${post.share_urn}?collapsed=1`}
                              height="100%"
                              width="100%"
                              style={{ border: "none" }}
                              allowFullScreen
                              title="Preview post"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
