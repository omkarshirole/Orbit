import { NextResponse } from "next/server";
import { createSupabaseAdminClient, requireUser } from "@/lib/supabase/server";
import { syncGmailOrders } from "@/lib/gmail/sync";

export async function POST() {
  const { user } = await requireUser();
  const stats = await syncGmailOrders(createSupabaseAdminClient(), user.id);
  return NextResponse.json(stats);
}
