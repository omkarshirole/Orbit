import { NextResponse, type NextRequest } from "next/server";
import { manualOrderSchema, orderSearchSchema } from "@/lib/schemas";
import { detectCourier } from "@/lib/gmail/parser";
import { createSupabaseAdminClient, requireUser } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { user } = await requireUser();
  const { q, filter } = orderSearchSchema.parse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  const admin = createSupabaseAdminClient();
  let query = admin
    .from("orders")
    .select("*, shipments(*), returns(*)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (q) {
    query = query.or(
      `product_name.ilike.%${q}%,store.ilike.%${q}%,external_order_id.ilike.%${q}%`,
    );
  }
  if (filter && filter !== "all") {
    const statusMap: Record<string, string[]> = {
      active: [
        "ordered",
        "confirmed",
        "processing",
        "shipped",
        "in_transit",
        "arriving_soon",
        "out_for_delivery",
      ],
      shipped: ["shipped", "in_transit", "out_for_delivery"],
      delivered: ["delivered"],
      delayed: ["delayed", "failed", "delivery_attempted"],
      returns: [
        "return_requested",
        "return_in_transit",
        "returned",
        "refund_processing",
        "refunded",
      ],
      cancelled: ["cancelled"],
    };
    const statuses = statusMap[filter] || [filter];
    query = query.in("status", statuses);
  }

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ orders: data || [] });
}

export async function POST(request: Request) {
  const { user } = await requireUser();
  const input = manualOrderSchema.parse(await request.json());
  const detected: { courier?: string; courierSlug?: string } = input.courier
    ? { courier: input.courier }
    : detectCourier(input.trackingNumber);
  const admin = createSupabaseAdminClient();

  const { data: existingShipment } = await admin
    .from("shipments")
    .select("id, order_id")
    .eq("user_id", user.id)
    .eq("tracking_number", input.trackingNumber)
    .maybeSingle();
  if (existingShipment) {
    return NextResponse.json(
      { error: "This tracking number is already in Orbit." },
      { status: 409 },
    );
  }

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: user.id,
      store: input.store,
      product_name: input.productName,
      external_order_id: input.externalOrderId || null,
      price: input.price,
      currency: input.currency,
      estimated_delivery_at: input.estimatedDeliveryAt || null,
      status: "ordered",
      source: "manual",
    })
    .select("id")
    .single();

  if (orderError || !order)
    return NextResponse.json(
      { error: orderError?.message || "Order could not be created." },
      { status: 400 },
    );

  const { error: shipmentError } = await admin.from("shipments").insert({
    order_id: order.id,
    user_id: user.id,
    tracking_number: input.trackingNumber,
    courier: detected.courier || input.courier || null,
    courier_slug: detected.courierSlug || null,
    tracking_provider: "aftership",
  });

  if (shipmentError)
    return NextResponse.json({ error: shipmentError.message }, { status: 400 });
  return NextResponse.json({ id: order.id }, { status: 201 });
}
