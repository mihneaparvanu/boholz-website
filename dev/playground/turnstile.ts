const TURNSTILE_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstile(
  token: string,
  secret: string,
  remoteip?: string,
): Promise<{
  success: boolean;
  errorCodes: string[];
  hostname?: string;
}> {
  const body = new URLSearchParams();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteip) {
    body.append("remoteip", remoteip);
  }
  const response = await fetch(TURNSTILE_URL, {
    method: "POST",
    body: body,
  });

  if (!response.ok) throw new Error(`siteverify HTTP ${response.status}`);

  const data = await response.json();

  return {
    success: data.success,
    errorCodes: data["error-codes"] ?? [],
    hostname: data.hostname,
  };
}

const ALWAYS_PASS = "1x0000000000000000000000000000000AA";
const ALWAYS_FAIL = "2x0000000000000000000000000000000AA";
const ALREADY_SPENT = "3x0000000000000000000000000000000AA";
const REAL_SECRET = process.env.TURNSTILE_SECRET!;

console.log(
  "secret loaded?",
  REAL_SECRET ? `yes (len=${REAL_SECRET.length})` : "NO",
);
