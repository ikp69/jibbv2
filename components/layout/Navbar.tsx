"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/src/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  ChevronDown,
  LogIn,
  ArrowRight,
  Building2,
  Eye,
  Users,
  Compass,
  Globe,
  Handshake,
  MapPin,
  Landmark,
  DollarSign,
  FlaskConical,
  Microscope,
  BookOpen,
  Lightbulb,
  Trophy,
  GraduationCap,
  Newspaper,
  FileText,
  Camera,
  BookMarked,
  Mail,
  TrendingUp,
  Cpu,
} from "lucide-react";

/* ============================================================
   NAV CONFIG — 6 structured premium navigation categories
   ============================================================ */
type NavItem = {
  labelKey: string;
  href: string;
  align?: "left" | "center" | "right";
  megaMenu?: {
    labelKey: string;
    href: string;
    descKey?: string;
    icon: React.ElementType;
  }[];
};

const navItems: NavItem[] = [
  {
    labelKey: "nav.about",
    href: "/about",
    align: "left",
    megaMenu: [
      { labelKey: "nav.about", href: "/about", descKey: "aboutMenu.whoWeAre", icon: Building2 },
      { labelKey: "aboutMenu.vision", href: "/about/vision-mission", descKey: "aboutMenu.visionDesc", icon: Eye },
      { labelKey: "aboutMenu.leadership", href: "/about/leadership", descKey: "aboutMenu.leadershipDesc", icon: Users },
      { labelKey: "aboutMenu.approach", href: "/about/our-approach", descKey: "aboutMenu.approachDesc", icon: Compass },
      { labelKey: "aboutMenu.ecosystem", href: "/about/ecosystem", descKey: "aboutMenu.ecosystemDesc", icon: Globe },
      { labelKey: "aboutMenu.partnerships", href: "/about/global-partnerships", descKey: "aboutMenu.partnershipsDesc", icon: Handshake },
    ],
  },
  {
    labelKey: "nav.services",
    href: "/services",
    align: "center",
    megaMenu: [
      { labelKey: "servicesMenu.marketEntry", href: "/services/market-entry", descKey: "servicesMenu.marketEntryDesc", icon: MapPin },
      { labelKey: "servicesMenu.partnership", href: "/services/partnership-facilitation", descKey: "servicesMenu.partnershipDesc", icon: Handshake },
      { labelKey: "servicesMenu.localization", href: "/services/localization-support", descKey: "servicesMenu.localizationDesc", icon: Globe },
      { labelKey: "servicesMenu.investment", href: "/services/investment-support", descKey: "servicesMenu.investmentDesc", icon: DollarSign },
      { labelKey: "servicesMenu.jointVentures", href: "/services/joint-ventures", descKey: "servicesMenu.jointVenturesDesc", icon: Landmark },
      { labelKey: "servicesMenu.consulting", href: "/services/innovation-consulting", descKey: "servicesMenu.consultingDesc", icon: Lightbulb },
      { labelKey: "servicesMenu.research", href: "/services/research-insights", descKey: "servicesMenu.researchDesc", icon: TrendingUp },
    ],
  },
  {
    labelKey: "nav.innovationHub",
    href: "/innovation-hub",
    align: "center",
    megaMenu: [
      { labelKey: "hubMenu.coe", href: "/innovation-hub/center-of-excellence", descKey: "hubMenu.coeDesc", icon: Trophy },
      { labelKey: "hubMenu.labs", href: "/innovation-hub/laboratories", descKey: "hubMenu.labsDesc", icon: FlaskConical },
      { labelKey: "hubMenu.incubation", href: "/innovation-hub/startup-incubation", descKey: "hubMenu.incubationDesc", icon: Lightbulb },
      { labelKey: "hubMenu.research", href: "/innovation-hub/research-programs", descKey: "hubMenu.researchDesc", icon: Microscope },
      { labelKey: "hubMenu.partners", href: "/innovation-hub/partner-institutions", descKey: "hubMenu.partnersDesc", icon: GraduationCap },
      { labelKey: "hubMenu.challenges", href: "/innovation-hub/innovation-challenges", descKey: "hubMenu.challengesDesc", icon: BookOpen },
    ],
  },
  {
    labelKey: "nav.ecosystem",
    href: "/membership",
    align: "center",
    megaMenu: [
      { labelKey: "nav.sectors", href: "/sectors", descKey: "sectorsMenu.desc", icon: Cpu },
      { labelKey: "nav.membership", href: "/membership", descKey: "membershipMenu.desc", icon: Users },
      { labelKey: "nav.events", href: "/events", descKey: "eventsMenu.desc", icon: GraduationCap },
    ],
  },
  {
    labelKey: "nav.resources",
    href: "/resources",
    align: "right",
    megaMenu: [
      { labelKey: "resourcesMenu.insights", href: "/resources/insights", descKey: "resourcesMenu.insightsDesc", icon: TrendingUp },
      { labelKey: "resourcesMenu.reports", href: "/resources/reports", descKey: "resourcesMenu.reportsDesc", icon: FileText },
      { labelKey: "resourcesMenu.blog", href: "/resources/blog", descKey: "resourcesMenu.blogDesc", icon: Newspaper },
      { labelKey: "nav.careers", href: "/careers", descKey: "careersMenu.desc", icon: Users },
      { labelKey: "resourcesMenu.caseStudies", href: "/resources/case-studies", descKey: "resourcesMenu.caseStudiesDesc", icon: BookMarked },
      { labelKey: "resourcesMenu.newsletter", href: "/resources/newsletter", descKey: "resourcesMenu.newsletterDesc", icon: Mail },
    ],
  },
  { labelKey: "nav.contact", href: "/contact" },
];

/* ============================================================
   MEGA MENU DROPDOWN — Stripe/Linear layout alignment
   ============================================================ */
function MegaMenu({
  items,
  align = "center",
  onClose,
}: {
  items: NonNullable<NavItem["megaMenu"]>;
  align?: "left" | "center" | "right";
  onClose: () => void;
}) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "absolute top-full pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200",
        align === "left" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "right" && "right-0"
      )}
      onMouseLeave={onClose}
    >
      <div className="bg-card rounded-2xl border border-border shadow-jibb-lg p-2.5 min-w-[480px] grid grid-cols-2 gap-1 backdrop-blur-md">
        {items.map((item) => {
          const Icon = item.icon;
          let label: string;
          try {
            label = t(item.labelKey);
          } catch {
            label = item.labelKey.split(".").pop() || item.labelKey;
          }
          let desc: string | undefined;
          if (item.descKey) {
            try {
              desc = t(item.descKey);
            } catch {
              desc = undefined;
            }
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors group"
            >
              <div className="mt-0.5 p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                <Icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {label}
                </div>
                {desc && (
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {desc}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   MOBILE DRAWER — Radical accordion mechanics
   ============================================================ */
function MobileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Close drawer on route change
  useEffect(() => {
    onClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleHeaderClick(item: NavItem) {
    if (item.megaMenu) {
      setExpandedItem(expandedItem === item.labelKey ? null : item.labelKey);
    } else {
      onClose();
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100 animate-in fade-in" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[300px] max-w-[80vw] bg-card z-50 shadow-jibb-xl transition-transform duration-300 ease-out lg:hidden",
          "flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none invisible"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Image src="/logo.webp" alt="JIBB Logo" width={80} height={32} className="w-auto h-7 object-contain" style={{ width: "auto" }} />
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-foreground/75 hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav Links Container */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 select-none">
          {navItems.map((item) => {
            let label: string;
            try {
              label = t(item.labelKey);
            } catch {
              label = item.labelKey.split(".").pop() || item.labelKey;
            }
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const isExpanded = expandedItem === item.labelKey;

            return (
              <div key={item.labelKey} className="border-b border-border/40 last:border-b-0 pb-1 pt-1">
                {item.megaMenu ? (
                  /* Accordion Header */
                  <button
                    onClick={() => handleHeaderClick(item)}
                    className={cn(
                      "w-full flex items-center justify-between py-3 px-3 rounded-lg text-sm font-semibold text-left transition-colors",
                      isExpanded
                        ? "bg-primary/5 text-primary"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <span>{label}</span>
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform duration-200 text-muted-foreground",
                        isExpanded && "rotate-180 text-primary"
                      )}
                    />
                  </button>
                ) : (
                  /* Standard Link */
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center py-3 px-3 rounded-lg text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {label}
                  </Link>
                )}

                {/* Submenu Accordion Items */}
                {item.megaMenu && isExpanded && (
                  <div className="ml-3 mt-1 pl-3 border-l border-border space-y-1 animate-in slide-in-from-top-2 duration-200">
                    
                    {/* Add Overview link as first item */}
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-primary hover:bg-primary/5 transition-colors"
                    >
                      <Building2 className="size-3.5" />
                      <span>{label} Overview</span>
                    </Link>

                    {item.megaMenu.map((sub) => {
                      const Icon = sub.icon;
                      let subLabel: string;
                      try {
                        subLabel = t(sub.labelKey);
                      } catch {
                        subLabel = sub.labelKey.split(".").pop() || sub.labelKey;
                      }
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={onClose}
                          className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Icon className="size-3.5 shrink-0" />
                          <span>{subLabel}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border space-y-3 bg-muted/30">
          <LanguageSwitcher className="w-full" triggerClassName="w-full justify-center bg-card border border-border" />
          <Link href="/auth/login" onClick={onClose} className="block">
            <Button variant="outline" className="w-full justify-center gap-2 font-semibold">
              <LogIn className="size-4" />
              {t("nav.memberLogin")}
            </Button>
          </Link>
          <Link href="/membership" onClick={onClose} className="block">
            <Button variant="accent" className="w-full justify-center gap-2 font-semibold">
              {t("nav.joinJibb")}
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   NAVBAR — Premium responsive nav
   ============================================================ */
export function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll listener for sticky solid background transitions
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHomePage = pathname === "/";

  function handleMenuEnter(key: string) {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(key);
  }

  function handleMenuLeave() {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  }

  // Handle touch events on hybrid devices
  function handleMenuClick(e: React.MouseEvent, item: NavItem) {
    if (item.megaMenu) {
      e.preventDefault();
      setActiveMenu(activeMenu === item.labelKey ? null : item.labelKey);
    }
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          "navbar-solid"
        )}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 lg:h-18">
            
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 select-none">
              <Image 
                src="/logo.webp" 
                alt="JIBB Logo" 
                width={100} 
                height={40} 
                className="w-auto h-8 lg:h-10 object-contain transition-transform duration-200 hover:scale-105" 
                style={{ width: "auto" }}
                priority
              />
            </Link>

            {/* Desktop Navigation (Span 6 clean links) */}
            <nav className="hidden lg:flex items-center gap-1 select-none">
              {navItems.map((item) => {
                let label: string;
                try {
                  label = t(item.labelKey);
                } catch {
                  label = item.labelKey.split(".").pop() || item.labelKey;
                }
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <div
                    key={item.labelKey}
                    className="relative"
                    onMouseEnter={() => item.megaMenu && handleMenuEnter(item.labelKey)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleMenuClick(e, item)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                        isActive
                          ? "text-primary bg-primary/8"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <span>{label}</span>
                      {item.megaMenu && (
                        <ChevronDown
                          className={cn(
                            "size-3.5 transition-transform duration-200 text-muted-foreground/60",
                            activeMenu === item.labelKey && "rotate-180 text-primary"
                          )}
                        />
                      )}
                    </Link>

                    {/* Mega Menu container with responsive alignments */}
                    {item.megaMenu && activeMenu === item.labelKey && (
                      <MegaMenu
                        items={item.megaMenu}
                        align={item.align}
                        onClose={() => setActiveMenu(null)}
                      />
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Language Selector (Desktop) */}
              <div className="hidden lg:block">
                <LanguageSwitcher
                  triggerClassName={cn(
                    "text-foreground hover:bg-muted"
                  )}
                />
              </div>

              {/* Login Button (Desktop) */}
              <Link href="/auth/login" className="hidden lg:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 font-semibold"
                >
                  <LogIn className="size-3.5" />
                  {t("nav.memberLogin")}
                </Button>
              </Link>

              {/* Join CTA (Desktop) */}
              <Link href="/membership" className="hidden lg:block">
                <Button variant="accent" size="sm" className="gap-1.5 font-bold shadow-sm">
                  {t("nav.joinJibb")}
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>

              {/* Mobile Menu Open Toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className={cn(
                  "lg:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-muted/50",
                  "text-foreground"
                )}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            </div>
            
          </div>
        </div>
      </header>

      {/* Mobile Sidebar overlay */}
      <MobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Dynamic Spacer: Rendered only on non-homepage screens to maintain layout overrides */}
      {!isHomePage && <div className="h-16 lg:h-18" />}
    </>
  );
}
