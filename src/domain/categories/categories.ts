import type { ModelCategory } from "./categories.types";
import { getMediaURL } from "@/lib/media";

export const categories = [
  {
    name: "Bestseller",
    slug: "bestseller",
    description:
      "Die beliebtesten BoHolz-Modelle — meistgewählt von unseren Kunden.",
    media: [
      {
        isThumbnail: true,
        isHero: true,
        path: getMediaURL(
          "/images/models/einfamilienhaus/32-150-170/gallery/einfamilienhaus-32-150-170-gallery-ehf-02.webp",
        ),
        alt: null,
        width: 2400,
        height: 1350,
        isAi: false,
      },
    ],
  },
  {
    name: "Einfamilienhaus",
    slug: "einfamilienhaus",
    description: null,
    media: [
      {
        isThumbnail: true,
        isHero: true,
        path: getMediaURL(
          "/images/models/einfamilienhaus/28-194-170/gallery/einfamilienhaus-28-194-170-gallery-efh-28-194-170.webp",
        ),
        alt: null,
        width: 2400,
        height: 1697,
        isAi: false,
      },
    ],
  },
  {
    name: "Stadtvilla",
    slug: "stadtvilla",
    description: null,
    media: [
      {
        isThumbnail: true,
        isHero: true,
        path: getMediaURL(
          "/images/models/stadtvilla/22-140-000/gallery/stadtvilla-22-140-000-gallery-sv-02.webp",
        ),
        alt: null,
        width: 2400,
        height: 1350,
        isAi: false,
      },
    ],
  },
  {
    name: "Bungalow",
    slug: "bungalow",
    description: null,
    media: [
      {
        isThumbnail: true,
        isHero: true,
        path: getMediaURL(
          "/images/models/bungalow/22-116-000/gallery/bungalow-22-116-000-gallery-bu-01.webp",
        ),
        alt: null,
        width: 2400,
        height: 1351,
        isAi: false,
      },
    ],
  },
  {
    name: "Doppelhaus",
    slug: "doppelhaus",
    description: null,
    media: [
      {
        isThumbnail: true,
        isHero: true,
        path: getMediaURL(
          "/images/models/doppelhaus/25-138-210/gallery/doppelhaus-25-138-210-gallery-dhh-2-1.webp",
        ),
        alt: null,
        width: 2400,
        height: 1350,
        isAi: false,
      },
    ],
  },
  {
    name: "Generationenhaus",
    slug: "generationenhaus",
    description: null,
    media: [
      {
        isThumbnail: true,
        isHero: true,
        path: getMediaURL(
          "/images/models/generationenhaus/30-223-160/gallery/generationenhaus-30-223-160-gallery-gen-1.webp",
        ),
        alt: null,
        width: 2400,
        height: 1350,
        isAi: false,
      },
    ],
  },
  {
    name: "Zweifamilienhaus",
    slug: "zweifamilienhaus",
    description: null,
    media: [
      {
        isThumbnail: true,
        isHero: true,
        path: getMediaURL(
          "/images/models/zweifamilienhaus/22-282-0/gallery/zweifamilienhaus-22-282-0-gallery-hero.webp",
        ),
        alt: "Zweifamilienhaus 22-282 Außenansicht",
        width: 2400,
        height: 1696,
        isAi: false,
      },
    ],
  },
  {
    name: "Mehrfamilienhaus",
    slug: "mehrfamilienhaus",
    description: "",
    media: [
      {
        isThumbnail: true,
        isHero: true,
        path: getMediaURL(
          "/images/models/mehrfamilienhaus/satteldorf/satteldorf-12-familienhaus.webp",
        ),
        alt: "12-Familienwohnhaus Satteldorf",
        width: 2400,
        height: 1465,
        isAi: false,
      },
    ],
  },
  {
    name: "Kubus",
    slug: "kubus",
    description: null,
    media: [
      {
        isThumbnail: true,
        isHero: true,
        path: getMediaURL(
          "/images/models/kubus/0-278/gallery/kubus-0-278-gallery-kubus-278-0-0.webp",
        ),
        alt: null,
        width: 2400,
        height: 1696,
        isAi: false,
      },
    ],
  },
] satisfies ModelCategory[];
