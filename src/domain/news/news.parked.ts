import type { NewsPost } from "./news.types";
import { getMediaURL } from "@/lib/media";

export const parkedNews = [
  {
    slug: "aprilt-richtfest-in-7177-steinheim",
    title: "30.04.2026 Richtfest in 71711 Steinheim a.d. Murr – Kleinbottwar",
    content:
      "Ein Richtfest ist ein besonderer Moment einer jeden Baufamilie und eine alte Tradition, die wir gerne mit unseren Bauinteressenten teilen möchten.\n\nWir freuen uns Sie herzlich bei diesem Event begrüßen zu dürfen. Für das leibliche Wohl ist bestens gesorgt.\n\nFür weitere Informationen stehe ich Ihnen gerne telefonisch oder per E-Mail zur Verfügung.\n\nMobil: 0176 621 265 25  \nE-Mail: [m.dittrich@boholz-haus.de](mailto:m.dittrich@boholz-haus.de)\n\nIhr  \nMichael Dittrich",
    excerpt: null,
    publishedAt: "2024-07-15T09:06:21.000Z",
    media: [],
  },
  {
    slug: "april-richtfest-in-75242-muenisngen",
    title: "04. April 2026 Richtfest in 75242 Münsingen",
    content:
      "Ein Richtfest ist ein besonderer Moment einer jeden Baufamilie und eine alte Tradition, die wir gerne mit unseren Bauinteressenten teilen möchten.\n\nWir freuen uns Sie herzlich bei diesem Event begrüßen zu dürfen. Für das leibliche Wohl ist bestens gesorgt.\n\nFür weitere Informationen stehe ich Ihnen gerne telefonisch oder per E-Mail zur Verfügung.\n\nMobil: 0176 621 265 25  \nE-Mail: [m.dittrich@boholz-haus.de](mailto:m.dittrich@boholz-haus.de)\n\nIhr  \nMichael Dittrich",
    excerpt: null,
    publishedAt: "2024-07-15T09:07:21.000Z",
    media: [],
  },
  {
    slug: "april-2026-stelltermin-in-steinheim-a-d-murr",
    title: "27.04.2026 Stelltermin in Steinheim a.d. Murr – Kleinbottwar",
    content:
      '<p>Im April 2026 wird das Haus meiner Bauherrenfamilie aufgestellt.</p>\n<p>Wenn Sie Zeit und Lust haben, kommen Sie vorbei und überzeugen sich selbst, von der anspruchsvollen Architektur und der hochwertigen Qualität des Hauses. Für weitere Informationen kontaktieren Sie mich gerne persönlich über Telefon oder E-Mail-Kontakt.</p>\n<p><strong>Mobil: </strong><a href="tel:+491711280274">0176 621 26 525</a><strong><br />\nE-Mail:</strong> <a href="mailto:d.wissmann@boholz-haus.de">m.dittrich@boholz-haus.de</a></p>\n<p>Ihr Michael Dittrich</p>\n',
    excerpt: null,
    publishedAt: "2024-11-27T10:00:52.000Z",
    media: [
      {
        path: getMediaURL(
          "/images/news/april-2026-stelltermin-in-steinheim-a-d-murr/cover.webp",
        ),
        alt: "Stelltermin Steinheim",
        height: 440,
        width: 600,
        isHero: true,
        isAi: false,
      },
    ],
  },
  {
    slug: "mai-samstag-02-05-2026-werksfuehrung-bei-keitel-haus",
    title: "Samstag, den 02.05.2026 Werksführung bei Keitel-Haus",
    content:
      '<p>Die Keitel-Haus GmbH ermöglicht interessierten Bauherrinnen und Bauherren in regelmäßigen Abständen sich selbst ein Bild von der Qualität der produzierten Fertighäuser zu machen.</p>\n<p>Wir laden Sie somit herzlich ein, sich das Werk der Keitel-Haus GmbH in 74585 Rot am See-Brettheim bei der nächsten öffentlichen Führung (Beginn: 10:00 Uhr) anzusehen.</p>\n<p>Bei Interesse melden Sie sich bitte bei BoHolz-Haus unter: <a href="mailto:info@boholz-haus.de">info@boholz-haus.de</a></p>\n',
    excerpt: null,
    publishedAt: "2026-05-02T12:00:00.000Z",
    media: [
      {
        path: getMediaURL(
          "/images/news/mai-samstag-02-05-2026-werksfuehrung-bei-keitel-haus/cover.webp",
        ),
        alt: "Werksführung bei Keitel-Haus",
        height: 3000,
        width: 4000,
        isHero: true,
        isAi: false,
      },
    ],
  },
] satisfies NewsPost[];
