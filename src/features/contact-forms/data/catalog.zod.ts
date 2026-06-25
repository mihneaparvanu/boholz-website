import { z } from "zod";

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
