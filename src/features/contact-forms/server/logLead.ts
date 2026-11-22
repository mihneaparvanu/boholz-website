import { type ContactFormState } from "@/features/contact-forms/contact/contact.fields";
import { type CatalogFormState } from "@/features/contact-forms/catalog/catalog.fields";

export type Lead =
  | { form: "contact"; payload: ContactFormState }
  | { form: "catalog"; payload: CatalogFormState };

export async function logLead(
  lead: Lead,
  error: string | undefined,
): Promise<void> {
  try {
    const record = {
      at: new Date().toISOString(),
      form: lead.form,
      payload: lead.payload,
      error: error,
    };
    console.error(JSON.stringify(record));
  } catch {}
}
