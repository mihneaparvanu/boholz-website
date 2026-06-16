const TURNSTILE_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string,
  remoteip?: string,
): Promise<{ success: boolean; errorCodes: string[]; hostname?: string }> {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) throw new Error("TURNSTILE_SECRET is not set");

  const body = new URLSearchParams();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteip) body.append("remoteip", remoteip);

  const response = await fetch(TURNSTILE_URL, { method: "POST", body });
  if (!response.ok) {
    throw new Error(`siteverify HTTP ${response.status}`);
  }

  const data = await response.json();
  return {
    success: data.success,
    errorCodes: data["error-codes"] ?? [],
    hostname: data.hostname,
  };
}
