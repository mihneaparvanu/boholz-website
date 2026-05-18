import type { IconName } from "@/utils/icons";

/**
 * One narrative phase in the BoHolz build journey.
 *
 * The same shape feeds two surfaces:
 *  - Homepage compact strip (`BauphasenStrip.vue`) — image + index + title + 1-line copy.
 *  - `/dein-zuhause` "01 · Der Ablauf" — EditorialCards (rich bullet lists alongside the visual).
 *
 * `description` is the long-form copy used inside the cards on /dein-zuhause.
 * `teaser` is the single-sentence variant used in the homepage strip — shorter
 * so the strip stays compact and readable in three columns at desktop.
 */
export interface BuildPhase {
  /** Stable slug for keying / future deep links (e.g. `/dein-zuhause#phase-grundstein`). */
  slug: string;
  /** "Grundstein", "Träume in Realität …", "Heiße Bauphase". */
  title: string;
  /** Long description — feeds EditorialCard.description on /dein-zuhause. */
  description: string;
  /** Short single-sentence teaser — feeds the homepage compact strip. */
  teaser: string;
  /** Lucide icon name — small accent in the strip / EditorialCard header. */
  icon: IconName;
  /** Fully-resolved R2 image URL — pass through `getMediaURL()` in the content file. */
  imageURL: string;
}
