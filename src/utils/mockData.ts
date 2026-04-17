import type { HouseModel, HouseModelImage } from "../types/models";

export const MOCK_HOUSE_MODELS: HouseModel[] = [
  {
    id: "m1",
    name: "Stadtvilla",
    description: "City Villa with elegant modern architecture.",
    living_area_sqm: 170,
    rooms: 5,
    house_model_images: [
      {
        id: "i1",
        house_model_id: "m1",
        url: "/images/models/city-villa/city-villa-thumb.jpg",
        alt_text: "Stadtvilla Exterior",
        category: "hero",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: "m2",
    name: "Bungalow",
    description: "Barrier-free single-story living with massive glass facades.",
    living_area_sqm: 134,
    rooms: 3,
    house_model_images: [
      {
        id: "i2",
        house_model_id: "m2",
        url: "/images/models/bungalow/bungalow-thumb.jpg",
        alt_text: "Bungalow Exterior",
        category: "hero",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: "m3",
    name: "Einfamilienhaus",
    description: "The classic single-family home for suburban living.",
    living_area_sqm: 150,
    rooms: 4,
    house_model_images: [
      {
        id: "i3",
        house_model_id: "m3",
        url: "/images/models/single-family/single-family-thumb.jpg",
        alt_text: "Einfamilienhaus Exterior",
        category: "hero",
        sort_order: 1,
        is_primary: true,
      },
      {
        id: "i4",
        house_model_id: "m3",
        url: "/images/models/single-family/35-150-185.webp",
        alt_text: "Einfamilienhaus Side View",
        category: "gallery",
        sort_order: 2,
        is_primary: false,
      },
    ],
  },
  {
    id: "m4",
    name: "Generationenhaus",
    description: "The perfect multi-family home for large families.",
    living_area_sqm: 264,
    rooms: 8,
    house_model_images: [
      {
        id: "i5",
        house_model_id: "m4",
        url: "/images/models/multi-generational/multi-generational-thumb.jpg",
        alt_text: "Generationenhaus Exterior",
        category: "hero",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
  {
    id: "m5",
    name: "Kubushaus",
    description: "Modern cubic design with a flat roof.",
    living_area_sqm: 193,
    rooms: 6,
    house_model_images: [
      {
        id: "i6",
        house_model_id: "m5",
        url: "/images/models/cube-house/cube-house-thumb.jpg",
        alt_text: "Kubushaus Exterior",
        category: "hero",
        sort_order: 1,
        is_primary: true,
      },
    ],
  },
];
