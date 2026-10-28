/**
 * Copy for the two ways into the model set on `/hauser` — the view switch
 * and the short invitation above whichever view is active.
 *
 * Same register rule as `houses-intro.content.ts`: invitation into the set,
 * never description of a house. `house_models.description` owns the editorial
 * paragraph for each entwurf and this copy must not restate it.
 *
 * The filter list in `filter.body` tracks `filter-panel.options.ts`. If a
 * filter option is added or dropped there, this sentence is wrong.
 */
export interface HousesViewCopy {
  /** Label on the view-switch tab. */
  tab: string;
  heading: string;
  body: string;
}

export interface HousesViewsCopy {
  explore: HousesViewCopy;
  filter: HousesViewCopy;
}

export const housesViews: HousesViewsCopy = {
  explore: {
    tab: "Nach Haustyp entdecken",
    heading: "Fangen Sie beim Haustyp an.",
    body: "Bungalow, Stadtvilla, Doppelhaus — jeder Haustyp wohnt sich anders. Wählen Sie den, der zu Ihrem Grundstück und Ihrem Alltag passt, und sehen Sie sich die Entwürfe dazu in Ruhe an.",
  },
  filter: {
    tab: "Alle Modelle filtern",
    heading: "Oder sehen Sie sich alles an.",
    body: "Jeder Entwurf auf einer Seite — filterbar nach Wohnfläche, Geschossen, Dachform oder Einliegerwohnung. Behalten Sie, was Ihnen gefällt, und blenden Sie den Rest aus.",
  },
};
