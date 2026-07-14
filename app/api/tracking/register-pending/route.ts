import { NextResponse } from "next/server";
import { createSupabaseAdminClient, requireUser } from "@/lib/supabase/server";
import { AfterShipProvider } from "@/lib/tracking/aftership";

export async function POST() {
  const { user } = await requireUser();
  const admin = createSupabaseAdminClient();
  const provider = new AfterShipProvider();
  const { data: shipments } = await admin
    .from("shipments")
    .select("id, tracking_number, courier_slug, order_id, orders(product_name)")
    .eq("user_id", user.id)
    .is("provider_tracking_id", null)
    .limit(25);

  let registered = 0;
  for (const shipment of shipments || []) {
    try {
      const productName = (
        shipment as unknown as {
          orders?: { product_name?: string } | { product_name?: string }[];
        }
      ).orders;
      const result = await provider.registerTracking({
        trackingNumber: shipment.tracking_number,
        courierSlug: shipment.courier_slug,
        title: Array.isArray(productName)
          ? productName[0]?.product_name
          : productName?.product_name,
      });
      await admin
        .from("shipments")
        .update({
          provider_tracking_id: result.providerTrackingId,
          courier_slug: result.courierSlug || shipment.courier_slug,
          tracking_url: result.trackingUrl,
          last_synced_at: new Date().toISOString(),
        })
        .eq("id", shipment.id);
      registered++;
    } catch (error) {
      await admin.from("gmail_sync_logs").insert({
        user_id: user.id,
        order_id: shipment.order_id,
        stage: "aftership_register",
        level: "error",
        message:
          error instanceof Error
            ? error.message.slice(0, 500)
            : "AfterShip registration failed",
      });
    }
  }

  return NextResponse.json({ registered });
}
