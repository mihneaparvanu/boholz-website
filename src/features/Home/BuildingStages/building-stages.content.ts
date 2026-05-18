import type { BuildingStage } from "./building-stages.types";
import { getMediaURL } from "@/utils/media";

const baseMediaURL = getMediaURL("/images/stages");

export const buildingStages: BuildingStage[] = [
  {
    slug: "ausbauhaus",
    title: "Ausbauhaus",
    description:
      "Sie möchten selbst Hand anlegen? Wir liefern den Rohbau wetterfest und winddicht – Sie übernehmen den Innenausbau in Ihrem Tempo und sparen dabei spürbar Kosten.",
    imageURL: `${baseMediaURL}/shell.webp`,
  },
  {
    slug: "technikfertig",
    title: "Technikfertig",
    description:
      "Wir installieren die komplette Haustechnik – Heizung, Elektrik und Rohinstallation für Sanitär. Sie gestalten Wände, Böden und Oberflächen ganz nach Ihrem persönlichen Geschmack.",
    // Image intentionally null until a clean variant arrives — renderer
    // falls back to <ImagePlaceholder> automatically.
    imageURL: null,
  },
  {
    slug: "fast-fertig",
    title: "Fast fertig",
    description:
      "Nahezu bezugsfertig – nur die letzten Feinheiten wie Bodenbeläge und Wandgestaltung bleiben Ihnen überlassen. Eine ausgewogene Balance aus Eigenleistung und Komfort.",
    imageURL: `${baseMediaURL}/nearly-complete.webp`,
  },
  {
    slug: "schluesselfertig",
    title: "Schlüsselfertig",
    description:
      "Vom ersten Entwurf bis zum Einzug – wir übernehmen alles. Sie wählen die Einweihungsparty, wir bauen den Rest. Ihr BoHolz Haus wird schlüsselfertig und komplett bezugsfertig übergeben.",
    imageURL: `${baseMediaURL}/turnkey.webp`,
  },
];
