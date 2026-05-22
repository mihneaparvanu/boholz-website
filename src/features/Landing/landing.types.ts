/**
 * Shared content shape for the three campaign landing pages
 * (`/wohnen/uebersicht`, `/wohnen/mehrfamilien`, `/wohnen/bungalow`).
 *
 * The shape mirrors the section-component composition documented in
 * `design-audit/2026-05-16/LANDING-PAGES-PLAN.md`: every landing page is the
 * same skeleton (hero → benefits → houses → image-band → audience →
 * sustainability → testimonials → FAQ → lead-form → closing CTA) and the
 * three pages differ only by content + a handful of customisation hooks.
 *
 * Per-section content types are **derived from the section components'
 * exported prop types where possible** so a content file can never drift
 * from the kit it feeds. Where a section's props live on the component
 * itself (e.g. testimonial / FAQ shapes), we re-export the type alias here
 * for ergonomics — content files import only from `landing.types.ts`.
 */
import type { Benefit } from "@/components/sections/BenefitsRow.astro";
import type { AudienceItem } from "@/components/sections/AudienceBlock.astro";
import type {
  Testimonial,
  CredentialBadge,
} from "@/components/sections/TestimonialBand.astro";
import type {
  ContactInfo,
  InterestOption,
} from "@/components/sections/LeadFormBand.vue";
import type { FAQItem } from "@/components/ui/FAQAccordion.vue";

/* ── Re-exports — content files import everything from this module ─── */
export type { Benefit, AudienceItem, Testimonial, CredentialBadge };
export type { ContactInfo, InterestOption, FAQItem };

/* ── Hero ─────────────────────────────────────────────────────────── */

/**
 * Hero is composed via `sections/PageHero.astro`. We capture **content**
 * here; the page picks the real R2 image at frontmatter time from the live
 * DB (preferred) and falls back to `imageFallbackPath` (static R2 asset)
 * when the DB lookup misses.
 */
export interface LandingHero {
  eyebrow: string;
  title: string;
  /** Italic-serif accent appended to the title. */
  highlight?: string;
  subtitle: string;
  imageAlt: string;
  /**
   * Static R2 path used as a fallback if the DB has no hero for the
   * preferred category. Resolved through `getMediaURL()` at render time.
   * Format: `/images/pages/<slug>/...`.
   */
  imageFallbackPath: string;
  /**
   * Slug of the house category whose featured hero photo should be tried
   * first. The page frontmatter looks up an isFeatured model in this
   * category and uses its `isHero` media if present.
   */
  preferredCategorySlug: string;
  /** Primary CTA — pinned to the page's accent action. */
  primaryCta: LandingCta;
  /** Secondary CTA — paired with the primary. */
  secondaryCta: LandingCta;
}

export interface LandingCta {
  label: string;
  href: string;
}

/* ── Benefits row ─────────────────────────────────────────────────── */

/**
 * Section intro that sits above `BenefitsRow` — eyebrow, heading,
 * optional italic-serif accent, optional lede. Kept separate from
 * `LandingBenefits` so Phase-2 pages are a pure content swap with no
 * strings hardcoded in the page template.
 */
export interface LandingBenefitsIntro {
  eyebrow?: string;
  heading: string;
  /** Italic-serif key noun appended to the heading. */
  highlight?: string;
  lede?: string;
}

/** Exactly four cards, one per pastel tone — typed as a tuple so a
 *  content file can't ship three or five and silently break the grid. */
export type LandingBenefits = [Benefit, Benefit, Benefit, Benefit];

/* ── House showcase ───────────────────────────────────────────────── */

/**
 * The house showcase is rendered by `HouseModelsCarousel.vue` with models
 * **loaded live from the DB** by the page frontmatter. We don't store
 * models in the content file; we store the *filter criteria* and the
 * surrounding section copy.
 */
export interface LandingHouseShowcase {
  eyebrow?: string;
  heading: string;
  highlight?: string;
  lede?: string;
  /**
   * Slug(s) of categories to include. The page picks `getModels()` whose
   * `category.slug` is in this list, capped at `maxItems`. Pass `null` to
   * include every category (e.g. for the generic übersicht page).
   */
  categorySlugs: string[] | null;
  /**
   * When true (default), only `isFeatured` models are kept — the bestseller
   * gate. Set to `false` on typology-specific pages where the audience has
   * already self-selected and we want to show the full sub-catalogue.
   */
  featuredOnly?: boolean;
  /** Hard cap on cards rendered. Set high (e.g. 99) to effectively uncap. */
  maxItems: number;
}

/* ── Image band ───────────────────────────────────────────────────── */

export interface LandingImageBand {
  eyebrow?: string;
  heading: string;
  highlight?: string;
  lede?: string;
  imageFallbackPath: string;
  imageAlt: string;
  /**
   * If true and no DB image is available, the page renders a
   * `<VideoPlaceholder>` instead of trying to load a missing photo.
   */
  allowPlaceholder?: boolean;
}

/* ── Audience block ───────────────────────────────────────────────── */

export interface LandingAudienceBlock {
  eyebrow?: string;
  heading: string;
  highlight?: string;
  lede?: string;
  /** Four rows — kept as a regular array (not a tuple) so a page may add
   *  a fifth audience without TS gymnastics. AudienceBlock handles any
   *  count via grid auto-rows. */
  items: AudienceItem[];
}

/* ── Sustainability / two-column ──────────────────────────────────── */

/**
 * Mirrors `sections/TwoColumn.astro` prop shape with the body copy split
 * into paragraph strings (rather than slotted HTML) so it stays plain
 * data. The page renders each paragraph as a `<p>` inside the default
 * slot.
 */
export interface LandingSustainability {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  paragraphs: string[];
  imageFallbackPath: string;
  imageAlt: string;
  /** Place image on the right (true, default) or left (false). */
  reverse?: boolean;
  cta?: LandingCta;
}

/* ── Trust band (TestimonialBand.astro) ───────────────────────────── */

export interface LandingTrust {
  eyebrow?: string;
  heading: string;
  highlight?: string;
  lede?: string;
  tone?: "olive" | "graphite" | "stone";
  badges?: CredentialBadge[];
  testimonials: Testimonial[];
}

/* ── FAQ ──────────────────────────────────────────────────────────── */

export interface LandingFAQ {
  eyebrow?: string;
  heading: string;
  highlight?: string;
  items: FAQItem[];
  /** Optional id of the question that should be open on first paint. */
  defaultOpen?: string;
}

/* ── Lead form ────────────────────────────────────────────────────── */

export interface LandingLeadForm {
  eyebrow?: string;
  heading: string;
  highlight?: string;
  lede?: string;
  subCopy?: string;
  contact: ContactInfo;
  interestOptions?: InterestOption[];
  tone?: "pastell" | "tertiary" | "quaternary";
}

/* ── Closing CTA ──────────────────────────────────────────────────── */

export interface LandingClosingCta {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  /** `surface` (default), `accent` (deep blue), or `image` (with imageFallbackPath). */
  tone?: "surface" | "accent" | "image";
  imageFallbackPath?: string;
  imageAlt?: string;
  primaryCta: LandingCta;
  secondaryCta?: LandingCta;
}

/* ── SEO ──────────────────────────────────────────────────────────── */

export interface LandingSeo {
  title: string;
  description: string;
}

/* ── Top-level shape ──────────────────────────────────────────────── */

export interface LandingPageContent {
  /** Route slug — used for the page's URL and as the content key. */
  slug: "uebersicht" | "mehrfamilien" | "bungalow";
  seo: LandingSeo;
  hero: LandingHero;
  benefitsIntro: LandingBenefitsIntro;
  benefits: LandingBenefits;
  houses: LandingHouseShowcase;
  imageBand: LandingImageBand;
  audience: LandingAudienceBlock;
  sustainability: LandingSustainability;
  trust: LandingTrust;
  faq: LandingFAQ;
  leadForm: LandingLeadForm;
  closingCta: LandingClosingCta;
}
