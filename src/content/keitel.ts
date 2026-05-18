/**
 * Site-wide toggle for the Keitel-Haus partner brand mentions. Client asked
 * to hide them in 2026-05; flip `SHOW_KEITEL_HAUS` to `true` to restore.
 */
export const SHOW_KEITEL_HAUS = false;

const copy = {
  versprechenTraditionLede: {
    with: "Unser starker Partner Keitel-Haus greift auf jahrelanges und generationenübergreifendes Wissen rund um den Fertighausbau zurück. Dies gewährleistet handwerkliche Wertarbeit im traditionellen Sinne, kombiniert mit modernster Technologie.",
    without:
      "BoHolz vereint jahrzehntelanges Wissen rund um den Fertighausbau mit moderner CNC-Fertigung. Das Ergebnis: handwerkliche Wertarbeit im traditionellen Sinne, getragen von einer Manufaktur, die jeden Schritt selbst verantwortet.",
  },
  versprechenTraditionCard: {
    with: "Generationsübergreifendes Wissen und Kompetenz rund um den Fertighausbau — handwerkliche Wertarbeit im traditionellen Sinne, getragen vom Partner Keitel-Haus.",
    without:
      "Generationsübergreifendes Wissen rund um den Fertighausbau — handwerkliche Wertarbeit im traditionellen Sinne, getragen von einer eigenständigen Manufaktur in Deutschland.",
  },
  zuhauseArchitektur: {
    with: "In Zusammenarbeit mit der renommierten Keitel-Haus GmbH in Rot am See-Brettheim, dem Geburtsort und der Produktionsstätte jedes BoHolz-Hauses, bieten wir Ihnen die perfekte Partnerschaft zweier starker Unternehmen. Diese Kooperation garantiert höchste Qualitätsstandards und jahrzehntelange Erfahrung im Fertighausbau.",
    without:
      "Jedes BoHolz-Haus wird in Rot am See-Brettheim gefertigt — von einer Manufaktur, die jeden Schritt selbst verantwortet. Jahrzehntelange Erfahrung im Fertighausbau und höchste Qualitätsstandards sind dabei keine Versprechen, sondern Voraussetzung.",
  },
  karriereVorteilBullet: {
    with: "Sie verkaufen ein Produkt, hinter dem ein gewachsenes Familienunternehmen und unser Partner Keitel Haus mit jahrzehntelanger Erfahrung stehen.",
    without:
      "Sie verkaufen ein Produkt, hinter dem ein gewachsenes Familienunternehmen mit jahrzehntelanger Erfahrung steht.",
  },
  uberUnsPartnerLede: {
    with: "BoHolz-Haus ist die Vertriebsgesellschaft, Keitel Haus der Produzent. Was Sie unterschreiben, hat ein Gesicht — und 90 Jahre Holzbau hinter sich.",
    without:
      "BoHolz-Haus übernimmt Vertrieb und Begleitung; produziert wird in unserer eigenen Manufaktur in Rot am See-Brettheim. Was Sie unterschreiben, hat ein Gesicht — und 90 Jahre Holzbau hinter sich.",
  },
  uberUnsLeadProse: {
    with: "Vom ersten Entwurf bis zum unterschriebenen Vertrag begleitet Sie ein erfahrener Hausberater — persönlich, präzise, ohne Umwege. Unser Partner Keitel Haus baut seit über 90 Jahren in Holz: ein Familienunternehmen aus Rot am See-Brettheim, das den Baustoff kennt wie wenige andere.",
    without:
      "Vom ersten Entwurf bis zum unterschriebenen Vertrag begleitet Sie ein erfahrener Hausberater — persönlich, präzise, ohne Umwege. Wir bauen seit über 90 Jahren in Holz: ein Familienunternehmen aus Rot am See-Brettheim, das den Baustoff kennt wie wenige andere.",
  },
  uberUnsStatCaption: {
    with: "Erfahrung unseres Partners Keitel Haus aus Rot am See-Brettheim.",
    without: "Erfahrung aus unserer Manufaktur in Rot am See-Brettheim.",
  },
  uberUnsQuoteAuthor: {
    with: "BoHolz-Haus & Keitel Haus",
    without: "BoHolz-Haus",
  },
  uberUnsWasWirTunLede: {
    with: "Familien, Paare, Singles, Senioren — wir planen für die, die bauen. Mit Keitel Haus an unserer Seite bringen wir Kompetenz, Erfahrung und ein durchdachtes Komplettpaket auf Ihren Bauplatz.",
    without:
      "Familien, Paare, Singles, Senioren — wir planen für die, die bauen. Wir bringen Kompetenz, Erfahrung und ein durchdachtes Komplettpaket auf Ihren Bauplatz.",
  },
  qaWerksfuehrung: {
    with: "<p>Ja, mit unseren Kunden vereinbaren wir regelmäßige Werksführungen bei unserem starken Partner Keitel-Haus in 74585 Rot am See-Brettheim (bei Rothenburg o.d. Tauber). Gerne können Sie auf Wunsch auch persönliche Einzeltermine vereinbaren.</p>",
    without:
      "<p>Ja, mit unseren Kunden vereinbaren wir regelmäßige Werksführungen in unserer Manufaktur in 74585 Rot am See-Brettheim (bei Rothenburg o.d. Tauber). Gerne können Sie auf Wunsch auch persönliche Einzeltermine vereinbaren.</p>",
  },
} as const;

export type KeitelKey = keyof typeof copy;

export const keitel = (key: KeitelKey): string =>
  SHOW_KEITEL_HAUS ? copy[key].with : copy[key].without;
