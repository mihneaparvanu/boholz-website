import type { FormSection } from "@/features/ContactForms/types/contact.types";

/* Field-level schema for the catalog request.
   `kontakt` always renders. The postal section is rendered conditionally
   inside `CatalogForm.vue` (the parent component decides based on
   `versandart`); we keep it declared here so the same field components
   stay reusable. */
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
  ],
};

export const catalogVersandSection: FormSection = {
  id: "versand",
  heading: "Versandart",
  fields: [
    {
      type: "radio",
      name: "versandart",
      label: "Wie möchten Sie den Katalog erhalten?",
      required: true,
      options: [
        { value: "email", label: "E-Mail (PDF)" },
        { value: "post", label: "Postversand" },
      ],
    },
  ],
};

export const catalogPostalSection: FormSection = {
  id: "postal",
  heading: "Postanschrift",
  fields: [
    {
      type: "text",
      name: "street",
      label: "Straße und Hausnummer",
      autocomplete: "street-address",
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
