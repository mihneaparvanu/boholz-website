import type { APIRoute } from "astro";
import { z } from "zod";
import { contactSchema } from "@/features/contact-forms/data/contact.zod";
import { verifyTurnstile } from "@/features/contact-forms/verifyTurnstile";
import {
  sendEmail,
  type EmailContent,
} from "@/features/contact-forms/sendEmail";
import { buildNotification } from "@/features/contact-forms/notificationEmail";

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const body = (await request.json()) as Record<string, unknown>;

  const token =
    typeof body.turnstileToken === "string" ? body.turnstileToken : null;
  if (!token) {
    return Response.json(
      { errors: { formErrors: ["Sicherheitsprüfung fehlt"] } },
      { status: 403 },
    );
  }

  const verdict = await verifyTurnstile(token, clientAddress);
  if (!verdict.success) {
    return Response.json(
      {
        errors: { formErrors: ["Sicherheitsprüfung fehlgeschlagen"] },
        codes: verdict.errorCodes,
      },
      { status: 403 },
    );
  }

  const result = contactSchema.safeParse(body);
  if (result.success === false) {
    return Response.json(
      { errors: z.flattenError(result.error) },
      { status: 422 },
    );
  }

  const d = result.data;

  const emailContent: EmailContent = {
    ...buildNotification(d),
    replyTo: d.email,
  };

  const sent = await sendEmail(emailContent);

  if (!sent.ok) {
    return Response.json({ ok: false, error: sent.error }, { status: 500 });
  }

  return Response.json({ ok: true });
};
