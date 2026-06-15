/**
 * View-model derivers — entity (DB) → presentation-ready card props.
 *
 * Lives one layer above the loaders: loaders shape the row + relations,
 * derivers format strings for a specific component contract. Keeps the
 * card components dumb (no formatting logic) and the pages thin (no
 * inline mappers).
 */
import type { HouseModel } from "@/db/models";
import type {
  HouseModelCardProps,
  HouseModelSpec,
} from "@/ui/sections/HouseModelCard.vue";
import { getMediaURL } from "@/lib/media";

const FALLBACK_IMAGE_PATH = "/images/pages/uber-uns/value-1.webp";

/**
 * Inclusions surfaced under the price for bestseller models — their advertised
 * price already covers these. Client (2026-06): apply to ALL bestsellers
 * (`isFeatured`), not a hard-coded slug list. The listing card uses the
 * abbreviated "inkl." wording; the detail-page SideCard spells it out.
 */
const BESTSELLER_INCLUSIONS = ["inkl. Bodenplatte", "inkl. Architektenleistung"];

/**
 * Client (2026-06-15): bestsellers additionally advertise that KfW 40 and the
 * QNG quality seal are optionally available (on top of the standard KfW 55).
 * Surfaced as a note line under the price, next to the inclusions.
 */
const BESTSELLER_KFW_OPTION = "KfW 40 & QNG optional";

/** True when the model is a bestseller (drives the price inclusions). */
export function isBestseller(m: Pick<HouseModel, "isFeatured">): boolean {
  return m.isFeatured ?? false;
}

/**
 * HouseModel → HouseModelCardProps.
 *
 * Card is presentation-only — we format m²/Zimmer/efficiency strings here
 * so the component stays dumb. `code` is "{CATEGORY-UPPER} · {MODEL-CODE}"
 * per HouseModelCard's contract.
 */
export function toHouseModelCard(m: HouseModel): HouseModelCardProps {
  const { src, alt } = pickImage(m);
  return {
    id: m.id,
    slug: m.slug,
    name: m.title,
    code: `${(m.category?.name ?? "Hausmodell").toUpperCase()} · ${formatModelCode(m.modelCode)}`,
    image: src,
    imageAlt: alt,
    categoryID: m.category?.id ?? "",
    isFeatured: m.isFeatured ?? false,
    specs: specsFor(m),
    priceHint: priceHintFor(m),
    priceCaveats: priceCaveatsFor(m),
  };
}

function specsFor(m: HouseModel): HouseModelSpec[] {
  const specs: HouseModelSpec[] = [];

  if (m.livingArea != null) {
    // Drizzle returns numeric columns as strings; Number() coerces and
    // toLocaleString gives us the German decimal comma.
    const area = Number(m.livingArea);
    specs.push({ kind: "area", value: `${area.toLocaleString("de-DE")} m²` });
  }

  // Client (2026-06): drop the "X Zimmer" chip everywhere. Multi-family /
  // two-family models keep their unit count ("X Einheiten").
  if (m.details?.familiesCount != null && m.details.familiesCount > 1) {
    specs.push({
      kind: "rooms",
      value: `${m.details.familiesCount} Einheiten`,
    });
  }

  // KfW efficiency isn't a structured field today — stand in with the
  // typology label until a real column lands. Client (2026-06): bestsellers
  // advertise only "KfW 55".
  if (m.category?.name) {
    specs.push({
      kind: "efficiency",
      value: isBestseller(m) ? "KfW 55" : "KfW 40 / 55",
    });
  }

  return specs.slice(0, 3);
}

/**
 * Model code as shown on the card overline. Client (2026-06): drop a trailing
 * "-000" placeholder segment (e.g. "22-116-000" → "22-116"). Real third
 * segments (e.g. "-225") are left intact.
 */
function formatModelCode(code: string | null): string {
  return (code ?? "").replace(/-000$/, "");
}

function priceHintFor(m: HouseModel): string | undefined {
  const price = m.price == null ? NaN : Number(m.price);
  if (!Number.isFinite(price) || price <= 0) {
    // Client (2026-06-15): non-bestseller models carry no figure — advertise
    // "Preis auf Anfrage" instead of an empty slot. Bestsellers always price.
    return isBestseller(m) ? undefined : "Preis auf Anfrage";
  }
  const base = `ab ${price.toLocaleString("de-DE")} €`;
  // Featured models carry an asterisk; the disclaimer it references lives
  // on the haus detail page (SideCard.vue), not on the listing pages.
  return m.isFeatured ? `${base}*` : base;
}

function priceCaveatsFor(m: HouseModel): string[] {
  return isBestseller(m)
    ? [...BESTSELLER_INCLUSIONS, BESTSELLER_KFW_OPTION]
    : [];
}

function pickImage(m: HouseModel): { src: string; alt: string } {
  // Hero → thumbnail → first media → static fallback.
  // Paths from the loader are already R2-resolved.
  const hero = m.media.find((mm) => mm.isHero);
  const thumb = m.media.find((mm) => mm.isThumbnail);
  const pick = hero ?? thumb ?? m.media[0];
  return {
    src: pick?.media.path ?? getMediaURL(FALLBACK_IMAGE_PATH),
    alt: pick?.media.alt ?? m.title,
  };
}
