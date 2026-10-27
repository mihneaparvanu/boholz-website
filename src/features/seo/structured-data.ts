/**
 * schema.org builders — DB rows in, JSON-LD objects out.
 *
 * HTML says how a page looks, never what it means: `<span>399.000 €</span>`
 * could be a price, a discount or a turnover figure. These objects state the
 * facts in a vocabulary search engines agree on, which is what lets a result
 * carry a price or breadcrumbs instead of just a title and a snippet.
 *
 * Rendered through `JsonLd.astro`. Anything absent is omitted rather than
 * sent as null — an incomplete object is fine, a wrong one is not.
 */
import type { HouseModel } from "@/domain/house-models/houseModels.types";
import { ROUTES } from "@/features/navigation/routes";

const SITE = "https://boholz-haus.de";

/**
 * Third-party pages that provably are this company.
 *
 * `sameAs` is the property that collapses scattered mentions into one entity,
 * so a wrong URL here does not merely add noise — it merges BoHolz with
 * somebody else. Nothing goes in this list until the page has been fetched
 * and seen to carry this company's name and a link back to `SITE`.
 */
const PROFILES = ["https://www.fertighaus.de/anbieter/boholz-haus/"];

/**
 * Company identity. Emitted once per page from `Layout.astro`.
 *
 * `HomeAndConstructionBusiness` rather than plain `Organization`: it is a
 * `LocalBusiness` subtype, so every property below keeps its meaning, and it
 * unlocks the local-business surface. The question a regional prefab
 * manufacturer is actually asked is "do you build where I live?", and
 * `areaServed` is the only property that answers it.
 *
 * `geo` is the pin of the `headquarters` location row (`zentrale-bad-kissingen`)
 * — the same Ostring 1 address stated below. It is a literal rather than a
 * lookup because `Layout.astro` runs on every route and must not spend a DB
 * round-trip on one coordinate; if the address ever moves, both halves of this
 * object move with it.
 *
 * Absent by decision, not oversight: `founder`, `foundingDate`,
 * `numberOfEmployees`, `openingHoursSpecification`, `aggregateRating`. None of
 * them is confirmed by the client, and claiming one wrongly is worse than
 * leaving the entity thin.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "BoHolz-Haus GmbH",
    url: SITE,
    logo: `${SITE}/favicon.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ostring 1",
      postalCode: "97688",
      addressLocality: "Bad Kissingen",
      addressCountry: "DE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 50.1914472,
      longitude: 10.0817995,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Unterfranken" },
      { "@type": "AdministrativeArea", name: "Bayern" },
    ],
    sameAs: PROFILES,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+49 971 78555715",
      email: "info@boholz-haus.de",
      contactType: "sales",
      availableLanguage: "German",
    },
  };
}

/**
 * A house model as a `Product` with an `Offer`.
 *
 * This is the one that can put a price under the search result. Google's
 * Product rich results are tuned for retail goods, so a prefab house does
 * not always qualify — verify with the Rich Results Test rather than
 * assuming. The markup is correct either way and costs nothing.
 *
 * `price` is numeric in the DB; schema.org wants a plain number with no
 * separators, so it is passed through String() and never formatted.
 */
export function productSchema(
  model: Pick<HouseModel, "title" | "slug" | "description" | "price">,
  images: string[],
) {
  const price = model.price != null ? String(model.price) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: model.title,
    url: SITE + ROUTES.house(model.slug),
    ...(model.description ? { description: model.description } : {}),
    ...(images.length > 0 ? { image: images } : {}),
    brand: { "@type": "Brand", name: "BoHolz-Haus" },
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: SITE + ROUTES.house(model.slug),
          },
        }
      : {}),
  };
}

/**
 * Breadcrumb trail. Supplies the hierarchy the flat `/haus/<slug>` URL does
 * not imply, and renders as the path line above a search result.
 */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: SITE + step.path,
    })),
  };
}
