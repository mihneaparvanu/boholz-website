import { trustBadges } from "@/features/trust/trust-badges.content";
import type { LandingTrustStats } from "./landing.types";

export const defaultTrustStats: LandingTrustStats = {
  eyebrow: "Vertrauen",
  heading: "Ihr Vertrauen",
  highlight: "fest verankert.",
  lede: "Wir bauen nicht nur Häuser, wir bauen Sicherheit. Mit hochwertiger Fertigung aus Deutschland und klaren vertraglichen Zusagen, auf die Sie sich verlassen können.",
  badges: trustBadges,
};

/** Images for SEO text sections that have none of their own. */
export const seoImagePool = [
  "/images/landing/uebersicht/lifestyle-01.webp",
  "/images/photography/log-stack.webp",
  "/images/content/advantage/wandaufbau/hero.webp",
  "/images/landing/uebersicht/lifestyle-06.webp",
];

/** Covers of the Infopaket shown next to the mid-page CTA. */
export const catalogCovers = [
  "/images/landing/imagebroschuere-2026-10b-cover.webp",
  "/images/landing/hauskatalog-2026-10-cover.webp",
  "/images/landing/kurzkatalog-2026-10-cover.webp",
];
