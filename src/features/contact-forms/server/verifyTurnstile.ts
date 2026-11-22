const TURNSTILE_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  secret: string,
  token: string,
  remoteip?: string,
): Promise<{ success: boolean; errorCodes: string[]; hostname?: string }> {
  const body = new URLSearchParams();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteip) body.append("remoteip", remoteip);

  const response = await fetch(TURNSTILE_URL, { method: "POST", body });
  if (!response.ok) {
    throw new Error(`siteverify HTTP ${response.status}`);
  }

  const data = (await response.json()) as {
    success: boolean;
    "error-codes"?: string[];
    hostname?: string;
  };
  return {
    success: data.success,
    errorCodes: data["error-codes"] ?? [],
    hostname: data.hostname,
  };
}
