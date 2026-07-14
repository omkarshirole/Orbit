"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  HelpCircle,
  Mail,
  Package,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { OrbitAppShell } from "./OrbitAppShell";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StatusBadge } from "./ui/status-badge";
import { useToast } from "./toast-provider";
import type { OrderStatus } from "@/lib/constants";

type SectionKind =
  | "orders"
  | "active"
  | "inTransit"
  | "delivered"
  | "delayed"
  | "returns"
  | "gmailSync"
  | "connections"
  | "settings"
  | "help";

const orders: {
  id: string;
  product: string;
  store: string;
  courier: string;
  tracking: string;
  eta: string;
  value: string;
  status: OrderStatus;
}[] = [
  {
    id: "ord_apple",
    product: "AirPods Pro USB-C",
    store: "Apple",
    courier: "Blue Dart",
    tracking: "BD892034781IN",
    eta: "Today",
    value: "INR 24,900",
    status: "out_for_delivery",
  },
  {
    id: "ord_nike",
    product: "Nike Pegasus 41",
    store: "Nike",
    courier: "Delhivery",
    tracking: "142536475869",
    eta: "Jul 17",
    value: "INR 11,895",
    status: "in_transit",
  },
  {
    id: "ord_flipkart",
    product: "Samsung T7 Shield SSD",
    store: "Flipkart",
    courier: "Ekart",
    tracking: "FMPC2938123890",
    eta: "Delayed",
    value: "INR 8,499",
    status: "delayed",
  },
  {
    id: "ord_amazon",
    product: "Kindle Paperwhite",
    store: "Amazon",
    courier: "Amazon Logistics",
    tracking: "TBA9876543210",
    eta: "Delivered Jul 12",
    value: "INR 12,999",
    status: "delivered",
  },
  {
    id: "ord_myntra",
    product: "Levi's 511 Jeans",
    store: "Myntra",
    courier: "Delhivery",
    tracking: "DHL1234567890",
    eta: "Jul 15",
    value: "INR 2,499",
    status: "shipped",
  },
];

const copy: Record<
  SectionKind,
  { title: string; description: string; eyebrow: string }
> = {
  orders: {
    title: "All Orders",
    description: "Search, inspect, and manage every tracked order in Orbit.",
    eyebrow: "Unified order list",
  },
  active: {
    title: "Active Orders",
    description: "Orders that are still moving, processing, or arriving soon.",
    eyebrow: "Needs tracking",
  },
  inTransit: {
    title: "In Transit",
    description: "Shipments currently moving through courier networks.",
    eyebrow: "Courier movement",
  },
  delivered: {
    title: "Delivered",
    description: "Completed deliveries with timeline and checkpoint history.",
    eyebrow: "Completed orders",
  },
  delayed: {
    title: "Delayed",
    description: "Shipments that need attention because delivery is delayed.",
    eyebrow: "Attention queue",
  },
  returns: {
    title: "Returns & Refunds",
    description: "Track return pickups, return transit, and refund progress.",
    eyebrow: "Reverse logistics",
  },
  gmailSync: {
    title: "Gmail Sync",
    description:
      "Import likely order emails safely with read-only Gmail access.",
    eyebrow: "Mailbox connection",
  },
  connections: {
    title: "Connections",
    description: "Manage Gmail, AfterShip, and Supabase connection health.",
    eyebrow: "Integrations",
  },
  settings: {
    title: "Settings",
    description:
      "Control privacy, notifications, exports, and account actions.",
    eyebrow: "Account controls",
  },
  help: {
    title: "Help",
    description: "Find setup guidance, troubleshooting, and safety notes.",
    eyebrow: "Support center",
  },
};

export function SectionPage({
  kind,
  initialSearch = "",
}: {
  kind: SectionKind;
  initialSearch?: string;
}) {
  const router = useRouter();
  const { notify } = useToast();
  const [search, setSearch] = useState(initialSearch.trim().toLowerCase());
  const page = copy[kind];

  useEffect(() => {
    const updateSearch = () => {
      const params = new URLSearchParams(window.location.search);
      setSearch(params.get("search")?.trim().toLowerCase() || "");
    };
    const updateFromEvent = (event: Event) => {
      setSearch(
        event instanceof CustomEvent
          ? String(event.detail || "")
              .trim()
              .toLowerCase()
          : "",
      );
    };
    updateSearch();
    window.addEventListener("popstate", updateSearch);
    window.addEventListener("orbit-search-change", updateFromEvent);
    return () => {
      window.removeEventListener("popstate", updateSearch);
      window.removeEventListener("orbit-search-change", updateFromEvent);
    };
  }, []);

  const filtered = useMemo(() => {
    const visibleOrders = getOrdersForKind(kind);
    if (!search) return visibleOrders;
    return visibleOrders.filter((order) =>
      [order.product, order.store, order.courier, order.tracking, order.eta]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [kind, search]);

  function exportOrders() {
    const header = ["Product", "Store", "Courier", "Tracking", "ETA", "Value"];
    const rows = filtered.map((order) => [
      order.product,
      order.store,
      order.courier,
      order.tracking,
      order.eta,
      order.value,
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${kind}-orders.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    notify(`${filtered.length} orders exported`);
  }

  if (kind === "gmailSync") return <GmailSyncPage page={page} />;
  if (kind === "connections") return <ConnectionsPage page={page} />;
  if (kind === "settings") return <SettingsPage page={page} />;
  if (kind === "help") return <HelpPage page={page} />;

  return (
    <OrbitAppShell
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      actions={
        <>
          <Button
            variant="outline"
            className="border-[#0f6b42]/35 bg-white"
            onClick={exportOrders}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            className="bg-gradient-to-br from-[#168252] to-[#064123]"
            onClick={() => {
              router.push("/dashboard");
              notify("Open Add Order from the dashboard header");
            }}
          >
            <Package className="mr-2 h-4 w-4" />
            Add Order
          </Button>
        </>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>{page.title}</CardTitle>
            <span className="rounded-full bg-[#f7f8f6] px-3 py-1 text-xs font-semibold text-[#78837b]">
              {filtered.length} {search ? "matches" : "orders"}
            </span>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {filtered.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="group grid gap-3 rounded-[22px] border border-[#edf0ec] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(19,33,24,0.08)] md:grid-cols-[1fr_auto]"
              >
                <div className="flex min-w-0 gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#eef8f1] text-[#0f6b42]">
                    {order.status === "delayed" ? (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    ) : order.status === "delivered" ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Truck className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-[#111111]">
                      {order.product}
                    </p>
                    <p className="truncate text-sm text-[#8d9890]">
                      {order.store} - {order.courier} - {order.tracking}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <StatusBadge status={order.status} />
                  <span className="text-sm font-semibold text-[#111111]">
                    {order.value}
                  </span>
                  <span className="text-sm text-[#8d9890]">{order.eta}</span>
                  <ExternalLink className="h-4 w-4 text-[#9aa49d] group-hover:text-[#0f6b42]" />
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-[22px] border border-dashed border-[#dfe8df] bg-white p-6 text-center text-sm font-semibold text-[#78837b]">
                No orders match this search.
              </div>
            )}
          </CardContent>
        </Card>
        <OrderSummary kind={kind} />
      </div>
    </OrbitAppShell>
  );
}

function getOrdersForKind(kind: SectionKind) {
  if (kind === "active") {
    return orders.filter(
      (order) => !["delivered", "cancelled", "refunded"].includes(order.status),
    );
  }
  if (kind === "inTransit") {
    return orders.filter((order) =>
      ["shipped", "in_transit", "out_for_delivery"].includes(order.status),
    );
  }
  if (kind === "delivered")
    return orders.filter((order) => order.status === "delivered");
  if (kind === "delayed")
    return orders.filter((order) => order.status === "delayed");
  if (kind === "returns") {
    return [
      {
        id: "ord_return",
        product: "Returned Linen Shirt",
        store: "Myntra",
        courier: "DTDC",
        tracking: "RET923014",
        eta: "Refund processing",
        value: "INR 1,799",
        status: "return_in_transit" as OrderStatus,
      },
    ];
  }
  return orders;
}

function OrderSummary({ kind }: { kind: SectionKind }) {
  const items = [
    ["Total value", "INR 60,792"],
    ["Courier partners", "6"],
    ["Last update", "2 hrs ago"],
    [
      kind === "delayed" ? "Attention needed" : "Realtime status",
      kind === "delayed" ? "1 issue" : "Enabled",
    ],
  ];

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle>Quick Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-[#f7f8f6] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8d9890]">
              {label}
            </p>
            <p className="mt-2 text-xl font-semibold text-[#111111]">{value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function GmailSyncPage({ page }: { page: (typeof copy)[SectionKind] }) {
  const { notify } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  async function syncNow() {
    setIsSyncing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setIsSyncing(false);
    notify("Gmail sync queued");
  }

  return (
    <OrbitAppShell
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      actions={
        <Button
          className="bg-gradient-to-br from-[#168252] to-[#064123]"
          onClick={syncNow}
          isLoading={isSyncing}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          {isSyncing ? "Syncing" : "Sync Gmail"}
        </Button>
      }
    >
      <div className="grid gap-5 xl:grid-cols-3">
        {[
          ["Connection", "Not connected locally", Mail],
          ["Last sync", "No live sync yet", RefreshCcw],
          ["Privacy", "Read-only Gmail access", ShieldCheck],
        ].map(([label, value, Icon]) => (
          <Card key={String(label)}>
            <CardContent className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef8f1] text-[#0f6b42]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-[#8d9890]">{String(label)}</p>
                <p className="font-semibold text-[#111111]">{String(value)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Sync History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {[
            "24 emails scanned",
            "3 orders added",
            "2 orders updated",
            "AfterShip registration queued",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-[#edf0ec] p-4 font-semibold text-[#111111]"
            >
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </OrbitAppShell>
  );
}

function ConnectionsPage({ page }: { page: (typeof copy)[SectionKind] }) {
  const { notify } = useToast();
  const cards = [
    [
      "Gmail",
      "Read-only access requested separately from sign-in.",
      "Connect Gmail",
      Mail,
    ],
    [
      "AfterShip",
      "Server-managed tracking API and webhook status.",
      "Register pending",
      Truck,
    ],
    [
      "Supabase",
      "Database, auth, RLS, and realtime status.",
      "Check status",
      ShieldCheck,
    ],
  ];
  return (
    <OrbitAppShell
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {cards.map(([title, text, action, Icon]) => (
          <Card key={String(title)}>
            <CardContent>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef8f1] text-[#0f6b42]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-xl font-semibold">{String(title)}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-[#8d9890]">
                {String(text)}
              </p>
              <Button
                variant="outline"
                className="mt-5 border-[#0f6b42]/35 bg-white"
                onClick={() => notify(`${String(title)} action opened`, "info")}
              >
                {String(action)}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </OrbitAppShell>
  );
}

function SettingsPage({ page }: { page: (typeof copy)[SectionKind] }) {
  return (
    <OrbitAppShell
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {[
          ["Notifications", "Delivery, delay, return, and refund alerts"],
          ["Privacy", "Export data, delete Gmail imports, or delete account"],
          ["Security", "OAuth tokens stay encrypted in backend storage"],
          ["Appearance", "Soft Orbit dashboard theme"],
        ].map(([title, text]) => (
          <Card key={title}>
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#111111]">
                  {title}
                </h2>
                <p className="mt-1 text-sm text-[#8d9890]">{text}</p>
              </div>
              <Settings className="h-5 w-5 text-[#0f6b42]" />
            </CardContent>
          </Card>
        ))}
      </div>
    </OrbitAppShell>
  );
}

function HelpPage({ page }: { page: (typeof copy)[SectionKind] }) {
  return (
    <OrbitAppShell
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          ["Connect Gmail", "Use Google Cloud OAuth and Gmail readonly scope."],
          [
            "AfterShip webhooks",
            "Set the webhook URL and secret in AfterShip.",
          ],
          ["Supabase setup", "Apply migrations and configure RLS-backed keys."],
        ].map(([title, text]) => (
          <Card key={title}>
            <CardContent>
              <HelpCircle className="h-8 w-8 text-[#0f6b42]" />
              <h2 className="mt-4 text-lg font-semibold text-[#111111]">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#8d9890]">{text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </OrbitAppShell>
  );
}
