import { z } from "zod";
import type { FormSection } from "@/features/contact-forms/components/field.types";

export const catalogSchema = z.object({
  name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen an"),
  email: z.email("Ungültige E-Mail Adresse"),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "PLZ muss aus 5 Ziffern bestehen"),
  city: z.string().trim().min(2, "Bitte geben Sie den Ort an"),
  privacyConsent: z.literal(true, {
    error: () => "Zustimmung zur Datenschutzerklärung erforderlich",
  }),
});

export type CatalogFormState = z.infer<typeof catalogSchema>;

export const emptyCatalogForm: Record<
  keyof CatalogFormState,
  string | boolean
> = {
  name: "",
  email: "",
  postalCode: "",
  city: "",
  privacyConsent: false,
};

export const catalogContactSection: FormSection = {
  id: "kontakt",
  heading: "Ihre Kontaktdaten",
  fields: [
    {
      type: "text",
      name: "name",
      label: "Vor- und Nachname",
      placeholder: "Vor- und Nachname",
      autocomplete: "name",
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
      name: "postalCode",
      label: "PLZ",
      autocomplete: "postal-code",
      required: true,
    },
    {
      type: "text",
      name: "city",
      label: "Ort",
      autocomplete: "address-level2",
      required: true,
    },
  ],
};

export const catalogConsentSection: FormSection = {
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
};
