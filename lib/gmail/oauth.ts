import { getPublicAppUrl, requireEnv } from "@/lib/env";

export const GMAIL_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.readonly",
];

export function gmailRedirectUri() {
  return `${getPublicAppUrl()}/api/public/gmail-oauth-callback`;
}

export function buildGmailAuthUrl(state: string, forceConsent = true) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", requireEnv("GOOGLE_OAUTH_CLIENT_ID"));
  url.searchParams.set("redirect_uri", gmailRedirectUri());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", GMAIL_SCOPES.join(" "));
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", state);
  if (forceConsent) {
    url.searchParams.set("prompt", "consent");
  }
  return url.toString();
}

export async function exchangeGmailCode(code: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: requireEnv("GOOGLE_OAUTH_CLIENT_ID"),
      client_secret: requireEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
      redirect_uri: gmailRedirectUri(),
      grant_type: "authorization_code",
    }),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(
      payload.error_description ||
        payload.error ||
        "Google OAuth exchange failed.",
    );
  }
  if (!payload.refresh_token) {
    throw new Error(
      "Missing refresh token. Reconnect Gmail and approve offline access.",
    );
  }
  return payload as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
  };
}

export async function refreshGmailAccessToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: requireEnv("GOOGLE_OAUTH_CLIENT_ID"),
      client_secret: requireEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
      grant_type: "refresh_token",
    }),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(
      payload.error_description ||
        payload.error ||
        "Gmail token refresh failed.",
    );
  }
  return payload as {
    access_token: string;
    expires_in: number;
    scope?: string;
  };
}
