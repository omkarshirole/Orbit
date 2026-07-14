import { NextResponse } from "next/server";
import { createSupabaseAdminClient, requireUser } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { user } = await requireUser();
  const body = await request
    .json()
    .catch(() => ({ deleteImportedOrders: false }));
  const admin = createSupabaseAdminClient();
  await admin.from("gmail_tokens").delete().eq("user_id", user.id);
  if (body.deleteImportedOrders) {
    await admin
      .from("orders")
      .delete()
      .eq("user_id", user.id)
      .eq("source", "gmail");
  }
  return NextResponse.json({ ok: true });
}
