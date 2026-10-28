/**
 * Page copy for `/hauser`.
 *
 * Register is invitation, not description: every model already carries its
 * own catalogue paragraph in `house_models.description`, and each category
 * carries one too. So nothing here may name a room, a dimension or a single
 * entwurf — this copy's only job is to get the visitor to open a house.
 *
 * The counts under the lede are derived from the live DB in the page
 * frontmatter, which is why no number is written here.
 */
export interface HousesIntroCopy {
  eyebrow: string;
  heading: string;
  lede: string;
}

export const housesIntro: HousesIntroCopy = {
  eyebrow: "Alles entdecken, für Sie gebaut",
  heading: "Unsere Häuser",
  lede: "Vom Bungalow bis zum Mehrfamilienhaus — entdecken Sie unsere Haustypen aus Holz, individuell für Sie geplant und schlüsselfertig gebaut. Öffnen Sie die Häuser, die Ihnen ins Auge fallen, sehen Sie sich Ansichten und Grundrisse an, vergleichen Sie in Ruhe. Den Rest klären wir im Gespräch.",
};
