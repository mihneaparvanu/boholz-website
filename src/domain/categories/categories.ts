import type { Category, ModelCategory } from "./categories.types";

export const categories = {
  bestseller: {
    name: "Bestseller",
    slug: "bestseller",
    description:
      "Die beliebtesten BoHolz-Modelle — meistgewählt von unseren Kunden.",
    media: [
      {
        isHero: true,
        path: "/images/models/einfamilienhaus/32-150-170/gallery/einfamilienhaus-32-150-170-gallery-ehf-02.webp",
        alt: null,
        width: 2400,
        height: 1350,
        isAi: false,
      },
    ],
  },
  oneFamilyHouse: {
    name: "Einfamilienhaus",
    slug: "einfamilienhaus",
    description: null,
    media: [
      {
        isHero: true,
        path: "/images/models/einfamilienhaus/28-194-170/gallery/einfamilienhaus-28-194-170-gallery-efh-28-194-170.webp",
        alt: null,
        width: 2400,
        height: 1697,
        isAi: false,
      },
    ],
  },
  cityVilla: {
    name: "Stadtvilla",
    slug: "stadtvilla",
    description: null,
    media: [
      {
        isHero: true,
        path: "/images/models/stadtvilla/22-140-000/gallery/stadtvilla-22-140-000-gallery-sv-02.webp",
        alt: null,
        width: 2400,
        height: 1350,
        isAi: false,
      },
    ],
  },
  bungalow: {
    name: "Bungalow",
    slug: "bungalow",
    description: null,
    media: [
      {
        isHero: true,
        path: "/images/models/bungalow/22-116-000/gallery/bungalow-22-116-000-gallery-bu-01.webp",
        alt: null,
        width: 2400,
        height: 1351,
        isAi: false,
      },
    ],
  },
  doubleHouse: {
    name: "Doppelhaus",
    slug: "doppelhaus",
    description: null,
    media: [
      {
        isHero: true,
        path: "/images/models/doppelhaus/25-138-210/gallery/doppelhaus-25-138-210-gallery-dhh-2-1.webp",
        alt: null,
        width: 2400,
        height: 1350,
        isAi: false,
      },
    ],
  },
  generationHouse: {
    name: "Generationenhaus",
    slug: "generationenhaus",
    description: null,
    media: [
      {
        isHero: true,
        path: "/images/models/generationenhaus/30-223-160/gallery/generationenhaus-30-223-160-gallery-gen-1.webp",
        alt: null,
        width: 2400,
        height: 1350,
        isAi: false,
      },
    ],
  },
  twoFamilyHouse: {
    name: "Zweifamilienhaus",
    slug: "zweifamilienhaus",
    description: null,
    media: [
      {
        isHero: true,
        path: "/images/models/zweifamilienhaus/22-282-0/gallery/zweifamilienhaus-22-282-0-gallery-hero.webp",
        alt: "Zweifamilienhaus 22-282 Außenansicht",
        width: 2400,
        height: 1696,
        isAi: false,
      },
    ],
  },
  multiFamilyHouse: {
    name: "Mehrfamilienhaus",
    slug: "mehrfamilienhaus",
    description: "",
    media: [
      {
        isHero: true,
        path: "/images/models/mehrfamilienhaus/satteldorf/satteldorf-12-familienhaus.webp",
        alt: "12-Familienwohnhaus Satteldorf",
        width: 2400,
        height: 1465,
        isAi: false,
      },
    ],
  },
  cube: {
    name: "Kubus",
    slug: "kubus",
    description: null,
    media: [
      {
        isHero: true,
        path: "/images/models/kubus/0-278/gallery/kubus-0-278-gallery-kubus-278-0-0.webp",
        alt: null,
        width: 2400,
        height: 1696,
        isAi: false,
      },
    ],
  },
} satisfies Partial<Record<Category, ModelCategory>>;

// Key order is display order.
export const displayCategories = Object.values(categories);
