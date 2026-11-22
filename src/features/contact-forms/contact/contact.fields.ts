import { z } from "zod";
import type {
  FormSection,
  OptionItem,
} from "@/features/contact-forms/components/field.types";

const valuesOf = <T extends readonly OptionItem[]>(options: T) =>
  options.map((o) => o.value) as [T[number]["value"], ...T[number]["value"][]];

const HOUSE_TYPES = [
          { value: "einfamilienhaus", label: "Einfamilienhaus" },
          { value: "kubushaus", label: "Kubushaus" },
          { value: "stadtvilla", label: "Stadtvilla" },
          { value: "generationenhaus", label: "Generationenhaus" },
          { value: "bungalow", label: "Bungalow" },
          { value: "doppelhaus", label: "Doppelhaus" },
          { value: "zweifamilienhaus", label: "Zweifamilienhaus" },
          { value: "mehrfamilienhaus", label: "Mehrfamilienhaus" },
        ] as const;

const LIVING_AREAS = [
          { value: "100-149", label: "100 m² – 149 m²" },
          { value: "150-200", label: "150 m² – 200 m²" },
          { value: "200+", label: "Über 200 m²" },
        ] as const;

const FUNDING = [
          { value: "ja", label: "Ja" },
          { value: "nein", label: "Nein" },
        ] as const;

export const contactSchema = z.object({
  houseType: z.enum(valuesOf(HOUSE_TYPES)),
  livingArea: z.enum(valuesOf(LIVING_AREAS)),
  wantsFunding: z.enum(valuesOf(FUNDING)),
  name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen an"),
  phone: z
    .string()
    .trim()
    .regex(
      /^[+\d\s/()-]{6,}$/,
      "Bitte geben Sie eine gültige Telefonnummer an",
    ),
  email: z.email("Ungültige E-Mail Adresse"),
  street: z.string().trim().min(3, "Straße und Hausnummer angeben"),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "PLZ muss aus 5 Ziffern bestehen"),
  city: z.string().trim().min(2, "Bitte geben Sie den Ort an"),
  privacyConsent: z.literal(true, {
    error: () => "Zustimmung zur Datenschutzerklärung erforderlich",
  }),
});

export type ContactFormState = z.infer<typeof contactSchema>;

export const emptyContactForm: Record<
  keyof ContactFormState,
  string | boolean
> = {
  houseType: "",
  livingArea: "",
  wantsFunding: "",
  name: "",
  phone: "",
  email: "",
  street: "",
  postalCode: "",
  city: "",
  privacyConsent: false,
};

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
        options: [...HOUSE_TYPES],
      },
      {
        type: "radio",
        name: "livingArea",
        label: "Welche Wohnfläche soll Ihr Haus haben?",
        required: true,
        options: [...LIVING_AREAS],
      },
      {
        type: "radio",
        name: "wantsFunding",
        label: "Möchten Sie eine staatliche Förderung in Anspruch nehmen?",
        required: true,
        options: [...FUNDING],
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
