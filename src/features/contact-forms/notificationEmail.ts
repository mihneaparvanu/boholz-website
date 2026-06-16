import type { ContactFormState } from "./data/contact.zod";

export function buildNotification(d: ContactFormState): {
  subject: string;
  html: string;
  text: string;
} {
  return {
    subject: `Neue Anfrage von ${d.name}`,
    html: html(d),
    text: text(d),
  };
}

function html(d: ContactFormState): string {
  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <title>Neue Anfrage</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="background:#1a1a1a;padding:24px 32px;color:#ffffff;">
                <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#a0a0a0;">BoHolz Haus</div>
                <div style="font-size:22px;font-weight:bold;margin-top:4px;">Neue Anfrage von ${d.name}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 24px 0;font-size:15px;line-height:1.5;">
                  Eine neue Kundenanfrage ist eingegangen. Die Daten finden Sie unten.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6;">
                  <tr><td style="padding:6px 0;color:#666;width:160px;">Name</td><td style="padding:6px 0;font-weight:bold;">${d.name}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">E-Mail</td><td style="padding:6px 0;"><a href="mailto:${d.email}" style="color:#1a1a1a;">${d.email}</a></td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Telefon</td><td style="padding:6px 0;"><a href="tel:${d.phone}" style="color:#1a1a1a;">${d.phone}</a></td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Adresse</td><td style="padding:6px 0;">${d.street}<br />${d.postalCode} ${d.city}</td></tr>
                </table>

                <div style="border-top:1px solid #eaeaea;margin:24px 0;"></div>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6;">
                  <tr><td style="padding:6px 0;color:#666;width:160px;">Haustyp</td><td style="padding:6px 0;font-weight:bold;">${d.houseType}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Wohnfläche</td><td style="padding:6px 0;">${d.livingArea} m²</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Förderung gewünscht</td><td style="padding:6px 0;">${d.wantsFunding}</td></tr>
                </table>

                <p style="margin:32px 0 0 0;padding:16px;background:#f8f8f8;border-radius:4px;font-size:13px;color:#666;line-height:1.5;">
                  <strong>Tipp:</strong> Antworten Sie direkt auf diese E-Mail, um den Kunden zu erreichen.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#f8f8f8;padding:16px 32px;font-size:12px;color:#999;text-align:center;">
                Diese E-Mail wurde automatisch vom Kontaktformular auf boholz-haus.de gesendet.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function text(d: ContactFormState): string {
  return `Name: ${d.name}
E-Mail: ${d.email}
Telefon: ${d.phone}

Adresse:
${d.street}
${d.postalCode} ${d.city}

Anfrage:
Haustyp: ${d.houseType}
Wohnfläche: ${d.livingArea} m²
Förderung gewünscht: ${d.wantsFunding}`;
}
