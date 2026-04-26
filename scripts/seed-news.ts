/**
 * Seed script for 3 test news articles.
 * Run with: npx tsx --env-file=.env scripts/seed-news.ts
 */

import { db } from "../src/db/db";
import { news } from "../src/db/schema";

const ARTICLES = [
  {
    title: "BoHolz Haus eröffnet neues Musterhaus in München",
    slug: "musterhaus-muenchen-eroeffnung",
    excerpt:
      "Wir freuen uns, die Eröffnung unseres neuen Musterhauses in München bekannt zu geben – ein Ort, an dem Sie unsere Holzhaustechnologie hautnah erleben können.",
    content: `## Ein neues Zuhause für Ihre Träume

Unser neues Musterhaus in München öffnet am 15. Mai 2026 seine Türen. Auf über **180 m²** zeigen wir Ihnen, wie modernes Bauen mit nachhaltigen Holzbaustoffen aussehen kann.

### Was Sie erwartet

- Geführte Touren jeden Samstag von 10–16 Uhr
- Beratungsgespräche mit unseren Architekten
- Live-Demo unserer Energieeffizienz-Technologie

> "Holz ist der Baustoff der Zukunft – und BoHolz Haus macht ihn alltagstauglich."

Wir freuen uns auf Ihren Besuch!`,
    isPublished: true,
    publishedAt: new Date("2026-04-20T09:00:00Z"),
  },
  {
    title: "Nachhaltigkeit im Fokus: Unser CO₂-neutraler Bauprozess",
    slug: "nachhaltig-bauen-co2-neutral",
    excerpt:
      "Wie BoHolz Haus durch konsequenten Einsatz von Holz und erneuerbaren Energien einen nahezu CO₂-neutralen Bauprozess realisiert.",
    content: `## Bauen ohne schlechtes Gewissen

Der Bausektor ist für etwa **38 %** der globalen CO₂-Emissionen verantwortlich. Wir bei BoHolz Haus haben uns zum Ziel gesetzt, diesen Wert drastisch zu senken.

### Unsere Maßnahmen

1. **Regionale Holzlieferanten** – kurze Transportwege, lokale Wertschöpfung
2. **Vorfertigung im Werk** – weniger Abfall auf der Baustelle
3. **Photovoltaik-Integration** – ab Werk optional in jedes Modell integrierbar
4. **Zertifizierte PEFC-Hölzer** – ausschließlich aus nachhaltig bewirtschafteten Wäldern

### Das Ergebnis

Ein Einfamilienhaus von BoHolz Haus speichert im Laufe seiner Lebenszeit mehr CO₂ als bei seiner Herstellung freigesetzt wird. Das nennen wir echten Klimaschutz.`,
    isPublished: true,
    publishedAt: new Date("2026-04-10T08:00:00Z"),
  },
  {
    title: "Neue Modelle 2026: Kubus und Stadtvilla neu interpretiert",
    slug: "neue-modelle-2026-kubus-stadtvilla",
    excerpt:
      "Für das Jahr 2026 präsentiert BoHolz Haus eine überarbeitete Kubus-Linie sowie eine neu gestaltete Stadtvilla-Serie mit erweiterten Grundrissvarianten.",
    content: `## Frischer Wind im Katalog

Das Jahr 2026 bringt zwei komplett überarbeitete Modellreihen – mit modernerem Design, besserer Raumaufteilung und neuen Dachoptionen.

### Kubus 2026

Die neue Kubus-Linie besticht durch klare Linien und großzügige Verglasungen. Highlights:

- Flachdach oder Pultdach wählbar
- Wohnflächen von 120 bis 220 m²
- Optionaler Kniestock für mehr Raumhöhe im Obergeschoss

### Stadtvilla 2026

Die Stadtvilla-Serie wurde um drei neue Grundrisse erweitert:

| Modell | Wohnfläche | Schlafzimmer |
|--------|-----------|-------------|
| SV-160 | 160 m²    | 3           |
| SV-190 | 190 m²    | 4           |
| SV-220 | 220 m²    | 5           |

Alle Modelle sind ab sofort im [Hauskatalog](/hauser) verfügbar.`,
    isPublished: true,
    publishedAt: new Date("2026-04-05T10:00:00Z"),
  },
];

async function main() {
  console.log("Seeding test news articles...");

  for (const article of ARTICLES) {
    await db.insert(news).values(article).onConflictDoNothing();
    console.log(`  ✓ "${article.title}"`);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
