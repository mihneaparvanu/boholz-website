/**
 * TEMPLATE DEMO — structural preview of the landing skeleton.
 *
 * Every section filled with English placeholder headings + lorem ipsum so the
 * full page structure is visible at a glance. All image slots point at one
 * image (the mountain Einfamilienhaus, /images/brand/hero.webp). Registered
 * at /wohnen/template for review — NOT meant for production / prod deploy.
 */
import type { LandingPageContent } from "./landing.types";

const IMG = "/images/brand/hero.webp";
const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.";

export const templateDemoContent: LandingPageContent = {
  seo: {
    title: "Template Demo · Landing structure preview",
    description: LOREM,
  },

  hero: {
    eyebrow: "Here goes the eyebrow",
    heading: "Here goes the hero",
    highlight: "headline.",
    lede: LOREM,
    imageAlt: "Placeholder image — mountain Einfamilienhaus",
    imageFallbackPath: IMG,
    preferredCategorySlug: "einfamilienhaus",
    primaryCta: { label: "Get the house catalog now", href: "#anfordern" },
    secondaryCta: { label: "Secondary CTA", href: "/kontakt" },
  },

  benefitsIntro: {
    eyebrow: "Here goes the eyebrow",
    heading: "Here goes the benefits",
    highlight: "intro.",
    lede: LOREM,
  },

  benefits: [
    { icon: "leaf", title: "Here goes benefit one", body: LOREM, tone: "forest" },
    { icon: "zap", title: "Here goes benefit two", body: LOREM, tone: "sage" },
    { icon: "pencil", title: "Here goes benefit three", body: LOREM, tone: "leaf" },
    { icon: "key-round", title: "Here goes benefit four", body: LOREM, tone: "accent" },
  ],

  houses: {
    eyebrow: "Here goes the eyebrow",
    heading: "Here goes the house",
    highlight: "carousel.",
    lede: LOREM,
    categorySlugs: ["einfamilienhaus"],
    featuredOnly: false,
    maxItems: 99,
  },

  featureVisual: {
    eyebrow: "Here goes the eyebrow",
    heading: "Here goes the image",
    highlight: "band.",
    lede: LOREM,
    imageFallbackPath: IMG,
    imageAlt: "Placeholder image — mountain Einfamilienhaus",
    allowPlaceholder: false,
  },

  audience: {
    eyebrow: "Here goes the eyebrow",
    heading: "Here goes the audience",
    highlight: "block.",
    lede: LOREM,
    items: [
      { icon: "users", label: "Here goes audience one", description: LOREM },
      { icon: "heart-handshake", label: "Here goes audience two", description: LOREM },
      { icon: "briefcase", label: "Here goes audience three", description: LOREM },
      { icon: "trending-up", label: "Here goes audience four", description: LOREM },
    ],
  },

  featureBody: {
    eyebrow: "Here goes the eyebrow",
    heading: "Here goes the two-column",
    highlight: "feature.",
    lede: "Here goes the subtitle.",
    paragraphs: [LOREM, LOREM],
    imageFallbackPath: IMG,
    imageAlt: "Placeholder image — mountain Einfamilienhaus",
    reverse: false,
    cta: { label: "Section CTA", href: "/kontakt" },
  },

  testimonials: {
    eyebrow: "Here goes the eyebrow",
    heading: "Here goes the trust",
    highlight: "band.",
    lede: LOREM,
    tone: "olive",
    badges: [
      { label: "Badge one", flag: true },
      { label: "Badge two", sub: "subtext" },
    ],
    testimonials: [
      { name: "Name One", role: "Role", rating: 5, quote: LOREM },
      { name: "Name Two", role: "Role", rating: 5, quote: LOREM },
      { name: "Name Three", role: "Role", rating: 5, quote: LOREM },
    ],
  },

  faq: {
    eyebrow: "Here goes the eyebrow",
    heading: "Here goes the FAQ",
    highlight: "block.",
    items: [
      { id: "q1", question: "Here goes question one?", answer: LOREM },
      { id: "q2", question: "Here goes question two?", answer: LOREM },
      { id: "q3", question: "Here goes question three?", answer: LOREM },
    ],
  },

  // NEW LP-only gallery — placeholder tiles (one mountain EFH image reused).
  gallery: {
    eyebrow: "Here goes the eyebrow",
    heading: "Here goes the",
    highlight: "gallery.",
    lede: LOREM,
    images: [
      { src: IMG, alt: "Gallery placeholder 1" },
      { src: IMG, alt: "Gallery placeholder 2" },
      { src: IMG, alt: "Gallery placeholder 3" },
      { src: IMG, alt: "Gallery placeholder 4" },
      { src: IMG, alt: "Gallery placeholder 5" },
      { src: IMG, alt: "Gallery placeholder 6" },
    ],
  },

  leadForm: {
    eyebrow: "Here goes the eyebrow",
    heading: "Download our house catalog",
    highlight: "for free.",
    lede: LOREM,
  },

  midPageCta: {
    eyebrow: "Here goes the eyebrow",
    heading: "Here goes the closing",
    highlight: "CTA.",
    lede: LOREM,
    tone: "brand",
    primaryCta: { label: "Get the house catalog now", href: "#anfordern" },
    secondaryCta: { label: "Secondary CTA", href: "/kontakt" },
  },
};
