"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock3,
  Copy,
  Database,
  ExternalLink,
  Filter,
  Inbox,
  Link2,
  Mail,
  Package,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  ShieldCheck,
  Truck,
  Undo2,
  UserCircle,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import type { OrderStatus } from "@/lib/constants";

type DemoOrder = {
  id: string;
  productName: string;
  store: string;
  orderNumber: string;
  status: OrderStatus;
  courier: string;
  trackingNumber: string;
  price: string;
  eta: string;
  lastUpdate: string;
  progress: number;
  source: "gmail" | "manual";
};

const orders: DemoOrder[] = [
  {
    id: "ord_apple",
    productName: "AirPods Pro USB-C",
    store: "Apple",
    orderNumber: "APL-928312",
    status: "out_for_delivery",
    courier: "Blue Dart",
    trackingNumber: "BD892034781IN",
    price: "INR 24,900",
    eta: "Today",
    lastUpdate: "Reached local facility",
    progress: 82,
    source: "gmail",
  },
  {
    id: "ord_nike",
    productName: "Nike Pegasus 41",
    store: "Nike",
    orderNumber: "NKE-55129",
    status: "in_transit",
    courier: "Delhivery",
    trackingNumber: "142536475869",
    price: "INR 11,895",
    eta: "Jul 17",
    lastUpdate: "Departed Gurugram hub",
    progress: 56,
    source: "gmail",
  },
  {
    id: "ord_flipkart",
    productName: "Samsung T7 Shield SSD",
    store: "Flipkart",
    orderNumber: "OD431922",
    status: "delayed",
    courier: "Ekart",
    trackingNumber: "FMPC2938123890",
    price: "INR 8,499",
    eta: "Delayed",
    lastUpdate: "Delay at sorting center",
    progress: 42,
    source: "manual",
  },
];

const nav = [
  ["Overview", Package],
  ["All Orders", Inbox],
  ["Active", Clock3],
  ["In Transit", Truck],
  ["Delivered", CheckCircle2],
  ["Delayed", Bell],
  ["Returns and Refunds", Undo2],
  ["Gmail Sync", Mail],
  ["Connections", Link2],
  ["Settings", Settings],
] as const;

const filters = [
  "all",
  "active",
  "arriving today",
  "shipped",
  "delivered",
  "delayed",
  "returns",
  "cancelled",
];

export function DashboardApp() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const haystack =
        `${order.productName} ${order.store} ${order.orderNumber} ${order.trackingNumber} ${order.courier}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "active" &&
          !["delivered", "cancelled", "returned", "refunded"].includes(
            order.status,
          )) ||
        (filter === "arriving today" && order.eta === "Today") ||
        (filter === "shipped" &&
          ["shipped", "in_transit", "out_for_delivery"].includes(
            order.status,
          )) ||
        (filter === "returns" && order.status.startsWith("return")) ||
        order.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  return (
    <div className="min-h-screen bg-orbit-wash text-orbit-ink">
      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[260px_1fr]">
        <aside className="hidden min-h-screen border-r border-orbit-line bg-white px-4 py-6 lg:block">
          <div className="mb-8 px-2">
            <p className="text-xl font-semibold">Orbit</p>
            <p className="text-sm text-orbit-muted">Every order. One orbit.</p>
          </div>
          <nav className="space-y-1">
            {nav.map(([label, Icon], index) => (
              <button
                key={label}
                className={`focus-ring flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium ${index === 0 ? "bg-indigo-50 text-orbit-primary" : "text-orbit-muted hover:bg-orbit-wash"}`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 px-4 py-5 md:px-8">
          <header className="sticky top-0 z-10 -mx-4 mb-6 border-b border-orbit-line bg-orbit-wash/95 px-4 pb-4 backdrop-blur md:-mx-8 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-orbit-muted">
                  Tuesday, July 14
                </p>
                <h1 className="text-2xl font-semibold md:text-3xl">
                  Order command center
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <label className="focus-within:ring-orbit-primary flex min-w-0 flex-1 items-center gap-2 rounded-md border border-orbit-line bg-white px-3 py-2 shadow-sm focus-within:ring-2 md:w-80">
                  <Search size={18} className="text-orbit-muted" />
                  <input
                    aria-label="Search orders"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search orders, stores, tracking"
                    className="min-w-0 flex-1 border-0 bg-transparent outline-none"
                  />
                </label>
                <button
                  onClick={() => setNotificationsOpen((value) => !value)}
                  aria-label="Notifications"
                  className="focus-ring relative rounded-md border border-orbit-line bg-white p-2.5 shadow-sm"
                >
                  <Bell size={19} />
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-orbit-primary text-[11px] font-bold text-white">
                    3
                  </span>
                </button>
                <button
                  onClick={() => setShowAdd(true)}
                  className="focus-ring inline-flex items-center gap-2 rounded-md bg-orbit-primary px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orbit-primaryDark"
                >
                  <Plus size={18} />
                  Add Order
                </button>
                <UserCircle
                  className="hidden text-orbit-muted md:block"
                  size={30}
                />
              </div>
            </div>
          </header>

          {notificationsOpen && <NotificationPanel />}

          <section className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {[
              ["Active orders", "8"],
              ["Arriving soon", "3"],
              ["Delivered this month", "14"],
              ["Delayed shipments", "1"],
              ["Returns in progress", "2"],
              ["Tracked value", "INR 1.8L"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-orbit-line bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-medium uppercase text-orbit-muted">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-semibold">{value}</p>
              </div>
            ))}
          </section>

          <section className="mt-6 rounded-lg border border-orbit-line bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Filter size={18} className="text-orbit-muted" />
              {filters.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`focus-ring rounded-full px-3 py-1.5 text-sm font-medium capitalize ${filter === item ? "bg-orbit-primary text-white" : "bg-orbit-wash text-orbit-muted hover:text-orbit-ink"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {filteredOrders.length ? (
                filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-orbit-line bg-white p-10 text-center">
                  <Package className="mx-auto text-orbit-muted" />
                  <h2 className="mt-3 text-lg font-semibold">
                    No orders found
                  </h2>
                  <p className="mt-1 text-sm text-orbit-muted">
                    Try another search or add a tracking number manually.
                  </p>
                </div>
              )}
            </div>
            <ConnectionsPanel />
          </section>
        </main>
      </div>
      {showAdd && <AddOrderDialog onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function OrderCard({ order }: { order: DemoOrder }) {
  return (
    <article className="rounded-lg border border-orbit-line bg-white p-4 shadow-sm transition hover:shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-md bg-orbit-wash">
          <Package size={30} className="text-orbit-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">{order.productName}</h2>
              <p className="text-sm text-orbit-muted">
                {order.store} · {order.orderNumber}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
            <span>
              <b>Courier</b>
              <br />
              {order.courier}
            </span>
            <span>
              <b>Tracking</b>
              <br />
              {order.trackingNumber}
            </span>
            <span>
              <b>Price</b>
              <br />
              {order.price}
            </span>
            <span>
              <b>ETA</b>
              <br />
              {order.eta}
            </span>
          </div>
          <div className="mt-4">
            <div className="h-2 rounded-full bg-orbit-wash">
              <div
                className="h-2 rounded-full bg-orbit-primary"
                style={{ width: `${order.progress}%` }}
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-orbit-muted">
              <span>{order.lastUpdate}</span>
              {order.status === "delayed" && (
                <span className="font-semibold text-orbit-red">
                  Attention needed
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 md:flex-col">
          <Link
            href={`/orders/${order.id}`}
            className="focus-ring rounded-md border border-orbit-line p-2 text-orbit-muted hover:text-orbit-primary"
            aria-label="Open order details"
          >
            <ExternalLink size={18} />
          </Link>
          <button
            className="focus-ring rounded-md border border-orbit-line p-2 text-orbit-muted hover:text-orbit-primary"
            aria-label="Copy tracking number"
          >
            <Copy size={18} />
          </button>
          <button
            className="focus-ring rounded-md border border-orbit-line p-2 text-orbit-muted hover:text-orbit-primary"
            aria-label="Refresh tracking"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

function ConnectionsPanel() {
  return (
    <aside className="space-y-4">
      <div className="rounded-lg border border-orbit-line bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Connections</h2>
        <div className="mt-4 space-y-3">
          <Connection
            icon={Mail}
            title="Gmail"
            detail="Connected account: not configured locally"
            action="Connect"
          />
          <Connection
            icon={Truck}
            title="AfterShip"
            detail="Server-managed. Credentials never shown."
            action="Register pending"
          />
          <Connection
            icon={Database}
            title="Supabase"
            detail="Database status depends on environment."
            action="Check"
          />
        </div>
      </div>
      <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-5 text-sm leading-6 text-orbit-muted">
        <ShieldCheck className="mb-3 text-orbit-primary" />
        Orbit reads only the Gmail messages required to identify online orders
        and shipment updates. Orbit does not send, edit or delete emails.
      </div>
    </aside>
  );
}

function Connection({
  icon: Icon,
  title,
  detail,
  action,
}: {
  icon: typeof Mail;
  title: string;
  detail: string;
  action: string;
}) {
  return (
    <div className="rounded-md border border-orbit-line p-3">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 text-orbit-primary" size={18} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-orbit-muted">{detail}</p>
        </div>
        <button className="focus-ring rounded-md border border-orbit-line px-2.5 py-1.5 text-xs font-semibold">
          {action}
        </button>
      </div>
    </div>
  );
}

function NotificationPanel() {
  return (
    <section className="mb-6 rounded-lg border border-orbit-line bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Recent notifications</h2>
        <button className="focus-ring text-sm font-semibold text-orbit-primary">
          Mark all as read
        </button>
      </div>
      {[
        "AirPods Pro is out for delivery",
        "Nike Pegasus departed Gurugram hub",
        "Flipkart shipment is delayed",
      ].map((message) => (
        <Link
          key={message}
          href="/orders/ord_apple"
          className="mt-3 block rounded-md border border-orbit-line p-3 text-sm hover:bg-orbit-wash"
        >
          {message}
        </Link>
      ))}
    </section>
  );
}

function AddOrderDialog({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      store: String(form.get("store") || ""),
      productName: String(form.get("productName") || ""),
      externalOrderId: String(form.get("externalOrderId") || ""),
      trackingNumber: String(form.get("trackingNumber") || ""),
      courier: String(form.get("courier") || ""),
      price: form.get("price") ? Number(form.get("price")) : undefined,
      currency: String(form.get("currency") || "INR").toUpperCase(),
      estimatedDeliveryAt: form.get("estimatedDeliveryAt")
        ? new Date(String(form.get("estimatedDeliveryAt"))).toISOString()
        : "",
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          result.error ||
            "Sign in and configure Supabase before saving orders.",
        );
      }
      setMessage("Order saved. Realtime updates will appear in the dashboard.");
      setTimeout(onClose, 800);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Order could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/30 p-4">
      <form
        className="w-full max-w-2xl rounded-lg bg-white p-5 shadow-soft"
        onSubmit={submitOrder}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add order</h2>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded-md border border-orbit-line px-3 py-1.5"
          >
            Close
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["Store", "store", "text"],
            ["Product name", "productName", "text"],
            ["Order number", "externalOrderId", "text"],
            ["Tracking number", "trackingNumber", "text"],
            ["Courier", "courier", "text"],
            ["Order value", "price", "number"],
            ["Currency", "currency", "text"],
            ["Expected delivery date", "estimatedDeliveryAt", "date"],
          ].map(([label, name, type]) => (
            <label key={label} className="text-sm font-medium">
              {label}
              <input
                required={["Store", "Product name", "Tracking number"].includes(
                  label,
                )}
                name={name}
                className="focus-ring mt-1 w-full rounded-md border border-orbit-line px-3 py-2"
                type={type}
                defaultValue={label === "Currency" ? "INR" : undefined}
              />
            </label>
          ))}
        </div>
        {message && (
          <p className="mt-4 rounded-md border border-orbit-line bg-orbit-wash p-3 text-sm text-orbit-muted">
            {message}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded-md border border-orbit-line px-4 py-2 font-semibold"
          >
            Cancel
          </button>
          <button
            disabled={isSaving}
            className="focus-ring rounded-md bg-orbit-primary px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save order"}
          </button>
        </div>
      </form>
    </div>
  );
}
