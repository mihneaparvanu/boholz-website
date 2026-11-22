import { z } from "zod";
import { contactSchema } from "@/features/contact-forms/contact/contact.fields";
import { catalogSchema } from "@/features/contact-forms/catalog/catalog.fields";
import { buildNotification } from "@/features/contact-forms/contact/contact.email";
import { buildCatalogNotification } from "@/features/contact-forms/catalog/catalog.email";
import { verifyTurnstile } from "@/features/contact-forms/server/verifyTurnstile";
import {
  sendEmail,
  type EmailContent,
  type MailEnv,
} from "@/features/contact-forms/server/sendEmail";
import { logLead, type Lead } from "@/features/contact-forms/server/logLead";

type Env = MailEnv & { TURNSTILE_SECRET: string };

const FORMS = {
  "/api/contact": {
    form: "contact",
    schema: contactSchema,
    build: (d: z.infer<typeof contactSchema>): EmailContent => ({
      ...buildNotification(d),
      replyTo: d.email,
    }),
  },
  "/api/catalog": {
    form: "catalog",
    schema: catalogSchema,
    build: (d: z.infer<typeof catalogSchema>): EmailContent => ({
      ...buildCatalogNotification(d),
      replyTo: d.email,
    }),
  },
} as const;

export default {
  async fetch(request, env): Promise<Response> {
    const route = FORMS[new URL(request.url).pathname as keyof typeof FORMS];
    if (!route) return new Response("Not Found", { status: 404 });
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    const token =
      typeof body?.turnstileToken === "string" ? body.turnstileToken : null;
    if (!body || !token) {
      return Response.json(
        { errors: { formErrors: ["Sicherheitsprüfung fehlt"] } },
        { status: 403 },
      );
    }

    const verdict = await verifyTurnstile(
      env.TURNSTILE_SECRET,
      token,
      request.headers.get("CF-Connecting-IP") ?? undefined,
    ).catch(() => null);
    if (!verdict?.success) {
      return Response.json(
        {
          errors: { formErrors: ["Sicherheitsprüfung fehlgeschlagen"] },
          codes: verdict?.errorCodes,
        },
        { status: 403 },
      );
    }

    const result = route.schema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { errors: z.flattenError(result.error) },
        { status: 422 },
      );
    }

    const sent = await sendEmail(env, route.build(result.data as never));
    if (!sent.ok) {
      await logLead(
        { form: route.form, payload: result.data } as Lead,
        sent.error,
      );
      return Response.json({ ok: false, error: sent.error }, { status: 500 });
    }

    return Response.json({ ok: true });
  },
} satisfies ExportedHandler<Env>;
