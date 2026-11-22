import type { Benefit } from "@/core/design/sections/BenefitsRow.astro";
import type { AudienceItem } from "@/core/design/sections/AudienceBlock.astro";
import type {
  Testimonial,
  CredentialBadge,
} from "@/core/design/sections/TestimonialBand.astro";
import type { FAQItem } from "@/core/design/primitives/FAQAccordion.vue";
import type { TrustBadge } from "@/features/trust/trust-badges.content";
import type { Category } from "@/domain/categories/categories.types";

export type { Benefit, AudienceItem, Testimonial, CredentialBadge, TrustBadge };
export type { FAQItem };

/* ── Building blocks ──────────────────────────────────────────────── */

export interface SectionIntro {
  eyebrow?: string;
  heading: string;
  /** Italic-serif accent appended to the heading. */
  highlight?: string;
  lede?: string;
}

export interface LandingCta {
  label: string;
  href: string;
}

/** A media path (resolved with `getMediaURL`) and its alt text. */
export interface LandingImage {
  imageFallbackPath: string;
  imageAlt: string;
}

/* ── Sections, in the order the page renders them ─────────────────── */

export interface LandingSeo {
  title: string;
  description: string;
  /** Reference only, not rendered. */
  focusKeyword?: string;
}

export interface LandingHero extends SectionIntro, LandingImage {
  eyebrow: string;
  lede: string;
  primaryCta: LandingCta;
  secondaryCta: LandingCta;
}

export interface LandingFeatureBody extends SectionIntro, LandingImage {
  paragraphs: string[];
  /** Image on the left instead of the right. */
  reverse?: boolean;
  cta?: LandingCta;
}

export interface LandingHouseShowcase extends SectionIntro {
  /** `null` includes every category. */
  categories: Category[] | null;
  /** Default true: only `isFeatured` models. */
  featuredOnly?: boolean;
  maxItems: number;
}

export interface LandingGalleryImage {
  src: string;
  alt: string;
}

export interface LandingGallery extends SectionIntro {
  images: LandingGalleryImage[];
}

export interface LandingMidPageCta extends SectionIntro {
  tone?: "surface" | "accent" | "brand" | "image";
  imageFallbackPath?: string;
  imageAlt?: string;
  primaryCta: LandingCta;
  secondaryCta?: LandingCta;
}

export type LandingBenefitsIntro = SectionIntro;

/** Exactly four, one per pastel tone, so the grid can't break. */
export type LandingBenefits = [Benefit, Benefit, Benefit, Benefit];

export interface LandingAudienceBlock extends SectionIntro {
  items: AudienceItem[];
}

export interface LandingTestimonials extends SectionIntro {
  tone?: "olive" | "graphite" | "stone";
  badges?: CredentialBadge[];
  testimonials: Testimonial[];
}

export interface LandingFAQ extends SectionIntro {
  items: FAQItem[];
  /** Id of the question open on first paint. */
  defaultOpen?: string;
}

export interface LandingSeoTextSection {
  heading: string;
  /** Paragraphs separated by a blank line. */
  body: string;
  /** Overrides the shared image pool for this section. */
  imageFallbackPath?: string;
  imageAlt?: string;
}

export interface LandingSeoText {
  heading: string;
  sections: LandingSeoTextSection[];
}

export interface LandingLeadForm extends SectionIntro {
  /** "bestseller" swaps the Hauskatalog for the Kurzkatalog. */
  catalogVariant?: "default" | "bestseller";
}

/* ── Not rendered by Landing.astro ────────────────────────────────── */

export interface LandingTrustStats extends SectionIntro {
  badges: TrustBadge[];
}

/** Read by the home page only. */
export interface LandingFeatureVisual extends SectionIntro, LandingImage {}

/* ── The whole page ───────────────────────────────────────────────── */

export interface LandingPageContent {
  seo: LandingSeo;
  hero: LandingHero;
  featureVisual: LandingFeatureVisual;
  featureBody: LandingFeatureBody;
  houses: LandingHouseShowcase;
  gallery?: LandingGallery;
  midPageCta: LandingMidPageCta;
  benefitsIntro: LandingBenefitsIntro;
  benefits: LandingBenefits;
  audience: LandingAudienceBlock;
  testimonials: LandingTestimonials;
  faq: LandingFAQ;
  seoText?: LandingSeoText;
  leadForm: LandingLeadForm;
  /** Overrides `defaultTrustStats`. */
  trustStats?: LandingTrustStats;
}
