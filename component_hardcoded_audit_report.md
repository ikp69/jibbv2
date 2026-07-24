# Executive Component Audit Summary

- **Total Component & Page Files Audited**: `110`
- **Files Requiring i18n Fixes**: `28`
- **Files 100% i18n Compliant**: `82`
- **Total Hardcoded Text Instances**: `118`

---

# Comprehensive Component-by-Component Hardcoded Text Audit Report

This report audits every UI component and page file across the repository to verify if hardcoded English text exists instead of using `useTranslations()`.

---

## File: [`app\[locale]\about\page.tsx`](file:///D:/Projects/jibbv2/app/[locale]/about/page.tsx)
- **i18n Enabled (`useTranslations`)**: `No`
- **Hardcoded English Instances Found**: `1`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L467 | JSX Text | `Framework` |

---

## File: [`app\[locale]\admin\liupdate\page.tsx`](file:///D:/Projects/jibbv2/app/[locale]/admin/liupdate/page.tsx)
- **i18n Enabled (`useTranslations`)**: `No`
- **Hardcoded English Instances Found**: `8`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L261 | JSX Text | `Lock Session` |
| L282 | JSX Text | `Update Rejected` |
| L292 | JSX Text | `Feed Sync Successful` |
| L293 | JSX Text | `The URN has been synchronized and homepage static layout is re-compiled.` |
| L365 | JSX Text | `No posts available in this tab.` |
| L400 | Prop (title) | `Toggle Preview` |
| L409 | Prop (title) | `Delete Post` |
| L425 | Prop (title) | `Preview post` |

---

## File: [`app\[locale]\careers\page.tsx`](file:///D:/Projects/jibbv2/app/[locale]/careers/page.tsx)
- **i18n Enabled (`useTranslations`)**: `Yes`
- **Hardcoded English Instances Found**: `6`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L386 | JSX Text | `Quick Info` |
| L630 | JSX Text | `Submission Error` |
| L639 | JSX Text | `Leave this field blank` |
| L672 | JSX Text | `Position applied for` |
| L680 | JSX Text | `Bilateral Business Consultant` |
| L682 | JSX Text | `Business Development Executive` |

---

## File: [`app\[locale]\contact\page.tsx`](file:///D:/Projects/jibbv2/app/[locale]/contact/page.tsx)
- **i18n Enabled (`useTranslations`)**: `Yes`
- **Hardcoded English Instances Found**: `2`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L261 | JSX Text | `Submission Error` |
| L270 | JSX Text | `Leave this field blank` |

---

## File: [`app\[locale]\dashboard\layout.tsx`](file:///D:/Projects/jibbv2/app/[locale]/dashboard/layout.tsx)
- **i18n Enabled (`useTranslations`)**: `No`
- **Hardcoded English Instances Found**: `2`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L62 | JSX Text | `JIBB Portal` |
| L63 | JSX Text | `MEMBER CONSOLE` |

---

## File: [`app\[locale]\events\page.tsx`](file:///D:/Projects/jibbv2/app/[locale]/events/page.tsx)
- **i18n Enabled (`useTranslations`)**: `No`
- **Hardcoded English Instances Found**: `5`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L762 | Prop (label) | `Previous gallery` |
| L768 | Prop (label) | `Next gallery` |
| L872 | Prop (label) | `Close Lightbox` |
| L883 | Prop (label) | `Previous image` |
| L915 | Prop (label) | `Next image` |

---

## File: [`app\[locale]\innovation-hub\page.tsx`](file:///D:/Projects/jibbv2/app/[locale]/innovation-hub/page.tsx)
- **i18n Enabled (`useTranslations`)**: `No`
- **Hardcoded English Instances Found**: `22`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L350 | JSX Text | `CoE Core Metrics` |
| L354 | JSX Text | `Bilateral Compliant Specs` |
| L376 | JSX Text | `Industrial Standard` |
| L394 | JSX Text | `Incubator` |
| L401 | JSX Text | `Startups Incubated` |
| L405 | JSX Text | `VC Dealflow` |
| L448 | JSX Text | `Incubation Benefit` |
| L478 | JSX Text | `Lab Diagnostics` |
| L481 | JSX Text | `Environmental Climate Chambers` |
| L482 | JSX Text | `Class 1000 Cleanroom` |
| L483 | JSX Text | `Spectrometer Analytics` |
| L504 | JSX Text | `Certified Environment` |
| L534 | JSX Text | `Alliance Specs` |
| L536 | JSX Text | `Tier 1 Academic Hubs` |
| L537 | JSX Text | `Sovereign Credit Agencies` |
| L538 | JSX Text | `Bilateral Ministry Board` |
| L560 | JSX Text | `Official Affiliate` |
| L590 | JSX Text | `Challenge Specs` |
| L592 | JSX Text | `Tech Problem Hackathons` |
| L593 | JSX Text | `Corporate Sponsored` |
| L595 | JSX Text | `Lab Credits Included` |
| L604 | JSX Text | `Winner Benefits` |

---

## File: [`app\[locale]\membership\page.tsx`](file:///D:/Projects/jibbv2/app/[locale]/membership/page.tsx)
- **i18n Enabled (`useTranslations`)**: `Yes`
- **Hardcoded English Instances Found**: `19`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L277 | JSX Text | `Inquire Plan` |
| L316 | JSX Text | `Inquire Plan` |
| L359 | JSX Text | `Apply Gold` |
| L398 | JSX Text | `Partner Inquiry` |
| L422 | JSX Text | `Scheduler` |
| L501 | Prop (title) | `Schedule a consultation meeting` |
| L510 | JSX Text | `Consultation Scheduler is not configured yet.` |
| L526 | JSX Text | `Leave this field blank` |
| L549 | JSX Text | `Associate Member` |
| L550 | JSX Text | `Silver Member` |
| L551 | JSX Text | `Gold Member` |
| L552 | JSX Text | `Platinum Member` |
| L558 | JSX Text | `Company Name` |
| L573 | JSX Text | `Contact Person Name` |
| L588 | JSX Text | `Corporate Email Address` |
| L603 | JSX Text | `Phone Number` |
| L619 | JSX Text | `Industry` |
| L630 | JSX Text | `Company Size` |
| L659 | JSX Text | `Our membership team will contact you within 24-48 business hours` |

---

## File: [`app\[locale]\page.tsx`](file:///D:/Projects/jibbv2/app/[locale]/page.tsx)
- **i18n Enabled (`useTranslations`)**: `No`
- **Hardcoded English Instances Found**: `1`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L462 | JSX Text | `Explore Innovation Hub` |

---

## File: [`app\[locale]\resources\newsletter\page.tsx`](file:///D:/Projects/jibbv2/app/[locale]/resources/newsletter/page.tsx)
- **i18n Enabled (`useTranslations`)**: `Yes`
- **Hardcoded English Instances Found**: `1`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L244 | JSX Text | `Leave this field blank` |

---

## File: [`app\[locale]\terms\page.tsx`](file:///D:/Projects/jibbv2/app/[locale]/terms/page.tsx)
- **i18n Enabled (`useTranslations`)**: `No`
- **Hardcoded English Instances Found**: `9`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L385 | JSX Text | `General Provisions` |
| L388 | JSX Text | `Severability` |
| L389 | JSX Text | `If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.` |
| L392 | JSX Text | `Entire Agreement` |
| L393 | JSX Text | `These Terms, together with our Privacy Policy and any applicable membership documentation, constitute the entire agreement between you and JIBB.` |
| L396 | JSX Text | `Waiver` |
| L397 | JSX Text | `Failure by JIBB to enforce any right or provision under these Terms shall not be deemed a waiver of that right or provision in the future.` |
| L400 | JSX Text | `Assignment` |
| L401 | JSX Text | `You may not assign your rights or obligations under these Terms without JIBB's prior written consent. JIBB may assign its rights freely in connection with a reorganisation or business transfer.` |

---

## File: [`app\not-found.tsx`](file:///D:/Projects/jibbv2/app/not-found.tsx)
- **i18n Enabled (`useTranslations`)**: `No`
- **Hardcoded English Instances Found**: `1`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L16 | JSX Text | `Redirecting to Portal` |

---

## File: [`components\events\EventCalendar.tsx`](file:///D:/Projects/jibbv2/components/events/EventCalendar.tsx)
- **i18n Enabled (`useTranslations`)**: `No`
- **Hardcoded English Instances Found**: `2`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L154 | Prop (label) | `Previous month` |
| L161 | Prop (label) | `Next month` |

---

## File: [`components\layout\Footer.tsx`](file:///D:/Projects/jibbv2/components/layout/Footer.tsx)
- **i18n Enabled (`useTranslations`)**: `Yes`
- **Hardcoded English Instances Found**: `2`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L162 | Prop (label) | `LinkedIn` |
| L165 | JSX Text | `Follow on LinkedIn` |

---

## File: [`components\layout\LanguageSwitcher.tsx`](file:///D:/Projects/jibbv2/components/layout/LanguageSwitcher.tsx)
- **i18n Enabled (`useTranslations`)**: `No`
- **Hardcoded English Instances Found**: `1`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L51 | Prop (label) | `Toggle language` |

---

## File: [`components\layout\Navbar.tsx`](file:///D:/Projects/jibbv2/components/layout/Navbar.tsx)
- **i18n Enabled (`useTranslations`)**: `Yes`
- **Hardcoded English Instances Found**: `2`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L237 | Prop (label) | `Close menu` |
| L576 | Prop (label) | `Open menu` |

---

## File: [`components\sections\ComingSoonPage.tsx`](file:///D:/Projects/jibbv2/components/sections/ComingSoonPage.tsx)
- **i18n Enabled (`useTranslations`)**: `Yes`
- **Hardcoded English Instances Found**: `3`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L38 | Prop (title) | `Coming Soon` |
| L45 | Prop (subtitle) | `This page is currently being curated.` |
| L372 | JSX Text | `Leave this field blank` |

---

## File: [`components\sections\EventRegisterForm.tsx`](file:///D:/Projects/jibbv2/components/sections/EventRegisterForm.tsx)
- **i18n Enabled (`useTranslations`)**: `Yes`
- **Hardcoded English Instances Found**: `1`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L163 | JSX Text | `Leave this field blank` |

---

## File: [`components\sections\FeatureComparison.tsx`](file:///D:/Projects/jibbv2/components/sections/FeatureComparison.tsx)
- **i18n Enabled (`useTranslations`)**: `No`
- **Hardcoded English Instances Found**: `4`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L177 | JSX Text | `Entry Level` |
| L183 | JSX Text | `Standard Growth` |
| L190 | JSX Text | `Professional Tier` |
| L197 | JSX Text | `Ultimate Access` |

---

## File: [`components\sections\LeadershipCarousel.tsx`](file:///D:/Projects/jibbv2/components/sections/LeadershipCarousel.tsx)
- **i18n Enabled (`useTranslations`)**: `Yes`
- **Hardcoded English Instances Found**: `2`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L78 | Prop (label) | `Previous leadership member` |
| L85 | Prop (label) | `Next leadership member` |

---

## File: [`components\sections\LeadershipGrid.tsx`](file:///D:/Projects/jibbv2/components/sections/LeadershipGrid.tsx)
- **i18n Enabled (`useTranslations`)**: `Yes`
- **Hardcoded English Instances Found**: `1`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L200 | JSX Text | `LinkedIn` |

---

## File: [`components\sections\LinkedInCarousel.tsx`](file:///D:/Projects/jibbv2/components/sections/LinkedInCarousel.tsx)
- **i18n Enabled (`useTranslations`)**: `No`
- **Hardcoded English Instances Found**: `5`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L106 | Prop (label) | `Previous posts` |
| L114 | Prop (label) | `Next posts` |
| L143 | JSX Text | `No Social Updates Active` |
| L144 | JSX Text | `Please sync items in the Admin panel to populate the feed.` |
| L165 | Prop (title) | `LinkedIn post` |

---

## File: [`components\sections\NewsRoom.tsx`](file:///D:/Projects/jibbv2/components/sections/NewsRoom.tsx)
- **i18n Enabled (`useTranslations`)**: `Yes`
- **Hardcoded English Instances Found**: `4`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L244 | Prop (label) | `Previous posts` |
| L252 | Prop (label) | `Next posts` |
| L312 | Prop (title) | `Delete LinkedIn Post` |
| L329 | Prop (title) | `LinkedIn post` |

---

## File: [`components\sections\PastEventsCollage.tsx`](file:///D:/Projects/jibbv2/components/sections/PastEventsCollage.tsx)
- **i18n Enabled (`useTranslations`)**: `No`
- **Hardcoded English Instances Found**: `5`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L250 | Prop (label) | `Previous gallery` |
| L256 | Prop (label) | `Next gallery` |
| L360 | Prop (label) | `Close Lightbox` |
| L371 | Prop (label) | `Previous image` |
| L403 | Prop (label) | `Next image` |

---

## File: [`components\sections\TestimonialCarousel.tsx`](file:///D:/Projects/jibbv2/components/sections/TestimonialCarousel.tsx)
- **i18n Enabled (`useTranslations`)**: `Yes`
- **Hardcoded English Instances Found**: `6`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L124 | Prop (label) | `Previous testimonial` |
| L155 | Prop (label) | `Next testimonial` |
| L235 | Prop (label) | `Facebook Profile` |
| L244 | Prop (label) | `LinkedIn Profile` |
| L253 | Prop (label) | `X (Twitter) Profile` |
| L262 | Prop (label) | `Telegram Profile` |

---

## File: [`components\story\MobileStoryHero.tsx`](file:///D:/Projects/jibbv2/components/story/MobileStoryHero.tsx)
- **i18n Enabled (`useTranslations`)**: `Yes`
- **Hardcoded English Instances Found**: `1`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L224 | JSX Text | `Building Bridges,` |

---

## File: [`components\ui\EventTicker.tsx`](file:///D:/Projects/jibbv2/components/ui/EventTicker.tsx)
- **i18n Enabled (`useTranslations`)**: `Yes`
- **Hardcoded English Instances Found**: `1`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L74 | Prop (label) | `Dismiss event ticker` |

---

## File: [`components\ui\ScrollReveal.tsx`](file:///D:/Projects/jibbv2/components/ui/ScrollReveal.tsx)
- **i18n Enabled (`useTranslations`)**: `No`
- **Hardcoded English Instances Found**: `1`

| Line | Type | Hardcoded English Text |
| :--- | :--- | :--- |
| L16 | JSX Text | `I fade up when scrolled into view` |

---

