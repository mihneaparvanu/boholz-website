import type { APIRoute } from "astro";
import { contactSchema } from "@/features/contact-forms/data/contact.zod";
import { verifyTurnstile } from "@/features/contact-forms/verifyTurnstile";
import type { Email } from "@/features/contact-forms/sendEmail";

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
    return Response.json({ errors: result.error.flatten() }, { status: 422 });
  }

  console.log(result.data);
  const email: Email = {
    to: "info@boholz-haus.de",
  };

  return Response.json({ ok: true });
};
