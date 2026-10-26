/**
 * Per-model editorial copy from the printed BoHolz house catalogue
 * (Katalog_Häuser_Oktober_2026.pdf). BoHolz's own wording — nothing here was
 * written for the website.
 *
 * Ten of the catalogue's twenty models are present. The catalogue is a
 * two-column layout and text extraction interleaves the prose with the
 * Hausdaten table on many spreads, merging words and reordering sentences.
 * Every string below was read end to end; models whose text could not be
 * recovered intact were left out rather than published broken, and three
 * (22-173-190, 25-168-190, 21-349-225) still need transferring by hand.
 *
 * Kubus and the newer models have no catalogue page at all.
 *
 * Repairs: the catalogue's own typo "jetzt mir mehr Platz" reads "mit" here,
 * and two entries end one sentence early where the extraction corrupted the
 * final line.
 */
export type ModelStory = {
  tagline: string;
  body: string;
};

export const modelStories: Record<string, ModelStory> = {
  "bungalow-22-134": {
    tagline: "Ein einzigartiger Ausblick.",
    body: "Das verschafft Ihnen dieser grandiose Bungalowentwurf. Seine bis zum Boden reichenden, großen Fensterfronten lassen nicht nur Sonnenlicht in den Wohnbereich hinein, sondern geben auch einen wunderbaren Ausblick in den Garten. Alternativ kann auch eine Einliegerwohnung oder ein separat abgetrennter Homeoffice-Bereich eingeplant werden. Die variablen Anpassungsmöglichkeiten machen dieses Hauskonzept so besonders.",
  },
  "doppelhaus-28-299": {
    tagline: "Das Doppelhaus für gehobene Ansprüche.",
    body: "Das Erdgeschoss überzeugt auf ganzer Linie. Mit seinem Wohn- und Essbereich auf 42 m² Wohnfläche und zwei eingeplanten Terrassenausgängen bietet es genug Platz, um der Mittelpunkt des Alltags zu werden. Ein zum Gästezimmer änderbares Arbeitszimmer wie auch der große Haustechnikraum komplettieren den Grundriss im Erdgeschoss. Ein Obergeschoss ganz ohne störende Dachschrägen finden Sie in diesem Hauskonzept. Das Elternschlafzimmer wird ergänzt durch eine Ankleide aber auch die beiden großzügigen Kinderzimmer bieten Platz für Spiel und Spaß. Das große Familienbadezimmer lädt zum Verweilen ein. Für die moderne Familie. Mit einer Wohnfläche von rund 165 m² und seinen intelligenten Details bietet dieser schicke Hausentwurf alles, was eine moderne Familie zum heutigen Leben benötigt.",
  },
  "doppelhaus-38-238-125": {
    tagline: "Doppelt hält besser.",
    body: "Dieser moderne Doppelhausentwurf besticht vor allem durch seine optische Finesse. Die dominante Eingangsüberdachung, die fließend in das Carport übergeht, verleiht diesem Grundriss geometrische Gleichheit. Egal, ob Sie mit bereits vorausgewählten Baupartnern bauen oder im Nachhinein vermieten möchten – mit diesem Konzept sind Sie flexibel. Die Wohnfläche an sich bietet mit seiner klassischen Planung den Wohn- und Essbereich im Erdgeschoss und Schlafräumen im Obergeschoss Platz für alle Familienmitglieder.",
  },
  "einfamilienhaus-22-162-190": {
    tagline: "Einfamilienhaus mit Homeoffice-Konzept – flexibel für jeden Anspruch.",
    body: "Durch seine geplante Homeoffice-Nutzung wird der Grundriss in Gänze bereits anders geplant. Mit viel Ruhe für die anstehende Arbeitswelt ist das Homeoffice in einem für sich liegenden, separaten Bereich im Erdgeschoss untergebracht, um selbst bei Trubel ungestört arbeiten zu können. Der zentrale Mittelpunkt des täglichen Lebens spiegelt sich im Wohn- und Essbereich wider. Die angrenzende, jedoch teilweise abgetrennte Küche bietet einen perfekten Rückzugsort. Vor allem durch die bis zum Boden reichenden Fenster wird die Wohnfläche hell erleuchtet.",
  },
  "einfamilienhaus-28-194-170": {
    tagline: "Gemeinsam wohnen.",
    body: "Eigenständig leben. Dieses Haus schafft Raum für Nähe und zugleich für ein selbstständiges Leben unter einem Dach. Die separate Einliegerwohnung eignet sich ideal für Eltern, erwachsene Kinder, als Büro oder als zusätzliche Einnahmequelle durch Vermietung. Die große Hauptwohnung überzeugt mit einem offen gestalteten Wohn- und Essbereich, einem zusätzlichen Arbeits- oder Gästezimmer sowie drei Schlafzimmern im Dachgeschoss.",
  },
  "einfamilienhaus-35-146-150": {
    tagline: "Akzente setzen ist das Stichwort.",
    body: "Dieses Haus besticht nicht nur durch seine moderne wie auch zeitlose Bauweise, sondern auch durch seine optische Abgrenzung. Ein offener Wohn- und Essbereich mit offener Küche ist der perfekte Ort für Familienabende. Von Spieleabend bis zum Festmahl sind der Belebung dieser Räume keine Grenzen gesetzt. Das eingeplante Gäste- oder auch Arbeitszimmer erschafft neue Möglichkeiten der räumlichen Nutzung und schafft einen Rückzugsraum im unteren Wohnbereich. Eine Wellness-Oase unter dem heimischen Dach?",
  },
  "einfamilienhaus-35-181-150": {
    tagline: "Ein harmonisches Miteinander.",
    body: "Das ist es, was sich jede Familie wünscht. Mit unserem Hausentwurf bieten wir hierfür gleich vier großzügig geschnittene Kinderzimmer an. Die zeitlose und doch moderne Bauweise verleiht diesem Grundriss seinen Charme. Mit seinen beiden bodentiefen Fenstern sorgt dieser für optimalen Lichteinfall. Intelligent durchdacht befindet sich das Arbeitszimmer im Erdgeschoss in der Nähe des Hauseingangs. Alternativ kann auch eine Einliegerwohnung oder ein separat abgetrennter Homeoffice-Bereich eingeplant werden.",
  },
  "einfamilienhaus-38-128-125": {
    tagline: "Wir haben es optimiert – jetzt mit mehr Platz.",
    body: "Aus rund 117 m² Wohnfläche haben Sie nun noch mehr Möglichkeiten sich frei zu entfalten. Im Erdgeschoss sind vor allem die familiäre Nähe und die Kommunikation der Mittelpunkt der Wohnfläche. Im Obergeschoss bieten sich Rückzugsmöglichkeiten für jeden Einzelnen. Verlorener Platz, wie beispielsweise durch große, raumnehmende Flure, werden Sie in diesem Haus nicht finden. Wir optimieren den Wohnraum Ihres täglichen Wohnbedarfs und maximieren so Ihr Wohngefühl in Ihrem neuen Zuhause.",
  },
  "einfamilienhaus-45-139-75": {
    tagline: "Aller guten Dinge sind Drei.",
    body: "In diesem Fall – drei Giebel! Ob offene Galerie oder eine Leseecke - Ihren gestalterischen Fähigkeiten lässt dieser Hausentwurf freien Raum. Mit einer Grundwohnfläche von 41 m² im Erdgeschoss, auf denen sich Wohnzimmer, Esszimmer und Küche befinden, lassen sich gemeinsame Abende jetzt schon erträumen. Auch ein Gäste- bzw. Arbeitszimmer findet hier seinen Platz. Auf dem Balkon verweilen - das hört sich nicht nur traumhaft an, sondern ist mit diesem eleganten und zeitgenössischen Wohntraumbeispiel möglich! Darf es ein Tupfen Farbe sein? Durch sein farblich abgesetztes Zwerchhaus fällt dieses modern geschnittene und designte Haus in Ihrer Nachbarschaft jedem ins Auge.",
  },
  "stadtvilla-22-166": {
    tagline: "Die Stadtvilla neu erleben.",
    body: "Dieser Hausentwurf erfreut sich stetig wachsender Beliebtheit. Mit seinen zwei Vollgeschossen und dem eleganten und modern wirkenden Außenauftritt begeistern sich immer mehr Baufamilien von dieser traumhaften Wohnvariante. Eine perfekt auf die Bedürfnisse einer Familie zugeschnittene Grundwohnfläche von knapp 165 m² lässt keine Wünsche mehr offen.",
  },
};

export const getModelStory = (slug: string): ModelStory | undefined =>
  modelStories[slug];
