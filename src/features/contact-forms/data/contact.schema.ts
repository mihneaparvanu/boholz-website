import type { FormSection } from "@/features/contact-forms/types/contact.types";

export const contactFormSections: FormSection[] = [
  {
    id: "haus",
    heading: "Ihr zukünftiges Zuhause",
    fields: [
      {
        type: "radio",
        name: "houseType",
        label: "Welchen Haustyp möchten Sie bauen?",
        required: true,
        options: [
          { value: "einfamilienhaus", label: "Einfamilienhaus" },
          { value: "kubushaus", label: "Kubushaus" },
          { value: "stadtvilla", label: "Stadtvilla" },
          { value: "generationenhaus", label: "Generationenhaus" },
          { value: "bungalow", label: "Bungalow" },
        ],
      },
      {
        type: "radio",
        name: "livingArea",
        label: "Welche Wohnfläche soll Ihr Haus haben?",
        required: true,
        options: [
          { value: "100-149", label: "100 m² – 149 m²" },
          { value: "150-200", label: "150 m² – 200 m²" },
          { value: "200+", label: "Über 200 m²" },
        ],
      },
      {
        type: "radio",
        name: "wantsFunding",
        label: "Möchten Sie eine staatliche Förderung in Anspruch nehmen?",
        required: true,
        options: [
          { value: "ja", label: "Ja" },
          { value: "nein", label: "Nein" },
        ],
      },
    ],
  },
  {
    id: "kontakt",
    heading: "Ihre Kontaktdaten",
    fields: [
      {
        type: "text",
        name: "name",
        label: "Name",
        placeholder: "Vor- und Nachname",
        autocomplete: "name",
        required: true,
      },
      {
        type: "tel",
        name: "phone",
        label: "Telefonnummer",
        placeholder: "+49 …",
        autocomplete: "tel",
        required: true,
      },
      {
        type: "email",
        name: "email",
        label: "E-Mail Adresse",
        placeholder: "name@beispiel.de",
        autocomplete: "email",
        required: true,
      },
      {
        type: "text",
        name: "street",
        label: "Straße und Hausnummer",
        autocomplete: "street-address",
        required: true,
      },
      {
        type: "text",
        name: "city",
        label: "Ort",
        autocomplete: "address-level2",
        required: true,
      },
      {
        type: "text",
        name: "postalCode",
        label: "PLZ",
        autocomplete: "postal-code",
        required: true,
      },
    ],
  },
  {
    id: "consent",
    fields: [
      {
        type: "consent",
        name: "privacyConsent",
        label:
          "Ich habe die Datenschutzerklärung zur Kenntnis genommen und stimme der Verarbeitung meiner Daten zu.",
        required: true,
      },
    ],
  },
];
