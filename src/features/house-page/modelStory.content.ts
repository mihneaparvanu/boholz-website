/**
 * Per-model editorial copy from the printed BoHolz house catalogue
 * (Katalog_Häuser_Oktober_2026.pdf). BoHolz's own wording — nothing here was
 * written for the website.
 *
 * Transcribed from the rendered catalogue pages, not from extracted text. The
 * catalogue is set in two columns, and every text-extraction route interleaved
 * the prose with the Hausdaten table: words fused across the column gutter and
 * sentences arrived out of order. One such artefact had moved a sentence from
 * another model onto Doppelhaus 28-299, stating a living area that is not that
 * house's. Reading the pages as images is what caught it.
 *
 * Every catalogue model that exists in the database is present. The four that
 * are not (Stadtvilla 22-160, Zweifamilienhaus 22-282, Bungalow 28-123 and
 * 22-141) have no row to attach to; Kubus and the newer models have no
 * catalogue page.
 *
 * One repair: the catalogue's own typo "jetzt mir mehr Platz" reads "mit".
 */
export type ModelStory = {
  tagline: string;
  body: string;
};

export const modelStories: Record<string, ModelStory> = {
  "einfamilienhaus-38-128-125": {
    tagline: "Wir haben es optimiert – jetzt mit mehr Platz.",
    body: "Aus rund 117 m² Wohnfläche haben Sie nun noch mehr Möglichkeiten sich frei zu entfalten. Im Erdgeschoss sind vor allem die familiäre Nähe und die Kommunikation der Mittelpunkt der Wohnfläche. Im Obergeschoss bieten sich Rückzugsmöglichkeiten für jeden Einzelnen. Verlorener Platz, wie beispielsweise durch große, raumnehmende Flure, werden Sie in diesem Haus nicht finden. Wir optimieren den Wohnraum Ihres täglichen Wohnbedarfs und maximieren so Ihr Wohngefühl in Ihrem neuen Zuhause.",
  },
  "einfamilienhaus-38-138-125": {
    tagline: "Klassische Architektur.",
    body: "Das bietet dieser Hausentwurf mit seinen bodentiefen Fenstern mit rundum Blick und sonnigen Räumen. Mit seinem offenen und großzügigen Grundriss bietet dieser Einfamilienhausentwurf Platz für allerhand Gestaltungsmöglichkeiten. So zum Beispiel mit seiner offenen Wohnküche, die auf unschlagbaren 41 m² der ganzen Familie Platz bietet. Durch die sich im Obergeschoss befindlichen Kinderzimmer mit ihrer durchdachten Planung, ist für jeden genügend Platz. Auch für die Eltern. Ein Haus für die Familie.",
  },
  "einfamilienhaus-45-139-75": {
    tagline: "Aller guten Dinge sind Drei. In diesem Fall – drei Giebel!",
    body: "Ob offene Galerie oder eine Leseecke - Ihren gestalterischen Fähigkeiten lässt dieser Hausentwurf freien Raum. Mit einer Grundwohnfläche von 41 m² im Erdgeschoss, auf denen sich Wohnzimmer, Esszimmer und Küche befinden, lassen sich gemeinsame Abende jetzt schon erträumen. Auch ein Gäste- bzw. Arbeitszimmer findet hier seinen Platz. Auf dem Balkon verweilen - das hört sich nicht nur traumhaft an, sondern ist mit diesem eleganten und zeitgenössischen Wohntraumbeispiel möglich! Darf es ein Tupfen Farbe sein? Durch sein farblich abgesetztes Zwerchhaus fällt dieses modern geschnittene und designte Haus in Ihrer Nachbarschaft jedem ins Auge.",
  },
  "einfamilienhaus-35-146-150": {
    tagline: "Akzente setzen ist das Stichwort.",
    body: "Dieses Haus besticht nicht nur durch seine moderne wie auch zeitlose Bauweise, sondern auch durch seine optische Abgrenzung. Ein offener Wohn- und Essbereich mit offener Küche ist der perfekte Ort für Familienabende. Von Spieleabend bis zum Festmahl sind der Belebung dieser Räume keine Grenzen gesetzt. Das eingeplante Gäste- oder auch Arbeitszimmer erschafft neue Möglichkeiten der räumlichen Nutzung und schafft einen Rückzugsraum im unteren Wohnbereich. Als Highlight dient in diesem schmucken Wohntraum der Elternbereich mit Ankleidezimmer. Um auch den Kleinsten den größten Platz bieten zu können, bestechen die beiden Kinderzimmer mit einer jeweiligen Größe von 13 m². Eine Wellness-Oase unter dem heimischen Dach? Mit diesem Entwurf ist das möglich. Er glänzt vor allem durch das große Hauptbadezimmer im Obergeschoss. Durch den optionalen Carport in Verlängerung zum Vordach des Hauseingangs bieten sich kurze Wege, die Sie vor Wind und Wetter schützen.",
  },
  "einfamilienhaus-25-168-190": {
    tagline: "Ungestörtes Arbeiten von zuhause aus.",
    body: "Mit unseren ideenreichen Entwürfen ist auch das zukünftig kein Problem. Dieser großzügige Hausentwurf bietet auf 161 m² Wohnfläche alles, was eine junge und moderne Familie braucht. Imposante Kinderzimmer und ein großzügiges Schlafzimmer mit Ankleide und Direktzugang zum angrenzenden Badezimmer. Raffinierte Lösungen bieten sich auch im Erdgeschoss dieses an Kreativität nicht zu übertreffenden Entwurfes. Vom angrenzenden Hauswirtschaftsraum mit Trennung zum Wohnraum und inkludierter Eingangsüberdachung bis hin zur eingeplanten Speisekammer - dieser Entwurf lässt keine Wünsche offen. Die charakteristische Holzverkleidung der teilverkleideten Fassade verleihen dem äußeren Erscheinungsbild eine besondere Note.",
  },
  "einfamilienhaus-22-162-190": {
    tagline: "Einfamilienhaus mit Homeoffice-Konzept – flexibel für jeden Anspruch.",
    body: "Durch seine geplante Homeoffice-Nutzung wird der Grundriss in Gänze bereits anders geplant. Mit viel Ruhe für die anstehende Arbeitswelt ist das Homeoffice in einem für sich liegenden, separaten Bereich im Erdgeschoss untergebracht, um selbst bei Trubel ungestört arbeiten zu können. Der zentrale Mittelpunkt des täglichen Lebens spiegelt sich im Wohn- und Essbereich wider. Die angrenzende, jedoch teilweise abgetrennte Küche bietet einen perfekten Rückzugsort. Vor allem durch die bis zum Boden reichenden Fenster wird die Wohnfläche hell erleuchtet.",
  },
  "einfamilienhaus-35-181-150": {
    tagline: "Ein harmonisches Miteinander.",
    body: "Das ist es, was sich jede Familie wünscht. Mit unserem Hausentwurf bieten wir hierfür gleich vier großzügig geschnittene Kinderzimmer an. Die zeitlose und doch moderne Bauweise verleiht diesem Grundriss seinen Charme. Mit seinen beiden bodentiefen Fenstern sorgt dieser für optimalen Lichteinfall. Intelligent durchdacht befindet sich das Arbeitszimmer im Erdgeschoss in der Nähe des Hauseingangs. Alternativ kann auch eine Einliegerwohnung oder ein separat abgetrennter Homeoffice-Bereich eingeplant werden. Die variablen Anpassungsmöglichkeiten machen dieses Hauskonzept so besonders.",
  },
  "einfamilienhaus-28-182-170": {
    tagline: "Der Familien-Allrounder.",
    body: "Dieser moderne Einfamilienhaus-Entwurf bietet alles, was eine Familie heutzutage benötigt. Zwei große Kinderzimmer sowie ein großes Badezimmer optimieren diesen familienfreundlichen Grundriss. Das angrenzende Ankleidezimmer mit eigenem Badezimmerzugang lässt keine Wünsche offen. Das im Erdgeschoss liegende Gästezimmer kann auch als Arbeitszimmer umfunktioniert werden. Der herausstechende Carport passt sich optisch perfekt in die Bauweise des Hauses mit ein und verleiht dem Ganzen eine unverkennbare Eleganz.",
  },
  "einfamilienhaus-22-173-190": {
    tagline: "Flexible Nutzungsmöglichkeiten dank Einliegerwohnung.",
    body: "Ob Bürofläche für zuhause, als Apartmentlösung für die Großeltern oder auch die eigenen Kinder ist dieses Konzept offen für Gestaltungsmöglichkeiten. Mit einem zusätzlich eingeplanten Raum besticht die 125 m² große Hauptwohnung vor allem durch eine großzügige Aufteilung der einzelnen Bereiche wie den beiden Kinderzimmern und dem Elternschlafzimmer. Schon heute an morgen denken. Durch die Solaranlage mit Stromspeicher und Ladestation sind Sie bestens für die Zukunft vorbereitet.",
  },
  "einfamilienhaus-28-194-170": {
    tagline: "Gemeinsam wohnen. Eigenständig leben.",
    body: "Dieses Haus schafft Raum für Nähe und zugleich für ein selbstständiges Leben unter einem Dach. Die separate Einliegerwohnung eignet sich ideal für Eltern, erwachsene Kinder, als Büro oder als zusätzliche Einnahmequelle durch Vermietung. Die große Hauptwohnung überzeugt mit einem offen gestalteten Wohn- und Essbereich, einem zusätzlichen Arbeits- oder Gästezimmer sowie drei Schlafzimmern im Dachgeschoss. Ein durchdachtes Wohnkonzept für Familien, die heute schon an die Möglichkeiten von morgen denken.",
  },
  "stadtvilla-22-157": {
    tagline: "Mondän und Modern – dank farblich abgesetztem Konzept.",
    body: "Ein lichtdurchfluteter Wohn- und Essbereich zieht sich entlang der gesamten Gartenseite. Sinnvoll ergänzt wird der Grundriss im Erdgeschoss durch ein Arbeitszimmer. Zwei gleich dimensionierte Kinderzimmer im Obergeschoss sowie ein großes Familienbadezimmer und ein sich über 24 m² erstreckender Elternbereich mit eigenem Ankleideraum bietet ein großzügiges Wohngefühl in der oberen Etage. In der optionalen Doppelgarage finden neben den Fahrzeugen auch Fahrräder oder Gartengeräte ihren Platz.",
  },
  "stadtvilla-22-166": {
    tagline: "Die Stadtvilla neu erleben.",
    body: "Dieser Hausentwurf erfreut sich stetig wachsender Beliebtheit. Mit seinen zwei Vollgeschossen und dem eleganten und modern wirkenden Außenauftritt begeistern sich immer mehr Baufamilien von dieser traumhaften Wohnvariante. Eine perfekt auf die Bedürfnisse einer Familie zugeschnittene Grundwohnfläche von knapp 165 m² lässt keine Wünsche mehr offen. Die integrierte Doppelgarage mit direktem Zugang in den Hauswirtschaftsraum, der großzügige Koch-, Wohn- und Essbereich wie auch das Schlafzimmer mit Ankleideraum sind nur einige der Vorteile, die dieser Hausentwurf für Familien mit sich bringt. Mit zwei zusätzlichen Räumen, zum Beispiel für das Arbeiten von zuhause aus oder das Beherbergen von Gästen, passt sich diese Stadtvilla sämtlichen Anforderungen an.",
  },
  "pultdachhaus-21-349-225": {
    tagline: "Perfekt für hanglagige Grundstücke.",
    body: "Einen wunderbaren Ausblick in die Natur bietet dieses Pultdachhaus mit seinen drei Vollgeschossen. Die einzelnen Stockwerke können entsprechend als Einliegerwohnungen getrennt oder als offenes Raumkonzept genutzt werden. Eine große Garage bietet nicht nur Platz für die Unterbringung der Fahrzeuge, sondern lässt sich ebenfalls als Terrasse nutzen.",
  },
  "doppelhaus-38-238-125": {
    tagline: "Doppelt hält besser.",
    body: "Dieser moderne Doppelhausentwurf besticht vor allem durch seine optische Finesse. Die dominante Eingangsüberdachung, die fließend in das Carport übergeht, verleiht diesem Grundriss geometrische Gleichheit. Egal, ob Sie mit bereits vorausgewählten Baupartnern bauen oder im Nachhinein vermieten möchten – mit diesem Konzept sind Sie flexibel. Die Wohnfläche an sich bietet mit seiner klassischen Planung den Wohn- und Essbereich im Erdgeschoss und Schlafräumen im Obergeschoss Platz für alle Familienmitglieder.",
  },
  "doppelhaus-28-299": {
    tagline: "Das Doppelhaus für gehobene Ansprüche.",
    body: "Das Erdgeschoss überzeugt auf ganzer Linie. Mit seinem Wohn- und Essbereich auf 42 m² Wohnfläche und zwei eingeplanten Terrassenausgängen bietet es genug Platz, um der Mittelpunkt des Alltags zu werden. Ein zum Gästezimmer änderbares Arbeitszimmer wie auch der große Haustechnikraum komplettieren den Grundriss im Erdgeschoss. Ein Obergeschoss ganz ohne störende Dachschrägen finden Sie in diesem Hauskonzept. Das Elternschlafzimmer wird ergänzt durch eine Ankleide aber auch die beiden großzügigen Kinderzimmer bieten Platz für Spiel und Spaß. Das große Familienbadezimmer lädt zum Verweilen ein.",
  },
  "bungalow-22-134": {
    tagline: "Ein einzigartiger Ausblick.",
    body: "Das verschafft Ihnen dieser grandiose Bungalowentwurf. Seine bis zum Boden reichenden, großen Fensterfronten lassen nicht nur Sonnenlicht in den Wohnbereich hinein, sondern geben auch einen wunderbaren Ausblick in den Garten. Alternativ kann auch eine Einliegerwohnung oder ein separat abgetrennter Homeoffice Bereich eingeplant werden. Die variablen Anpassungsmöglichkeiten machen dieses Hauskonzept so besonders.",
  },
};

export const getModelStory = (slug: string): ModelStory | undefined =>
  modelStories[slug];
