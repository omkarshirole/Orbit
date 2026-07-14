<<<<<<< HEAD
=======
import Link from "next/link";
>>>>>>> 2870ac1 (Initial commit)
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  RefreshCcw,
  Trash2,
} from "lucide-react";
<<<<<<< HEAD
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
=======
import { OrbitAppShell } from "@/components/OrbitAppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { OrderStatus } from "@/lib/constants";

const orderMap: Record<
  string,
  {
    product: string;
    store: string;
    orderNumber: string;
    status: OrderStatus;
    courier: string;
    tracking: string;
    value: string;
    eta: string;
    checkpoint: string;
  }
> = {
  ord_apple: {
    product: "AirPods Pro USB-C",
    store: "Apple",
    orderNumber: "APL-928312",
    status: "out_for_delivery",
    courier: "Blue Dart",
    tracking: "BD892034781IN",
    value: "INR 24,900",
    eta: "Today",
    checkpoint: "Reached local facility",
  },
  ord_nike: {
    product: "Nike Pegasus 41",
    store: "Nike",
    orderNumber: "NKE-55129",
    status: "in_transit",
    courier: "Delhivery",
    tracking: "142536475869",
    value: "INR 11,895",
    eta: "Jul 17",
    checkpoint: "Departed Gurugram hub",
  },
  ord_flipkart: {
    product: "Samsung T7 Shield SSD",
    store: "Flipkart",
    orderNumber: "OD431922",
    status: "delayed",
    courier: "Ekart",
    tracking: "FMPC2938123890",
    value: "INR 8,499",
    eta: "Delayed",
    checkpoint: "Delay at sorting center",
  },
};
>>>>>>> 2870ac1 (Initial commit)

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
<<<<<<< HEAD
  const status = id.includes("flipkart") ? "delayed" : "out_for_delivery";

  return (
    <main className="min-h-screen bg-orbit-wash px-4 py-6 text-orbit-ink">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="focus-ring inline-flex items-center gap-2 rounded-md text-sm font-semibold text-orbit-primary"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>
        <section className="mt-5 rounded-lg border border-orbit-line bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-medium text-orbit-muted">
                Apple · APL-928312
              </p>
              <h1 className="mt-1 text-3xl font-semibold">AirPods Pro USB-C</h1>
              <div className="mt-3">
                <StatusBadge status={status} />
=======
  const order = orderMap[id] || orderMap.ord_apple;

  return (
    <OrbitAppShell
      eyebrow="Shipment details"
      title={order.product}
      description={`${order.store} - ${order.orderNumber} - ${order.courier}`}
      actions={
        <Link
          href="/orders"
          className="inline-flex h-11 items-center justify-center rounded-full border border-[#0f6b42]/35 bg-white px-5 text-sm font-semibold text-[#0b4f30] shadow-sm hover:bg-[#f2f8f4]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          All Orders
        </Link>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Order Details</CardTitle>
              <div className="mt-3">
                <StatusBadge status={order.status} />
>>>>>>> 2870ac1 (Initial commit)
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                ["Copy tracking", Copy],
                ["Open courier", ExternalLink],
                ["Refresh", RefreshCcw],
                ["Delete", Trash2],
              ].map(([label, Icon]) => (
                <button
                  key={label as string}
<<<<<<< HEAD
                  className="focus-ring inline-flex items-center gap-2 rounded-md border border-orbit-line px-3 py-2 text-sm font-semibold"
                >
                  <Icon size={16} />
=======
                  className="inline-flex items-center gap-2 rounded-full border border-[#edf0ec] bg-white px-3 py-2 text-sm font-semibold text-[#111111] hover:bg-[#f7f8f6]"
                >
                  <Icon className="h-4 w-4" />
>>>>>>> 2870ac1 (Initial commit)
                  {label as string}
                </button>
              ))}
            </div>
<<<<<<< HEAD
          </div>
          <dl className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["Order value", "INR 24,900"],
              ["Courier", "Blue Dart"],
              ["Tracking number", "BD892034781IN"],
              ["Estimated delivery", "Today"],
              ["Last checkpoint", "Reached local facility"],
=======
          </CardHeader>
          <CardContent className="grid gap-3 pt-0 md:grid-cols-4">
            {[
              ["Order value", order.value],
              ["Courier", order.courier],
              ["Tracking number", order.tracking],
              ["Estimated delivery", order.eta],
              ["Last checkpoint", order.checkpoint],
>>>>>>> 2870ac1 (Initial commit)
              ["Data source", "Gmail"],
              ["Created", "Jul 11, 2026"],
              ["Updated", "Jul 14, 2026"],
            ].map(([label, value]) => (
<<<<<<< HEAD
              <div
                key={label}
                className="rounded-md border border-orbit-line p-3"
              >
                <dt className="text-xs font-semibold uppercase text-orbit-muted">
                  {label}
                </dt>
                <dd className="mt-1 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="mt-5 rounded-lg border border-orbit-line bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Shipment timeline</h2>
          <ol className="mt-5 space-y-4">
            {[
              "Order confirmed",
              "Shipment picked up",
              "Departed origin hub",
              "Reached local facility",
              "Out for delivery",
            ].map((event, index) => (
              <li key={event} className="flex gap-3">
                <span
                  className={`mt-1 h-3 w-3 rounded-full ${index === 4 ? "bg-orbit-orange" : "bg-orbit-primary"}`}
                />
                <div>
                  <p className="font-semibold">{event}</p>
                  <p className="text-sm text-orbit-muted">
                    Checkpoint {index + 1} · provider status preserved in
                    tracking_events.original_status
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
=======
              <div key={label} className="rounded-2xl bg-[#f7f8f6] p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8d9890]">
                  {label}
                </dt>
                <dd className="mt-2 font-semibold text-[#111111]">{value}</dd>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipment Timeline</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ol className="space-y-4">
              {[
                "Order confirmed",
                "Shipment picked up",
                "Departed origin hub",
                order.checkpoint,
                "Out for delivery",
              ].map((event, index) => (
                <li key={`${event}-${index}`} className="flex gap-3">
                  <span
                    className={`mt-1 h-3 w-3 rounded-full ${
                      index === 4 ? "bg-[#c46d17]" : "bg-[#0f6b42]"
                    }`}
                  />
                  <div>
                    <p className="font-semibold text-[#111111]">{event}</p>
                    <p className="text-sm text-[#8d9890]">
                      Checkpoint {index + 1} - provider status preserved
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </OrbitAppShell>
>>>>>>> 2870ac1 (Initial commit)
  );
}
