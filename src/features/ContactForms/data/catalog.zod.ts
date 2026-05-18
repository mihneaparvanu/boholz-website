import { z } from "zod";

/* Catalog-request schema.

   Address fields are conditionally required: when `versandart === "post"`,
   street/postalCode/city must be filled and shaped correctly. When the
   user picks email delivery, those fields stay optional and can be empty
   strings (the form will not even render them).

   The base shape uses optional strings so an empty submission with
   versandart=email parses cleanly; `superRefine` adds the conditional
   shape rules so error messages still land on the right field paths.
*/
export const catalogSchema = z
  .object({
    name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen an"),
    email: z.email("Ungültige E-Mail Adresse"),
    versandart: z.enum(["email", "post"]),
    street: z.string().trim().optional().default(""),
    postalCode: z.string().trim().optional().default(""),
    city: z.string().trim().optional().default(""),
    privacyConsent: z.literal(true, {
      error: () => "Zustimmung zur Datenschutzerklärung erforderlich",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.versandart !== "post") return;

    if (data.street.length < 3) {
      ctx.addIssue({
        code: "custom",
        path: ["street"],
        message: "Straße und Hausnummer angeben",
      });
    }
    if (!/^\d{5}$/.test(data.postalCode)) {
      ctx.addIssue({
        code: "custom",
        path: ["postalCode"],
        message: "PLZ muss aus 5 Ziffern bestehen",
      });
    }
    if (data.city.length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["city"],
        message: "Bitte geben Sie den Ort an",
      });
    }
  });

export type CatalogFormState = z.infer<typeof catalogSchema>;

export const emptyCatalogForm: Record<
  keyof CatalogFormState,
  string | boolean
> = {
  name: "",
  email: "",
  versandart: "email",
  street: "",
  postalCode: "",
  city: "",
  privacyConsent: false,
};
