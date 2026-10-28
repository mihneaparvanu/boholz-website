import { appendFile } from "node:fs/promises";
import { type ContactFormState } from "./data/contact.zod";
import { type CatalogFormState } from "./data/catalog.zod";

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
    const content = JSON.stringify(record);

    console.error(content);

    const file = process.env.LEAD_LOG_PATH;
    if (!file) {
      console.error("No file path");
      return;
    }
    await appendFile(file, content + "\n");
  } catch {}
}
