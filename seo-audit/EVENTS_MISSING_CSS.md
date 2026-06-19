# Missing CSS for Events Pages

This document lists all the CSS classes that need to be added to `app/globals.css` for the events pages to work properly.

## Summary

Your events pages use CSS class names with these prefixes:
- `evl-*` - Events Landing page
- `event-detail-*` - Individual event detail pages  
- `events-*` - Shared event component styles

## CSS Classes to Add

Add this CSS to your `app/globals.css` file (append at the end, after the existing styles):

```css
/* ============================================================
   EVENTS PAGES STYLING
   Japan India Business Bureau Events Section
   ============================================================ */

/* ─── Events Landing Page (evl-*) ─────────────────────────── */

/* Main container */
.evl-main {
  @apply min-h-screen bg-background;
}

/* Hero section */
.evl-hero {
  @apply relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden;
}

.evl-hero-bg {
  @apply absolute inset-0 bg-gradient-to-br from-jibb-indigo via-jibb-orange/20 to-background -z-10;
}

.evl-hero-content {
  @apply section-container text-center space-y-6 md:space-y-8 relative z-10;
}

.evl-hero-tag {
  @apply inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground;
}

.evl-hero-tag-line {
  @apply w-8 h-0.5 bg-jibb-orange;
}

.evl-hero-tag-text {
  @apply uppercase tracking-wider;
}

.evl-hero-title {
  @apply text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight;
}

.evl-hero-title em {
  @apply text-jibb-orange not-italic;
}

.evl-hero-subtitle {
  @apply text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed;
}

/* Tabs for upcoming/past events */
.evl-tabs-container {
  @apply flex justify-center gap-4 mb-8 md:mb-12;
}

.evl-tab-btn {
  @apply flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border bg-card text-foreground font-semibold transition-all duration-300 hover:border-jibb-orange hover:bg-jibb-orange/5;
}

.evl-tab-btn.active {
  @apply border-jibb-orange bg-jibb-orange/10 text-jibb-orange;
}

.evl-tab-box {
  @apply px-3 py-1 rounded-md bg-muted text-xs font-bold uppercase tracking-wider;
}

.evl-tab-btn.active .evl-tab-box {
  @apply bg-jibb-orange text-white;
}

.evl-tab-italic {
  @apply italic;
}

/* Banners section */
.evl-banners-section {
  @apply py-16 md:py-24 section-container;
}

.evl-banners-container {
  @apply max-w-5xl mx-auto;
}

.evl-banner-carousel-wrapper {
  @apply relative;
}

.evl-banner-card {
  @apply rounded-2xl overflow-hidden shadow-jibb-lg border border-border;
}

.evl-banner-link {
  @apply block;
}

.evl-banner-img {
  @apply w-full h-auto transition-transform duration-500 hover:scale-105;
}

/* Carousel navigation */
.evl-carousel-arrow {
  @apply absolute top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-card/90 backdrop-blur-sm p-3 rounded-full shadow-jibb border border-border text-foreground hover:bg-jibb-orange hover:text-white hover:border-jibb-orange transition-all duration-300;
}

.evl-carousel-arrow.left {
  @apply left-4;
}

.evl-carousel-arrow.right {
  @apply right-4;
}

/* Carousel dots */
.evl-carousel-dots {
  @apply flex justify-center gap-2 mt-6;
}

.evl-carousel-dot {
  @apply w-2 h-2 rounded-full bg-muted transition-all duration-300 hover:bg-jibb-orange;
}

.evl-carousel-dot.active {
  @apply w-8 bg-jibb-orange;
}

/* Collage/Gallery section */
.evl-collage-section {
  @apply py-16 md:py-24 bg-muted/30 section-container;
}

.evl-collage-header {
  @apply mb-12 md:mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6;
}

.evl-collage-header-left {
  @apply space-y-3;
}

.evl-collage-tag {
  @apply text-sm font-semibold text-jibb-orange uppercase tracking-wider;
}

.evl-collage-title {
  @apply text-3xl md:text-4xl font-bold text-foreground;
}

.evl-collage-subtitle {
  @apply text-muted-foreground;
}

.evl-gallery-carousel-selector {
  @apply flex items-center gap-4 bg-card px-6 py-3 rounded-xl border border-border shadow-jibb-sm;
}

.evl-gallery-carousel-arrow {
  @apply p-2 rounded-lg hover:bg-muted text-foreground transition-colors;
}

.evl-gallery-carousel-name {
  @apply font-semibold text-foreground min-w-[200px] text-center;
}

.evl-collage-grid-wrapper {
  @apply space-y-6;
}

.evl-collage-grid-container {
  @apply overflow-hidden;
}

.evl-collage-grid {
  @apply grid grid-cols-2 md:grid-cols-3 gap-4;
}

.evl-collage-item {
  @apply relative aspect-[4/3] rounded-xl overflow-hidden group;
}

.evl-collage-img {
  @apply object-cover transition-transform duration-500 group-hover:scale-110;
}

.evl-collage-overlay {
  @apply absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4;
}

.evl-collage-overlay span {
  @apply text-white text-sm font-medium;
}

.evl-collage-empty-state {
  @apply flex flex-col items-center justify-center py-20 text-muted-foreground;
}

.evl-collage-empty-state .material-symbols-outlined {
  @apply text-6xl mb-4 opacity-30;
}

.evl-gallery-action {
  @apply text-center;
}

.evl-btn-view-gallery {
  @apply inline-flex items-center gap-2 px-6 py-3 bg-jibb-orange text-white font-semibold rounded-xl hover:bg-jibb-orange-dark transition-all duration-300 shadow-jibb hover:shadow-jibb-lg hover:-translate-y-0.5;
}

.evl-gallery-count {
  @apply text-white/80 text-sm;
}

/* Lightbox modal */
.evl-lightbox-overlay {
  @apply fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4;
}

.evl-lightbox-close {
  @apply absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all;
}

.evl-lightbox-nav-btn {
  @apply absolute top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all;
}

.evl-lightbox-nav-btn.left {
  @apply left-4;
}

.evl-lightbox-nav-btn.right {
  @apply right-4;
}

.evl-lightbox-content {
  @apply max-w-6xl mx-auto space-y-4;
}

.evl-lightbox-img-wrapper {
  @apply relative w-full max-h-[80vh];
}

.evl-lightbox-img {
  @apply w-full h-full object-contain;
}

.evl-lightbox-caption {
  @apply text-center space-y-2;
}

.evl-lightbox-counter {
  @apply text-white/60 text-sm;
}

.evl-lightbox-desc {
  @apply text-white text-lg;
}

/* ─── Event Detail Pages (event-detail-*, events-*) ──────── */

/* Main container for detail pages */
.event-detail-main {
  @apply min-h-screen bg-background relative;
}

/* Back button */
.event-detail-back-btn {
  @apply fixed top-24 left-4 z-40 flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full shadow-jibb hover:bg-muted hover:border-jibb-orange text-foreground transition-all duration-300;
}

/* Banner for concluded events */
.event-concluded-banner {
  @apply flex items-center justify-center gap-3 py-4 bg-muted/50 border-y border-border text-muted-foreground;
}

/* Poster hero section */
.event-detail-poster-hero {
  @apply relative w-full h-[40vh] md:h-[50vh] overflow-hidden;
}

.event-detail-poster-img {
  @apply object-cover object-center;
}

.event-detail-poster-overlay {
  @apply absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent;
}

/* Event hero section */
.events-hero {
  @apply section-container py-16 md:py-24 grid md:grid-cols-2 gap-12 relative;
}

.events-hero-bg {
  @apply absolute inset-0 bg-gradient-to-br from-jibb-indigo/5 to-transparent -z-10;
}

.events-hero-left {
  @apply space-y-6;
}

.events-tag {
  @apply inline-flex items-center gap-2;
}

.events-tag-line {
  @apply w-8 h-0.5 bg-jibb-orange;
}

.events-tag-text {
  @apply text-sm font-semibold text-muted-foreground uppercase tracking-wider;
}

.events-hero-title {
  @apply text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight;
}

.events-hero-title em {
  @apply text-jibb-orange not-italic;
}

.events-hero-subtitle {
  @apply text-base md:text-lg text-muted-foreground leading-relaxed;
}

.events-hero-buttons {
  @apply flex flex-wrap gap-4;
}

.events-btn {
  @apply inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-jibb;
}

.events-btn-primary {
  @apply bg-jibb-orange text-white hover:bg-jibb-orange-dark hover:shadow-jibb-lg hover:-translate-y-0.5;
}

.events-btn-secondary {
  @apply bg-card border border-border text-foreground hover:border-jibb-orange hover:bg-jibb-orange/5;
}

.events-hero-right {
  @apply space-y-6;
}

.events-badges {
  @apply flex flex-wrap gap-3;
}

.events-badge {
  @apply px-4 py-2 rounded-full text-sm font-semibold;
}

.events-badge-date {
  @apply bg-jibb-indigo/10 text-jibb-indigo;
}

.events-badge-format {
  @apply bg-jibb-orange/10 text-jibb-orange;
}

.events-details {
  @apply space-y-4 bg-card rounded-2xl p-6 border border-border shadow-jibb-sm;
}

.events-detail-item {
  @apply flex gap-4 items-start;
}

.events-detail-item .material-symbols-outlined {
  @apply text-jibb-orange text-2xl;
}

.events-detail-item h4 {
  @apply font-semibold text-foreground text-sm mb-1;
}

.events-detail-item p {
  @apply text-muted-foreground text-sm;
}

.events-detail-sub {
  @apply text-xs text-muted-foreground/70 mt-1;
}

/* Program section */
.events-program {
  @apply section-container py-16 md:py-24;
}

.events-section-header {
  @apply flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12;
}

.events-section-title {
  @apply text-3xl md:text-4xl font-bold text-foreground;
}

.events-section-date {
  @apply text-muted-foreground font-medium;
}

/* Program table styles (in EventsProgramTable component) */
.events-program-table {
  @apply space-y-3;
}

/* Partners section */
.events-partners-section {
  @apply py-16 md:py-24 bg-muted/30 overflow-hidden;
}

.events-partners-section-header {
  @apply section-container text-center mb-12 space-y-3;
}

.events-banner-tag {
  @apply text-sm font-semibold text-jibb-orange uppercase tracking-wider;
}

.events-banner-title {
  @apply text-3xl md:text-4xl font-bold text-foreground;
}

.events-partners-marquee {
  @apply relative overflow-hidden;
}

.events-partners-track {
  @apply flex gap-12 animate-marquee;
  animation: marquee 30s linear infinite;
}

.events-partner-logo-item {
  @apply flex-shrink-0;
}

.events-partner-marquee-img {
  @apply h-12 md:h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Venue section */
.events-venue {
  @apply section-container py-16 md:py-24;
}

.events-venue-banner {
  @apply text-center mb-12 space-y-3;
}

.events-venue-name-hero {
  @apply text-2xl md:text-3xl font-bold text-foreground;
}

.events-venue-split {
  @apply grid md:grid-cols-2 gap-12 mb-12;
}

.events-venue-details {
  @apply space-y-6;
}

.events-detail-row {
  @apply flex gap-4 items-start;
}

.events-detail-icon {
  @apply p-3 rounded-xl bg-jibb-orange/10 text-jibb-orange flex-shrink-0;
}

.events-detail-content {
  @apply space-y-1;
}

.events-detail-label {
  @apply text-sm font-semibold text-muted-foreground uppercase tracking-wider;
}

.events-detail-value {
  @apply text-lg font-bold text-foreground;
}

.events-travel-section {
  @apply bg-card rounded-2xl p-6 border border-border shadow-jibb-sm;
}

.events-travel-header {
  @apply mb-6 space-y-2;
}

.events-travel-label {
  @apply text-sm font-semibold text-jibb-orange uppercase tracking-wider;
}

.events-travel-title {
  @apply text-lg font-bold text-foreground;
}

.events-travel-map {
  @apply rounded-xl border border-border;
}

/* Contact footer */
.events-contact-footer {
  @apply bg-muted/30 rounded-2xl p-8 border border-border;
}

.events-contact-inner {
  @apply flex flex-col md:flex-row items-start md:items-center justify-between gap-6;
}

.events-contact-left {
  @apply flex items-center gap-4;
}

.events-contact-icon {
  @apply p-3 rounded-xl bg-jibb-orange/10 text-jibb-orange;
}

.events-contact-label {
  @apply text-sm font-semibold text-muted-foreground uppercase tracking-wider;
}

.events-contact-org {
  @apply text-lg font-bold text-foreground;
}

.events-contact-email {
  @apply text-jibb-orange hover:text-jibb-orange-dark font-semibold transition-colors underline;
}

/* Parallax header for manufacturing event */
.events-parallax-header {
  @apply relative overflow-hidden rounded-2xl;
}
```

## Additional Notes

### Material Symbols Icons

Your events pages use Material Symbols icons. Make sure you have this import in your layout or a global location:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  rel="stylesheet"
/>
```

Or install via npm:

```bash
npm install material-symbols
```

### Images and Assets

Make sure these assets exist in your `/public` directory:
- `/events/event-gallery/...` - Gallery images
- `/events/*.png` or `*.jpg` - Event posters  
- `/events/japan-travel-map.png` - Travel map image

### Component Dependencies

The events pages use:
- `EventsProgramTable` component (already exists at `components/events/EventsProgramTable.tsx`)
- `EventsTableRow` component (already exists at `components/events/EventsTableRow.tsx`)
- Framer Motion for animations

## Testing Checklist

After adding the CSS, test:
- [ ] `/events` landing page loads without errors
- [ ] Event banners carousel works
- [ ] Gallery lightbox opens and closes
- [ ] Individual event pages render properly
- [ ] Program schedule table displays correctly
- [ ] Responsive design works on mobile
- [ ] Dark mode styling looks good
- [ ] All hover effects work

## Fixes Applied

✅ Fixed import errors:
- Changed `useLanguage` from `@/lib/LanguageContext` to `useLocale` from `next-intl`
- Changed `import { Navbar, Footer } from '@/components'` to individual imports from `@/components/layout/Navbar` and `@/components/layout/Footer`
- Updated `fontFamily: 'var(--font-noto-jp)'` to `'var(--font-noto-sans-jp)'` to match your project's font variable

The errors should now be fixed. Add the CSS above to complete the styling!
