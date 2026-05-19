/**
 * View-model derivers — entity (DB) → presentation-ready card props.
 *
 * Lives one layer above the loaders: loaders shape the row + relations,
 * derivers format strings for a specific component contract. Keeps the
 * card components dumb (no formatting logic) and the pages thin (no
 * inline mappers).
 */
import type { HouseModel } from "@/types/models";
import type {
  HouseModelCardProps,
  HouseModelSpec,
} from "@/components/sections/HouseModelCard.vue";
import { getMediaURL } from "@/utils/media";

const FALLBACK_IMAGE_PATH = "/images/pages/uber-uns/value-1.jpg";

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
    code: `${(m.category?.name ?? "Hausmodell").toUpperCase()} · ${m.modelCode}`,
    image: src,
    imageAlt: alt,
    categoryID: m.category?.id ?? "",
    isFeatured: m.isFeatured ?? false,
    specs: specsFor(m),
    priceHint: priceHintFor(m),
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

  if (m.details?.bedroomCount != null) {
    specs.push({ kind: "rooms", value: `${m.details.bedroomCount} Zimmer` });
  } else if (m.details?.familiesCount != null && m.details.familiesCount > 1) {
    // Multi-family models surface unit count instead of bedrooms.
    specs.push({
      kind: "rooms",
      value: `${m.details.familiesCount} Einheiten`,
    });
  }

  // KfW efficiency isn't a structured field today — stand in with the
  // typology label until a real column lands.
  if (m.category?.name) {
    specs.push({ kind: "efficiency", value: "KfW 40 / 55" });
  }

  return specs.slice(0, 3);
}

function priceHintFor(m: HouseModel): string | undefined {
  if (m.price == null) return undefined;
  const price = Number(m.price);
  if (!Number.isFinite(price) || price <= 0) return undefined;
  return `ab ${price.toLocaleString("de-DE")} €`;
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
