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
import type { HouseModel } from "@/db/models";
import { ROUTES } from "@/features/navigation/routes";

const SITE = "https://boholz-haus.de";

/** Company identity. Emitted once per page from `Layout.astro`. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
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
