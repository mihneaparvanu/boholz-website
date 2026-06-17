import type { FormSection } from "@/features/contact-forms/types/contact.types";

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
