"use client";

import { clsx } from "clsx";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Package,
  Plus,
  Truck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StatusBadge } from "./ui/status-badge";
import { Button } from "./ui/button";

const orders = [
  {
    id: "ord_apple",
    product: "AirPods Pro USB-C",
    store: "Apple",
    status: "out_for_delivery" as const,
    courier: "Blue Dart",
    eta: "Today",
  },
  {
    id: "ord_nike",
    product: "Nike Pegasus 41",
    store: "Nike",
    status: "in_transit" as const,
    courier: "Delhivery",
    eta: "Jul 17",
  },
  {
    id: "ord_flipkart",
    product: "Samsung T7 Shield SSD",
    store: "Flipkart",
    status: "delayed" as const,
    courier: "Ekart",
    eta: "Delayed",
  },
  {
    id: "ord_amazon",
    product: "Kindle Paperwhite",
    store: "Amazon",
    status: "delivered" as const,
    courier: "Amazon Logistics",
    eta: "Delivered Jul 12",
  },
  {
    id: "ord_myntra",
    product: "Levi's 511 Jeans",
    store: "Myntra",
    status: "shipped" as const,
    courier: "Delhivery",
    eta: "Jul 15",
  },
];

const statusIcons = {
  out_for_delivery: Truck,
  in_transit: Truck,
  delayed: AlertTriangle,
  delivered: CheckCircle2,
  shipped: Package,
};

export function RecentOrders() {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle>Recent Orders</CardTitle>
        <Button variant="outline" size="sm" className="border-[#0f6b42]/30">
          <Plus className="mr-1 h-3.5 w-3.5" />
          New
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-3 md:grid-cols-2">
          {orders.map((order) => {
            const Icon = statusIcons[order.status] || Package;
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className={clsx(
                  "group flex items-center gap-3 rounded-[20px] border p-3 transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(19,33,24,0.08)]",
                  order.status === "delayed"
                    ? "border-red-100 bg-red-50"
                    : "border-[#edf0ec] bg-white hover:bg-[#fbfcfa]",
                )}
              >
                <div
                  className={clsx(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                    order.status === "out_for_delivery" &&
                      "bg-amber-100 text-amber-600",
                    order.status === "in_transit" &&
                      "bg-green-100 text-green-700",
                    order.status === "delayed" && "bg-red-100 text-red-600",
                    order.status === "delivered" &&
                      "bg-green-100 text-green-700",
                    order.status === "shipped" && "bg-blue-100 text-blue-600",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[#111111]">
                    {order.product}
                  </p>
                  <p className="truncate text-sm text-[#8d9890]">
                    {order.store} · {order.courier} · {order.eta}
                  </p>
                </div>
                <div className="hidden shrink-0 items-center gap-2 sm:flex">
                  <StatusBadge status={order.status} />
                  <ExternalLink className="h-4 w-4 text-[#9aa49d] transition group-hover:text-[#0f6b42]" />
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
