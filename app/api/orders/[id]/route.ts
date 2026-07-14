import { NextResponse } from "next/server";
import { createSupabaseAdminClient, requireUser } from "@/lib/supabase/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user } = await requireUser();
  const { id } = await params;
  const { data, error } = await createSupabaseAdminClient()
    .from("orders")
    .select("*, shipments(*, tracking_events(*)), returns(*)")
    .eq("user_id", user.id)
    .eq("id", id)
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ order: data });
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user } = await requireUser();
  const { id } = await params;
  const { error } = await createSupabaseAdminClient()
    .from("orders")
    .delete()
    .eq("user_id", user.id)
    .eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
