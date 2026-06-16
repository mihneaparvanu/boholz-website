export type Email = {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export async function sendEmail(
  email: Email,
): Promise<{ ok: true } | { ok: false; error: string }> {
  console.log("[sendEmail stub]", {
    to: email.to,
    from: email.from,
    subject: email.subject,
    replyTo: email.replyTo,
    htmlLength: email.html.length,
    textLength: email.text.length,
  });
  return { ok: true };
}
