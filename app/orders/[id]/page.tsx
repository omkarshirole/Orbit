import {
  ArrowLeft,
  Copy,
  ExternalLink,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
                  className="focus-ring inline-flex items-center gap-2 rounded-md border border-orbit-line px-3 py-2 text-sm font-semibold"
                >
                  <Icon size={16} />
                  {label as string}
                </button>
              ))}
            </div>
          </div>
          <dl className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["Order value", "INR 24,900"],
              ["Courier", "Blue Dart"],
              ["Tracking number", "BD892034781IN"],
              ["Estimated delivery", "Today"],
              ["Last checkpoint", "Reached local facility"],
              ["Data source", "Gmail"],
              ["Created", "Jul 11, 2026"],
              ["Updated", "Jul 14, 2026"],
            ].map(([label, value]) => (
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
  );
}
