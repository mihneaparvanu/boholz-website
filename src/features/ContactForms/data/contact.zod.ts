import { z } from "zod";

export const contactSchema = z.object({
  houseType: z.enum([
    "einfamilienhaus",
    "kubushaus",
    "stadtvilla",
    "generationenhaus",
    "bungalow",
  ]),
  livingArea: z.enum(["100-149", "150-200", "200+"]),
  wantsFunding: z.enum(["ja", "nein"]),
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
