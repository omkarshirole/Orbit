import { NextResponse } from "next/server";
import { buildGmailAuthUrl } from "@/lib/gmail/oauth";
import { createOAuthState } from "@/lib/security";
import { requireUser } from "@/lib/supabase/server";

export async function POST() {
  const { user } = await requireUser();
  const state = createOAuthState(user.id);
  return NextResponse.json({ url: buildGmailAuthUrl(state, true) });
}
