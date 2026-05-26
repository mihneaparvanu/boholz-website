import type { IconListItem } from "@/ui/primitives/IconList.vue";
import type { Section } from "@/features/section-navigator/SectionNavigator.vue";
import { keitel } from '@/features/faq/keitel';

// Anchor ids are German-umlaut-normalised per CLAUDE.md (ü → ue, ä → ae).
export const sections: Section[] = [
  { id: "taetigkeitsfeld", eyebrow: "01", label: "Tätigkeitsfeld" },
  { id: "vorteile", eyebrow: "02", label: "Ihre Vorteile" },
  { id: "stellen", eyebrow: "03", label: "Offene Stellen" },
];

// PLACEHOLDER COPY — brand-toned but needs sign-off.
export const taetigkeitsfeld: IconListItem[] = [
  {
    icon: "heart-handshake",
    label: "Wohnträume verwirklichen",
    description:
      "Sie begleiten Bauherrinnen und Bauherren von der ersten Idee bis zum Vertragsabschluss — als verlässlicher Ansprechpartner, der zuhört, plant und persönlich liefert.",
  },
  {
    icon: "users",
    label: "Neue Interessenten gewinnen",
    description:
      "Sie sprechen aktiv Familien, Paare und Senioren an, präsentieren BoHolz auf Hausbau-Messen und auf unseren Musterhaus-Standorten.",
  },
  {
    icon: "compass",
    label: "Beratung & Bedarfsanalyse",
    description:
      "Sie nehmen sich Zeit für gute Gespräche und entwickeln gemeinsam mit dem Bauherrn ein Konzept, das wirklich zu seiner Lebenslage passt.",
  },
  {
    icon: "hammer",
    label: "Vom Entwurf zum Vertrag",
    description:
      "Sie koordinieren Planung, Finanzierungsfragen und technische Klärung mit unserem Innendienst — bis das Haus baureif ist.",
  },
];

// PLACEHOLDER COPY — brand-toned but needs sign-off.
export const vorteile: IconListItem[] = [
  {
    icon: "award",
    label: "90 Jahre Holzbau-Kompetenz",
    description: keitel("karriereVorteilBullet"),
  },
  {
    icon: "target",
    label: "Leadorientiertes Marketing",
    description:
      "Wir sorgen für qualifizierte Anfragen aus Ihrer Region — Sie konzentrieren sich auf das, was Sie am besten können: persönlich beraten und abschließen.",
  },
  {
    icon: "sparkles",
    label: "Starke Alleinstellungsmerkmale",
    description:
      "Premium-Holzbau, klare Ausbaustufen, ausgezeichnetes Preis-Leistungs-Verhältnis — Argumente, die im Verkaufsgespräch tragen.",
  },
  {
    icon: "heart-handshake",
    label: "Familiäre Vertriebsstruktur",
    description:
      "Kurze Wege zum Innendienst in Bad Kissingen, klare Zuständigkeiten, kollegiale Unterstützung — kein Konzern-Ping-Pong.",
  },
  {
    icon: "map-pin",
    label: "Eigenes Vertriebsgebiet",
    description:
      "Sie übernehmen Verantwortung für eine klar zugeschnittene Region und bauen langfristige Kundenbeziehungen vor Ort auf.",
  },
];
