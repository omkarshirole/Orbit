import crypto from "node:crypto";
import { requireEnv } from "@/lib/env";

const STATE_TTL_MS = 10 * 60 * 1000;

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function hmac(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export function timingSafeEqualText(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }
  return crypto.timingSafeEqual(left, right);
}

export function createOAuthState(
  userId: string,
  returnTo = "/dashboard/connections",
  now = Date.now(),
) {
  const nonce = crypto.randomBytes(18).toString("base64url");
  const safeReturnTo =
    returnTo.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : "/dashboard/connections";
  const payload = base64url(
    JSON.stringify({
      userId,
      returnTo: safeReturnTo,
      nonce,
      exp: now + STATE_TTL_MS,
    }),
  );
  const signature = hmac(payload, requireEnv("GMAIL_OAUTH_STATE_SECRET"));
  return `${payload}.${signature}`;
}

export function verifyOAuthState(
  state: string,
  expectedUserId: string,
  now = Date.now(),
) {
  const [payload, signature] = state.split(".");
  if (!payload || !signature) {
    throw new Error("Invalid OAuth state.");
  }

  const expectedSignature = hmac(
    payload,
    requireEnv("GMAIL_OAUTH_STATE_SECRET"),
  );
  if (!timingSafeEqualText(signature, expectedSignature)) {
    throw new Error("Invalid OAuth state signature.");
  }

  const parsed = JSON.parse(
    Buffer.from(payload, "base64url").toString("utf8"),
  ) as {
    userId: string;
    returnTo: string;
    exp: number;
  };

  if (!timingSafeEqualText(parsed.userId, expectedUserId)) {
    throw new Error("OAuth state does not match this session.");
  }

  if (parsed.exp < now) {
    throw new Error("OAuth state expired.");
  }

  return parsed;
}

export function encryptToken(plainText: string) {
  const key = Buffer.from(requireEnv("TOKEN_ENCRYPTION_KEY"), "base64");
  if (key.length !== 32) {
    throw new Error(
      "TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key.",
    );
  }
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

export function decryptToken(cipherText: string) {
  const key = Buffer.from(requireEnv("TOKEN_ENCRYPTION_KEY"), "base64");
  const [ivText, tagText, encryptedText] = cipherText.split(".");
  if (!ivText || !tagText || !encryptedText) {
    throw new Error("Invalid encrypted token format.");
  }
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(ivText, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagText, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function verifyAfterShipSignature(
  rawBody: string,
  signature: string | null,
  secret = requireEnv("AFTERSHIP_WEBHOOK_SECRET"),
) {
  if (!signature) {
    return false;
  }
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("base64");
  return timingSafeEqualText(signature, expected);
}
