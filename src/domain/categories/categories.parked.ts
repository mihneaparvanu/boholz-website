import type { ModelCategory } from "./categories.types";

export const parkedCategories = [
  {
    name: "Pultdachhaus",
    slug: "pultdachhaus",
    description: null,
    media: [
      {
        isThumbnail: false,
        isHero: true,
        path: "/images/models/pultdachhaus/21-349-225/gallery/pultdachhaus-21-349-225-gallery-pdh-elw-349-21-225.webp",
        alt: "Pultdachhaus 21-349-225",
        width: 2400,
        height: 1697,
        isAi: false,
      },
      {
        isThumbnail: true,
        isHero: false,
        path: "/images/models/pultdachhaus/21-349-225/gallery/pultdachhaus-21-349-225-gallery-pdh-elw-349-21-225.webp",
        alt: "Pultdachhaus 21-349-225",
        width: 2400,
        height: 1697,
        isAi: false,
      },
    ],
  },
] satisfies ModelCategory[];
