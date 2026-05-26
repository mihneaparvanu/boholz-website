/* Catalog-request form — separate types from the houseinquiry form because
   the field set is genuinely different (no house preferences, plus a
   conditional postal block). Re-uses the shared FormField/FormSection
   shapes from `contact.types.ts` where they fit. */
export type { FormField, FormSection } from "./contact.types";

export type Versandart = "email" | "post";

export interface CatalogFormState {
  name: string;
  email: string;
  versandart: Versandart;
  street: string;
  postalCode: string;
  city: string;
  privacyConsent: boolean;
}
