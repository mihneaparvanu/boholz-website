import type { IconName } from "@/lib/icons";

/**
 * One half of a side-by-side comparison card pair (e.g. Sommer vs Winter,
 * ECO Nature vs ECO Nature Plus).
 *
 * Used by `FeatureCardPair.vue`. Two cards render side-by-side from tablet
 * up, stacked on mobile. The icon is a small visual anchor next to the
 * eyebrow; the image is the dominant card visual.
 */
export interface FeatureCard {
  /** Small uppercase eyebrow above the title — "Sommer", "Winter", "KfW 55", etc. */
  eyebrow: string;
  /** Card title — short, ~2–4 words. */
  title: string;
  /** Optional one-sentence lede under the title. */
  lede?: string;
  /** Bullet list of supporting points. */
  bullets: string[];
  /** Image URL (R2). */
  imageURL: string;
  /** Image alt text. */
  imageAlt: string;
  /** Optional Lucide icon name shown next to the eyebrow. */
  icon?: IconName;
}

/** One `<dt>/<dd>` pair of verbatim figures (U-Wert, Brandschutz, Schallschutz). */
export interface SpecPair {
  /** Short label — "U-Wert", "Brandschutz", "Schallschutz". */
  term: string;
  /** The figure exactly as the source document prints it. */
  value: string;
}

/**
 * Body copy with a highlighted closing sentence.
 *
 * The advantage sections lead with secondary body colour and finish on a
 * primary-coloured last sentence, so the eye lands on the key claim. Typed
 * as two fields instead of embedding a `<span class="primary">` in the
 * string: the emphasis is a rendering decision, not part of the copy.
 */
export interface EditorialProse {
  body: string;
  emphasis?: string;
}

/**
 * One exterior wall build-up of the comparison pair (Holz-Aktiv-Wand vs
 * Holz-Aktiv-Wand plus), rendered by `WallAssembly.astro`.
 *
 * Every string in here is a building specification quoted from the Bau- und
 * Leistungsbeschreibung. Layers, millimetres and U-values are contractual —
 * edit them only against the current BLB, never by hand from memory.
 */
export interface WallAssembly {
  /** Product name as the BLB prints it — "Holz-Aktiv-Wand". */
  name: string;
  /** Serif-italic suffix after the name — "plus". Kept separate so the
   *  product name itself stays one unstyled string. */
  nameSuffix?: string;
  /** Labelled cross-section diagram (fully-resolved URL). */
  imageURL: string;
  imageAlt: string;
  /** Intrinsic diagram size — the diagrams are never cropped, so the
   *  aspect ratio has to come from the file, not from CSS. */
  imageWidth: number;
  imageHeight: number;
  /** Numbered build-up layers 1–8, outside → inside. */
  layers: string[];
  /** Verbatim figures shown under the layer list. */
  specs: SpecPair[];
  /** Short note under the specs — "auch KfW-G + KfW-QNG geeignet". */
  note?: string;
}

/**
 * One heading-level block of the Bau- und Leistungsbeschreibung, rendered by
 * `SpecGroups.astro`.
 *
 * The BLB is the contractual spec document: its wording is quoted verbatim,
 * never paraphrased and never rounded. `source` carries the page citation
 * next to the text it belongs to so a reviewer can check a figure against
 * the PDF without leaving the file — the one thing a "keep in sync" comment
 * could never guarantee.
 */
export interface SpecGroup {
  /** Heading as the source document prints it. */
  heading: string;
  /** True when the source itself marks the whole block optional (the
   *  facades, for instance, are introduced with "Optional sind folgende
   *  Fassaden erhältlich:"). Renders a badge, so an upgrade can never be
   *  mistaken for standard scope. */
  optional?: boolean;
  /** Verbatim body paragraphs describing the standard scope. */
  paragraphs?: string[];
  /** Verbatim list — build-up layers or scope items. */
  bullets?: string[];
  /** Verbatim figures (U-Wert, Garantie, Schallleistungspegel). */
  specs?: SpecPair[];
  /** Paragraphs the source itself marks "Optional" — rendered apart from
   *  the standard scope so an upgrade never reads as included. */
  options?: string[];
  /** Footnotes the source prints under the list, markers included. */
  footnotes?: string[];
  /** Page citation, e.g. "BLB 09/2026, S. 26". Never rendered. */
  source: string;
}
