import { NextResponse } from "next/server";
import {
  AfterShipProvider,
  parseAfterShipWebhook,
} from "@/lib/tracking/aftership";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const notificationTitles: Record<string, string> = {
  shipped: "Order shipped",
  in_transit: "Order is moving",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  delayed: "Shipment delayed",
  failed: "Delivery failed",
  return_requested: "Return accepted",
  refunded: "Refunded",
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("aftership-hmac-sha256");
  const provider = new AfterShipProvider();
  if (!provider.verifyWebhook(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const parsed = parseAfterShipWebhook(JSON.parse(rawBody));
  const admin = createSupabaseAdminClient();
  const { data: shipment } = await admin
    .from("shipments")
    .select("id, order_id, user_id")
    .or(
      [
        parsed.providerTrackingId
          ? `provider_tracking_id.eq.${parsed.providerTrackingId}`
          : "",
        parsed.trackingNumber
          ? `tracking_number.eq.${parsed.trackingNumber}`
          : "",
      ]
        .filter(Boolean)
        .join(","),
    )
    .maybeSingle();

  if (!shipment) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  for (const event of parsed.events) {
    await admin.from("tracking_events").upsert(
      {
        shipment_id: shipment.id,
        user_id: shipment.user_id,
        provider_event_id: event.providerEventId,
        status: event.status,
        original_status: event.originalStatus,
        title: event.title,
        description: event.description,
        location: event.location,
        occurred_at: event.occurredAt,
        raw_payload: event.rawPayload,
      },
      { onConflict: "shipment_id,provider_event_id" },
    );
  }

  await admin
    .from("shipments")
    .update({
      last_checkpoint: parsed.checkpoint,
      last_synced_at: new Date().toISOString(),
    })
    .eq("id", shipment.id);

  if (parsed.latestStatus) {
    await admin
      .from("orders")
      .update({
        status: parsed.latestStatus,
        original_status: parsed.originalStatus,
      })
      .eq("id", shipment.order_id);
    const title = notificationTitles[parsed.latestStatus];
    if (title) {
      await admin.from("notifications").upsert(
        {
          user_id: shipment.user_id,
          order_id: shipment.order_id,
          title,
          message:
            parsed.checkpoint ||
            parsed.originalStatus ||
            "Shipment status changed.",
          notification_type: parsed.latestStatus,
        },
        { onConflict: "user_id,order_id,notification_type,message" },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
