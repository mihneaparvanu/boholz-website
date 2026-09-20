/**
 * Content every landing page shares unless it opts out.
 *
 * Sections that are identical across all landings live here rather than
 * being copy-pasted into each `*.content.ts`. The template reads
 * `content.<section> ?? default<Section>`, so a page overrides simply by
 * declaring the field — no flags, no config.
 */
import { trustBadges } from "@/features/trust/trust-badges.content";
import type { LandingTrustStats } from "./landing.types";

/**
 * Numeric proof strip. Copy matches the homepage's trust band so the two
 * surfaces tell the same story; if a landing page ever needs its own
 * framing it sets `trustStats` in its content file.
 */
export const defaultTrustStats: LandingTrustStats = {
  eyebrow: "Vertrauen",
  heading: "Ihr Vertrauen",
  highlight: "fest verankert.",
  lede: "Wir bauen nicht nur Häuser, wir bauen Sicherheit. Mit hochwertiger Fertigung aus Deutschland und klaren vertraglichen Zusagen, auf die Sie sich verlassen können.",
  badges: trustBadges,
};
