// Shared FAQ content — surfaced on the Home page and (eventually) a dedicated /faq.
// If this ever moves to the DB, this file is the seed shape.

export type Question = {
  id: string;
  question: string;
  answer: string;
};

export type QuestionCategory = {
  id: string;
  title: string;
  questions: Question[];
};

export const qaCategories: QuestionCategory[] = [
  {
    id: "planung",
    title: "Planung & Bestellung",
    questions: [
      {
        id: "dauer-prozess",
        question:
          "Wie lange dauert der gesamte Prozess vom Erstgespräch bis zum Einzug?",
        answer:
          "In der Regel rechnen Sie mit 8–12 Monaten — abhängig von Ausstattung, Behördengenehmigung und Lieferzeitpunkt. Die Bauphase vor Ort selbst dauert nur wenige Tage.",
      },
      {
        id: "individualisierung",
        question: "Kann ich Grundriss und Ausstattung individuell anpassen?",
        answer:
          "Ja. Jedes BoHolz-Modell ist eine Ausgangsbasis. Wandposition, Fensterformate, Materialien und Innenausbau lassen sich gemeinsam mit unserem Architekturteam an Ihre Bedürfnisse anpassen.",
      },
      {
        id: "grundstueck",
        question: "Brauche ich ein Grundstück, bevor ich anfrage?",
        answer:
          "Nicht zwingend. Eine erste Beratung kann ohne Grundstück stattfinden. Für eine konkrete Planung und ein verbindliches Angebot benötigen wir jedoch die Grundstücksdaten.",
      },
    ],
  },
  {
    id: "bauphase",
    title: "Bauphase",
    questions: [
      {
        id: "aufbau-dauer",
        question: "Wie lange dauert der Aufbau vor Ort?",
        answer:
          "Die Außenhülle steht in 1–3 Tagen. Der vollständige Innenausbau bis zum bezugsfertigen Zustand benötigt anschließend etwa 8–12 Wochen.",
      },
      {
        id: "wetter",
        question: "Was passiert bei schlechtem Wetter?",
        answer:
          "Da die Module in unserer Werkshalle vorgefertigt werden, sind wir wetterunabhängig. Vor Ort planen wir Aufbauten in trockenen Wetterfenstern und schützen den Rohbau zwischen den Phasen.",
      },
    ],
  },
  {
    id: "garantien",
    title: "Garantien & Qualität",
    questions: [
      {
        id: "garantien",
        question: "Welche Garantien gewähren Sie?",
        answer:
          "Auf Statik und tragende Konstruktion gewähren wir 30 Jahre Garantie, auf Dach und Fassade 10 Jahre, auf Haustechnik 2–5 Jahre nach Hersteller. Details halten wir im Werkvertrag fest.",
      },
      {
        id: "energiestandard",
        question: "Welchen Energiestandard erreichen Ihre Häuser?",
        answer:
          "Standardmäßig liefern wir KfW-55. Auf Wunsch realisieren wir KfW-40 oder Passivhaus-Niveau — beides ohne Eingriffe in die Bauzeit.",
      },
    ],
  },
  {
    id: "finanzierung",
    title: "Finanzierung",
    questions: [
      {
        id: "zahlungsplan",
        question: "Wie ist der Zahlungsplan aufgebaut?",
        answer:
          "Zahlung erfolgt nach Baufortschritt in fest vereinbarten Raten — typischerweise bei Vertrag, Werksfertigung, Aufbau und Schlüsselübergabe. Sie zahlen nie für Leistungen, die noch nicht erbracht sind.",
      },
      {
        id: "foerderung",
        question: "Welche Fördermittel kann ich nutzen?",
        answer:
          "Unsere Häuser sind KfW-förderfähig. Auf Wunsch unterstützen wir Sie bei der Beantragung von KfW-Krediten und regionalen Förderprogrammen.",
      },
    ],
  },
];
