import { NextResponse } from "next/server";
import { notificationUpdateSchema } from "@/lib/schemas";
import { createSupabaseAdminClient, requireUser } from "@/lib/supabase/server";

export async function GET() {
  const { user } = await requireUser();
  const { data, error } = await createSupabaseAdminClient()
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ notifications: data || [] });
}

export async function PATCH(request: Request) {
  const { user } = await requireUser();
  const body = notificationUpdateSchema.parse(await request.json());
  const query = createSupabaseAdminClient()
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", user.id);
  const { error } = body.markAll
    ? await query.is("read_at", null)
    : await query.eq("id", body.notificationId);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
