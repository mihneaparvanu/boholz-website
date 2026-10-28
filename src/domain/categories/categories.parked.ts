import type { Category, ModelCategory } from "./categories.types";

export const parkedCategories = {
  shedRoofHouse: {
    name: "Pultdachhaus",
    slug: "pultdachhaus",
    description: null,
    media: [
      {
        isHero: true,
        path: "/images/models/pultdachhaus/21-349-225/gallery/pultdachhaus-21-349-225-gallery-pdh-elw-349-21-225.webp",
        alt: "Pultdachhaus 21-349-225",
        width: 2400,
        height: 1697,
        isAi: false,
      },
      {
        isHero: false,
        path: "/images/models/pultdachhaus/21-349-225/gallery/pultdachhaus-21-349-225-gallery-pdh-elw-349-21-225.webp",
        alt: "Pultdachhaus 21-349-225",
        width: 2400,
        height: 1697,
        isAi: false,
      },
    ],
  },
} satisfies Partial<Record<Category, ModelCategory>>;
