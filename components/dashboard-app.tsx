"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Box,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Database,
  ExternalLink,
  Filter,
  Inbox,
  Link2,
  Loader2,
  Mail,
  Minus,
  Package,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  Shield,
  Truck,
  Undo2,
  User,
  X,
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
    lastUpdate: "Reached local facility — 2 hrs ago",
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
    lastUpdate: "Departed Gurugram hub — 4 hrs ago",
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
    lastUpdate: "Delay at sorting center — 1 day ago",
    progress: 42,
    source: "manual",
  },
  {
    id: "ord_amazon",
    productName: "Kindle Paperwhite",
    store: "Amazon",
    orderNumber: "AMZ-402819",
    status: "delivered",
    courier: "Amazon Logistics",
    trackingNumber: "TBA9876543210",
    price: "INR 12,999",
    eta: "Delivered Jul 12",
    lastUpdate: "Delivered to doorstep — 2 days ago",
    progress: 100,
    source: "gmail",
  },
  {
    id: "ord_myntra",
    productName: "Levi's 511 Jeans",
    store: "Myntra",
    orderNumber: "MYN-77321",
    status: "shipped",
    courier: "Delhivery",
    trackingNumber: "DHL1234567890",
    price: "INR 2,499",
    eta: "Jul 15",
    lastUpdate: "Picked up from warehouse — 6 hrs ago",
    progress: 35,
    source: "manual",
  },
];

const navItems = [
  { label: "Overview", icon: Package, href: "#" },
  { label: "All Orders", icon: Inbox, href: "#" },
  { label: "Active", icon: Clock, href: "#" },
  { label: "In Transit", icon: Truck, href: "#" },
  { label: "Delivered", icon: CheckCircle2, href: "#" },
  { label: "Delayed", icon: Bell, href: "#" },
  { label: "Returns & Refunds", icon: Undo2, href: "#" },
  { label: "Gmail Sync", icon: Mail, href: "#" },
  { label: "Connections", icon: Link2, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
] as const;

const filters = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "arriving_today", label: "Arriving Today" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "delayed", label: "Delayed" },
  { value: "returns", label: "Returns" },
  { value: "cancelled", label: "Cancelled" },
] as const;

const metrics = [
  { label: "Active Orders", value: "8", icon: Box, color: "text-orbit-primary", bg: "bg-orbit-primary/10" },
  { label: "Arriving Soon", value: "3", icon: Truck, color: "text-orbit-blue", bg: "bg-orbit-blue/10" },
  { label: "Delivered This Month", value: "14", icon: CheckCircle2, color: "text-orbit-green", bg: "bg-orbit-green/10" },
  { label: "Delayed Shipments", value: "1", icon: Bell, color: "text-orbit-red", bg: "bg-orbit-red/10" },
  { label: "Returns in Progress", value: "2", icon: Undo2, color: "text-orbit-orange", bg: "bg-orbit-orange/10" },
  { label: "Tracked Value", value: "INR 1.8L", icon: Package, color: "text-orbit-primary", bg: "bg-orbit-primary/10" },
] as const;

export function DashboardApp() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const haystack =
        `${order.productName} ${order.store} ${order.orderNumber} ${order.trackingNumber} ${order.courier}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "active" &&
          !["delivered", "cancelled", "returned", "refunded"].includes(order.status)) ||
        (filter === "arriving_today" && order.eta === "Today") ||
        (filter === "shipped" && ["shipped", "in_transit", "out_for_delivery"].includes(order.status)) ||
        (filter === "returns" && order.status.startsWith("return")) ||
        order.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  return (
    <div className="min-h-screen bg-orbit-wash text-orbit-ink">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-orbit-line transition-transform duration-200 ease-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-orbit-line px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orbit-primary">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-orbit-ink">Orbit</p>
              <p className="text-xs text-orbit-muted">Every order. One orbit.</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  index === 0
                    ? "bg-orbit-primary/10 text-orbit-primary"
                    : "text-orbit-muted hover:bg-orbit-wash hover:text-orbit-ink"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" size={18} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-orbit-line p-4">
            <div className="flex items-center gap-3 rounded-lg border border-indigo-100 bg-indigo-50 p-3">
              <Shield className="h-5 w-5 text-orbit-primary shrink-0" />
              <p className="text-xs text-orbit-muted">
                Orbit reads only order-related Gmail messages. We never send, edit, or delete emails.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-orbit-line bg-white/95 backdrop-blur px-4 md:px-6">
          <button
            className="lg:hidden p-2 rounded-lg text-orbit-muted hover:bg-orbit-wash"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Package className="h-6 w-6" />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-orbit-muted">Tuesday, July 14</p>
            <h1 className="text-xl font-semibold text-orbit-ink truncate">Order Command Center</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden sm:block relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orbit-muted" />
              <input
                type="search"
                placeholder="Search orders, stores, tracking..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-orbit-line bg-orbit-wash pl-10 pr-4 py-2 text-sm outline-none focus:border-orbit-primary focus:bg-white focus:ring-1 focus:ring-orbit-primary"
                aria-label="Search orders"
              />
            </div>

            {/* Notifications */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg text-orbit-muted hover:bg-orbit-wash"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orbit-primary text-[10px] font-bold text-white">
                3
              </span>
            </button>

            {/* Add Order */}
            <button
              onClick={() => setShowAdd(true)}
              className="hidden sm:flex items-center gap-2 rounded-lg bg-orbit-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orbit-primaryDark transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Order
            </button>

            {/* Mobile Add Order */}
            <button
              onClick={() => setShowAdd(true)}
              className="sm:hidden p-2 rounded-lg text-orbit-muted hover:bg-orbit-wash"
              aria-label="Add order"
            >
              <Plus className="h-5 w-5" />
            </button>

            {/* User avatar */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-orbit-line px-3 py-1.5">
              <User className="h-5 w-5 text-orbit-muted" />
              <span className="text-sm font-medium text-orbit-ink">User</span>
              <ChevronRight className="h-4 w-4 text-orbit-muted" />
            </div>
          </div>
        </header>

        {/* Mobile search */}
        <div className="sm:hidden border-b border-orbit-line px-4 py-3 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orbit-muted" />
            <input
              type="search"
              placeholder="Search orders, stores, tracking..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-orbit-line bg-orbit-wash pl-10 pr-4 py-2 text-sm outline-none focus:border-orbit-primary focus:bg-white focus:ring-1 focus:ring-orbit-primary"
              aria-label="Search orders"
            />
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 md:p-6">
          {notificationsOpen && <NotificationPanel onClose={() => setNotificationsOpen(false)} />}

          {/* Metrics */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </section>

          {/* Filters + Orders */}
          <section className="space-y-6">
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filter === f.value
                      ? "bg-orbit-primary text-white"
                      : "bg-white text-orbit-muted hover:bg-orbit-wash hover:text-orbit-ink"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Orders table */}
            <div className="rounded-xl border border-orbit-line bg-white shadow-sm overflow-hidden">
              {filteredOrders.length ? (
                <>
                  <OrderTable orders={filteredOrders} />
                </>
              ) : (
                <EmptyState />
              )}
            </div>
          </section>
        </main>
      </div>

      {showAdd && <AddOrderDialog onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, bg }: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }) {
  return (
    <div className="rounded-xl border border-orbit-line bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-orbit-muted">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-orbit-ink">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg} ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function OrderTable({ orders }: { orders: DemoOrder[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full" role="table">
        <thead>
          <tr className="border-b border-orbit-line bg-orbit-wash">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-orbit-muted">Order</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-orbit-muted">Store</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-orbit-muted">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-orbit-muted">Courier</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-orbit-muted">Tracking</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-orbit-muted">Price</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-orbit-muted">ETA</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-orbit-muted">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-orbit-line">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderRow({ order }: { order: DemoOrder }) {
  return (
    <tr className="hover:bg-orbit-wash/50 transition-colors">
      <td className="px-4 py-4">
        <Link href={`/orders/${order.id}`} className="font-medium text-orbit-ink hover:text-orbit-primary transition-colors">
          {order.productName}
        </Link>
        <p className="text-xs text-orbit-muted mt-0.5 truncate max-w-xs">{order.orderNumber}</p>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-orbit-ink">{order.store}</span>
          {order.source === "gmail" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orbit-primary/10 px-2 py-0.5 text-[10px] font-medium text-orbit-primary">
              Gmail
            </span>
          )}
          {order.source === "manual" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orbit-blue/10 px-2 py-0.5 text-[10px] font-medium text-orbit-blue">
              Manual
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-4 py-4 text-sm text-orbit-ink">{order.courier}</td>
      <td className="px-4 py-4">
        <code className="text-sm font-mono text-orbit-muted bg-orbit-wash px-2 py-1 rounded">{order.trackingNumber}</code>
      </td>
      <td className="px-4 py-4 text-right text-sm font-medium text-orbit-ink">{order.price}</td>
      <td className="px-4 py-4">
        <span className={order.status === "delayed" ? "text-orbit-red font-medium" : "text-sm text-orbit-ink"}>
          {order.eta}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-2">
          <button className="p-2 rounded-lg text-orbit-muted hover:bg-orbit-wash hover:text-orbit-ink transition-colors" aria-label="Copy tracking">
            <Copy className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-lg text-orbit-muted hover:bg-orbit-wash hover:text-orbit-ink transition-colors" aria-label="Refresh tracking">
            <RefreshCcw className="h-4 w-4" />
          </button>
          <Link href={`/orders/${order.id}`} className="p-2 rounded-lg text-orbit-muted hover:bg-orbit-wash hover:text-orbit-ink transition-colors" aria-label="View details">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orbit-wash">
        <Package className="h-8 w-8 text-orbit-muted" />
      </div>
      <h3 className="text-lg font-semibold text-orbit-ink">No orders found</h3>
      <p className="mt-1 text-sm text-orbit-muted">Try adjusting your filters or search, or add a tracking number manually.</p>
    </div>
  );
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const notifications = [
    { id: 1, title: "AirPods Pro is out for delivery", time: "2 hrs ago", type: "out_for_delivery" },
    { id: 2, title: "Nike Pegasus departed Gurugram hub", time: "4 hrs ago", type: "in_transit" },
    { id: 3, title: "Flipkart shipment is delayed", time: "1 day ago", type: "delayed" },
  ];

  return (
    <div className="mb-6 rounded-xl border border-orbit-line bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-orbit-line px-4 py-3">
        <h2 className="font-semibold text-orbit-ink">Recent Notifications</h2>
        <button onClick={onClose} className="p-1 rounded-lg text-orbit-muted hover:bg-orbit-wash">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="divide-y divide-orbit-line">
        {notifications.map((n) => (
          <Link key={n.id} href="/orders/ord_apple" className="flex items-center gap-3 px-4 py-3 hover:bg-orbit-wash/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orbit-primary/10">
              {n.type === "out_for_delivery" && <Truck className="h-5 w-5 text-orbit-primary" />}
              {n.type === "in_transit" && <Package className="h-5 w-5 text-orbit-blue" />}
              {n.type === "delayed" && <Bell className="h-5 w-5 text-orbit-red" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-orbit-ink truncate">{n.title}</p>
              <p className="text-xs text-orbit-muted">{n.time}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-orbit-muted shrink-0" />
          </Link>
        ))}
      </div>
      <div className="px-4 py-3">
        <button className="w-full text-sm font-medium text-orbit-primary hover:text-orbit-primaryDark">
          View all notifications
        </button>
      </div>
    </div>
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
        throw new Error(result.error || "Sign in and configure Supabase before saving orders.");
      }
      setMessage("Order saved. Realtime updates will appear in the dashboard.");
      setTimeout(onClose, 800);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Order could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        <form onSubmit={submitOrder} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-orbit-ink">Add Order</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-lg text-orbit-muted hover:bg-orbit-wash">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {([
              ["Store", "store", "text", true] as const,
              ["Product Name", "productName", "text", true] as const,
              ["Order Number", "externalOrderId", "text", false] as const,
              ["Tracking Number", "trackingNumber", "text", true] as const,
              ["Courier", "courier", "text", false] as const,
              ["Order Value", "price", "number", false] as const,
              ["Currency", "currency", "text", false] as const,
              ["Expected Delivery", "estimatedDeliveryAt", "date", false] as const,
            ]).map(([label, name, type, required]) => (
              <label key={label} className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-orbit-ink">{label}{required && <span className="text-orbit-red ml-1">*</span>}</span>
                <input
                  required={required}
                  name={name}
                  type={type}
                  defaultValue={label === "Currency" ? "INR" : undefined}
                  className="rounded-lg border border-orbit-line px-3 py-2.5 text-sm outline-none focus:border-orbit-primary focus:ring-1 focus:ring-orbit-primary transition-colors"
                />
              </label>
            ))}
          </div>

          {message && (
            <div className="mt-4 rounded-lg border p-3 text-sm flex items-start gap-2">
              {message.startsWith("Order saved") ? (
                <CheckCircle2 className="h-5 w-5 text-orbit-green shrink-0 mt-0.5" />
              ) : (
                <Bell className="h-5 w-5 text-orbit-red shrink-0 mt-0.5" />
              )}
              <span className={message.startsWith("Order saved") ? "text-orbit-green" : "text-orbit-red"}>{message}</span>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg border border-orbit-line font-medium text-orbit-ink hover:bg-orbit-wash transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="px-4 py-2.5 rounded-lg bg-orbit-primary font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-orbit-primaryDark transition-colors flex items-center gap-2">
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}