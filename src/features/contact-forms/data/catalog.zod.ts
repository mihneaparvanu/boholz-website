import { z } from "zod";

export const catalogSchema = z.object({
  name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen an"),
  email: z.email("Ungültige E-Mail Adresse"),
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
  privacyConsent: false,
};
