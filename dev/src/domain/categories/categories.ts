import type { HouseCategory } from @/db/models";
export const categories = [
  {
    "name": "Bestseller",
    "slug": "bestseller",
    "description": "Die beliebtesten BoHolz-Modelle — meistgewählt von unseren Kunden.",
    "media": [
      {
        "id": "21df67a5-3194-4f50-9ca3-44389c06e649",
        "categoryId": "00000000-0000-0000-0000-000000000001",
        "mediaId": "aacd0c63-c4e5-42a0-a3df-734150d98758",
        "isThumbnail": true,
        "isHero": true,
        "sortOrder": 0,
        "media": {
          "id": "aacd0c63-c4e5-42a0-a3df-734150d98758",
          "path": "/images/models/einfamilienhaus/32-150-170/gallery/einfamilienhaus-32-150-170-gallery-ehf-02.webp",
          "alt": null,
          "width": 2400,
          "height": 1350,
          "isAi": false,
          "createdAt": "2026-05-21T03:39:43.536Z"
        }
      }
    ]
  },
  {
    "name": "Einfamilienhaus",
    "slug": "einfamilienhaus",
    "description": null,
    "media": [
      {
        "id": "42f5a379-337f-4c77-8a39-397ebd02aa07",
        "categoryId": "00123c79-1feb-4e70-8068-4bd79a31b3eb",
        "mediaId": "c1b9fb8d-ea76-44ff-92f3-417a8e6fafd5",
        "isThumbnail": true,
        "isHero": true,
        "sortOrder": 0,
        "media": {
          "id": "c1b9fb8d-ea76-44ff-92f3-417a8e6fafd5",
          "path": "/images/models/einfamilienhaus/28-194-170/gallery/einfamilienhaus-28-194-170-gallery-efh-28-194-170.webp",
          "alt": null,
          "width": 2400,
          "height": 1697,
          "isAi": false,
          "createdAt": "2026-05-21T03:39:43.536Z"
        }
      }
    ]
  },
  {
    "name": "Stadtvilla",
    "slug": "stadtvilla",
    "description": null,
    "media": [
      {
        "id": "058d5576-ada1-45e9-ab69-a8d0100bcad4",
        "categoryId": "0297ea54-c40c-4186-b90b-1257a0077723",
        "mediaId": "2f4fda1c-fe7f-4992-9ae8-d08426482fea",
        "isThumbnail": true,
        "isHero": true,
        "sortOrder": 0,
        "media": {
          "id": "2f4fda1c-fe7f-4992-9ae8-d08426482fea",
          "path": "/images/models/stadtvilla/22-140-000/gallery/stadtvilla-22-140-000-gallery-sv-02.webp",
          "alt": null,
          "width": 2400,
          "height": 1350,
          "isAi": false,
          "createdAt": "2026-05-21T03:39:43.536Z"
        }
      }
    ]
  },
  {
    "name": "Bungalow",
    "slug": "bungalow",
    "description": null,
    "media": [
      {
        "id": "2d455196-5ab3-4ccd-9f91-23ad875b6c3c",
        "categoryId": "a4bca71f-dd16-446f-9d37-2c12ab2852d0",
        "mediaId": "61bf2f6c-db09-4588-817b-d4e9eea7ce39",
        "isThumbnail": true,
        "isHero": true,
        "sortOrder": 0,
        "media": {
          "id": "61bf2f6c-db09-4588-817b-d4e9eea7ce39",
          "path": "/images/models/bungalow/22-116-000/gallery/bungalow-22-116-000-gallery-bu-01.webp",
          "alt": null,
          "width": 2400,
          "height": 1351,
          "isAi": false,
          "createdAt": "2026-05-21T03:39:43.536Z"
        }
      }
    ]
  },
  {
    "name": "Doppelhaus",
    "slug": "doppelhaus",
    "description": null,
    "media": [
      {
        "id": "29d9aa91-369c-455f-9ab3-db9332632eb2",
        "categoryId": "e4fd02c5-da80-47b4-b40b-8588266427cf",
        "mediaId": "35963f5e-d77e-4f7c-a681-bbc16d3dc536",
        "isThumbnail": true,
        "isHero": true,
        "sortOrder": 0,
        "media": {
          "id": "35963f5e-d77e-4f7c-a681-bbc16d3dc536",
          "path": "/images/models/doppelhaus/25-138-210/gallery/doppelhaus-25-138-210-gallery-dhh-2-1.webp",
          "alt": null,
          "width": 2400,
          "height": 1350,
          "isAi": false,
          "createdAt": "2026-05-21T03:39:43.536Z"
        }
      }
    ]
  },
  {
    "name": "Generationenhaus",
    "slug": "generationenhaus",
    "description": null,
    "media": [
      {
        "id": "cf232fbb-31f1-4481-8f01-9478fed7bc56",
        "categoryId": "7d2ccb1e-35a9-4bd3-aae0-c05c1efd9ad4",
        "mediaId": "84af4b22-12b0-4354-abda-82c449443fef",
        "isThumbnail": true,
        "isHero": true,
        "sortOrder": 0,
        "media": {
          "id": "84af4b22-12b0-4354-abda-82c449443fef",
          "path": "/images/models/generationenhaus/30-223-160/gallery/generationenhaus-30-223-160-gallery-gen-1.webp",
          "alt": null,
          "width": 2400,
          "height": 1350,
          "isAi": false,
          "createdAt": "2026-05-21T03:39:43.536Z"
        }
      }
    ]
  },
  {
    "name": "Zweifamilienhaus",
    "slug": "zweifamilienhaus",
    "description": null,
    "media": [
      {
        "id": "71c2b9c0-d0ac-468a-9332-c84856ccb8a9",
        "categoryId": "2ecff00f-3616-472f-b2a1-ecbd54b37662",
        "mediaId": "dc729ac7-ee54-4bc3-99d9-0659ff2fda97",
        "isThumbnail": true,
        "isHero": true,
        "sortOrder": 0,
        "media": {
          "id": "dc729ac7-ee54-4bc3-99d9-0659ff2fda97",
          "path": "/images/models/zweifamilienhaus/22-282-0/gallery/zweifamilienhaus-22-282-0-gallery-hero.webp",
          "alt": "Zweifamilienhaus 22-282 Außenansicht",
          "width": 2400,
          "height": 1696,
          "isAi": false,
          "createdAt": "2026-05-21T23:15:38.420Z"
        }
      }
    ]
  },
  {
    "name": "Mehrfamilienhaus",
    "slug": "mehrfamilienhaus",
    "description": "",
    "media": [
      {
        "id": "ba1b44d0-48aa-45d8-87e3-8ec3ab3f8f67",
        "categoryId": "efae66a4-889b-4196-b902-53ae75fae566",
        "mediaId": "5b3a413d-d80e-42c1-aafe-5e9ed1bd20f8",
        "isThumbnail": true,
        "isHero": true,
        "sortOrder": 0,
        "media": {
          "id": "5b3a413d-d80e-42c1-aafe-5e9ed1bd20f8",
          "path": "/images/models/mehrfamilienhaus/satteldorf/satteldorf-12-familienhaus.webp",
          "alt": "12-Familienwohnhaus Satteldorf",
          "width": 2400,
          "height": 1465,
          "isAi": false,
          "createdAt": "2026-08-10T12:42:29.492Z"
        }
      }
    ]
  },
  {
    "name": "Kubus",
    "slug": "kubus",
    "description": null,
    "media": [
      {
        "id": "caf85304-0220-46e8-b340-88ef636f1b0f",
        "categoryId": "2de14b12-7e99-4aab-b9bd-3112d03c39a0",
        "mediaId": "00096428-3da9-4616-a44e-d5f3113a3656",
        "isThumbnail": true,
        "isHero": true,
        "sortOrder": 0,
        "media": {
          "id": "00096428-3da9-4616-a44e-d5f3113a3656",
          "path": "/images/models/kubus/0-278/gallery/kubus-0-278-gallery-kubus-278-0-0.webp",
          "alt": null,
          "width": 2400,
          "height": 1696,
          "isAi": false,
          "createdAt": "2026-05-21T03:39:43.536Z"
        }
      }
    ]
  }
] satsifies Omit<HouseCategory, "id">[];