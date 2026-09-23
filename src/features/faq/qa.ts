// Shared FAQ content — surfaced on the Home page and (eventually) a dedicated /faq.
// Sourced from the production WordPress export (boholz-haus.de FAQ accordion).
// Answers contain trusted internal HTML; render with v-html.
// If this ever moves to the DB, this file is the seed shape.
import { keitel } from './keitel';

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
    id: "allgemein",
    title: "Allgemein",
    questions: [
      {
        id: "was-ist-fertighaus",
        question: "Was ist ein Fertighaus?",
        answer:
          "<p>Bei einem Fertighaus werden wesentliche Bauteile im Werk vorgefertigt und anschließend auf dem Grundstück montiert. Die Vorfertigung ermöglicht klar abgestimmte Planungs- und Montageabläufe. Architektur, Grundriss und Ausstattung können dabei innerhalb der technischen und baurechtlichen Möglichkeiten individuell geplant werden.</p>",
      },
      {
        id: "materialien",
        question: "Welche Materialien verwendet BoHolz Haus?",
        answer:
          "<p>Holz bildet einen wesentlichen Bestandteil der Wand-, Decken- und Dachkonstruktionen unserer Fertighäuser. Die Außenwände verbinden eine Holzrahmenkonstruktion mit einer 60 mm starken Holzfaserdämmplatte, einem Dämmstoff der Wärmeleitgruppe 035, einer OSB-4-Platte, einer Luftdichtheitsebene sowie einer Gipskarton-Feuerschutzplatte. Der genaue Aufbau und die jeweiligen Materialstärken richten sich nach der gewählten Wandausführung.</p>",
      },
      {
        id: "richtiger-haustyp",
        question: "Welcher Haustyp ist der Richtige für mich?",
        answer:
          "<p>Ohne einen vorgegebenen Bebauungsplan orientiert sich die Bauweise typischerweise an der umliegenden Bebauung. Leben Ihre Nachbarn beispielsweise in Flachdachhäusern, wird Ihnen wahrscheinlich auch dieser Haustyp vorgeschrieben. Ähnlich verhält es sich mit Satteldachhäusern. Um die Möglichkeiten für Ihr Grundstück zu erkunden und den optimalen Haustyp zu ermitteln, empfehlen wir Ihnen ein persönliches Beratungsgespräch mit einem unserer BoHolz-Experten.</p>",
      },
    ],
  },
  {
    id: "planung",
    title: "Planung & Gestaltung",
    questions: [
      {
        id: "individuell-gestalten",
        question: "Wie individuell kann ich mein BoHolz Haus gestalten?",
        answer:
          "<p>Wir bieten vielfältige Anpassungsmöglichkeiten und Ausbaustufen bei Grundriss, Design und Ausstattung ganz nach Ihren Wünschen.</p>",
      },
      {
        id: "musterhaus-besichtigen",
        question: "Kann ich ein Musterhaus besichtigen?",
        answer:
          "<p>Ja, wir bieten Besichtigungen in unseren beiden Musterhäusern in Bad Vilbel und Fellbach an, um Ihnen einen realen Eindruck zu vermitteln. Vereinbaren Sie gerne einen Termin vor Ort und lassen Sie sich ausführlich beraten.</p>",
      },
      {
        id: "werk-besichtigen",
        question:
          "Kann ich das Werk besichtigen, in dem mein Fertighaus entsteht?",
        answer: keitel("qaWerksfuehrung"),
      },
    ],
  },
  {
    id: "bauphase",
    title: "Bauphase & Qualität",
    questions: [
      {
        id: "bauzeit",
        question: "Wie lange dauert der Bau eines Fertighauses?",
        answer:
          "<p>Das ist abhängig von der Ausbaustufe und der Jahreszeit. Die durchschnittliche Bauzeit für ein Fertighaus liegt zwischen 3 und 6 Monaten von Montage bis zur Fertigstellung.</p>",
      },
      {
        id: "energieeffizienz",
        question: "Wie energieeffizient sind BoHolz Fertighäuser?",
        answer:
          "<p>Unsere Häuser erfüllen hohe Energiestandards und erreichen die Effizienzhaus-Kriterien KfW 55 und KfW 40.</p>",
      },
      {
        id: "garantien",
        question: "Welche Garantien bietet BoHolz Haus?",
        answer:
          "<p>Wir gewähren umfassende Garantien auf Konstruktion und Materialien. Details erfahren Sie im kostenlosen Beratungsgespräch mit unseren BoHolz-Experten.</p>",
      },
    ],
  },
];
