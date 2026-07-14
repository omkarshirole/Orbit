import { NextResponse, type NextRequest } from "next/server";
import { exchangeGmailCode } from "@/lib/gmail/oauth";
import { encryptToken, verifyOAuthState } from "@/lib/security";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

function oauthError(message: string, status = 400) {
  void status;
  return NextResponse.redirect(
    new URL(
      `/dashboard/connections?gmail_error=${encodeURIComponent(message)}`,
      process.env.PUBLIC_APP_URL || "http://localhost:3000",
    ),
  );
}

export async function GET(request: NextRequest) {
  const supabaseSession = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseSession.auth.getUser();
  if (!user) return oauthError("Sign in again before connecting Gmail.", 401);

  const url = new URL(request.url);
  const denied = url.searchParams.get("error");
  if (denied) {
    return oauthError(
      denied === "access_denied" ? "Gmail access was denied." : denied,
    );
  }

  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  if (!state || !code) return oauthError("Missing OAuth callback parameters.");

  try {
    const verified = verifyOAuthState(state, user.id);
    const tokens = await exchangeGmailCode(code);
    const admin = createSupabaseAdminClient();
    await admin.from("gmail_tokens").upsert({
      user_id: user.id,
      encrypted_access_token: encryptToken(tokens.access_token),
      encrypted_refresh_token: encryptToken(tokens.refresh_token),
      token_expiry: new Date(
        Date.now() + tokens.expires_in * 1000,
      ).toISOString(),
      provider_scope: tokens.scope,
      updated_at: new Date().toISOString(),
    });
    return NextResponse.redirect(
      new URL(
        verified.returnTo,
        process.env.PUBLIC_APP_URL || "http://localhost:3000",
      ),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gmail OAuth failed.";
    return oauthError(message);
  }
}
