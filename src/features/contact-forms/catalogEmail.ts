import type { CatalogFormState } from "./data/catalog.zod";

export function buildCatalogNotification(d: CatalogFormState): {
  subject: string;
  html: string;
  text: string;
} {
  return {
    subject: `Neue Katalog-Anfrage von ${d.name}`,
    html: html(d),
    text: text(d),
  };
}

function html(d: CatalogFormState): string {
  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <title>Neue Katalog-Anfrage</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="background:#1a1a1a;padding:24px 32px;color:#ffffff;">
                <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#a0a0a0;">BoHolz Haus</div>
                <div style="font-size:22px;font-weight:bold;margin-top:4px;">Neue Katalog-Anfrage von ${d.name}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 24px 0;font-size:15px;line-height:1.5;">
                  Eine neue Katalog-Anfrage ist eingegangen.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6;">
                  <tr><td style="padding:6px 0;color:#666;width:160px;">Name</td><td style="padding:6px 0;font-weight:bold;">${d.name}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">E-Mail</td><td style="padding:6px 0;"><a href="mailto:${d.email}" style="color:#1a1a1a;">${d.email}</a></td></tr>
                </table>

                <p style="margin:32px 0 0 0;padding:16px;background:#f8f8f8;border-radius:4px;font-size:13px;color:#666;line-height:1.5;">
                  <strong>Tipp:</strong> Antworten Sie direkt auf diese E-Mail, um den Kunden zu erreichen.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#f8f8f8;padding:16px 32px;font-size:12px;color:#999;text-align:center;">
                Diese E-Mail wurde automatisch vom Katalog-Formular auf boholz-haus.de gesendet.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function text(d: CatalogFormState): string {
  return `Name: ${d.name}
E-Mail: ${d.email}`;
}
