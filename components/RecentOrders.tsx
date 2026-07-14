"use client";

import { clsx } from "clsx";
import {
  Plus,
  Truck,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { StatusBadge } from "./ui/status-badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";

const orders = [
  {
    id: "ord_apple",
    product: "AirPods Pro USB-C",
    store: "Apple",
    orderNumber: "APL-928312",
    status: "out_for_delivery" as const,
    courier: "Blue Dart",
    tracking: "BD892034781IN",
    price: "INR 24,900",
    eta: "Today",
    progress: 82,
    lastUpdate: "Reached local facility — 2 hrs ago",
  },
  {
    id: "ord_nike",
    product: "Nike Pegasus 41",
    store: "Nike",
    orderNumber: "NKE-55129",
    status: "in_transit" as const,
    courier: "Delhivery",
    tracking: "142536475869",
    price: "INR 11,895",
    eta: "Jul 17",
    progress: 56,
    lastUpdate: "Departed Gurugram hub — 4 hrs ago",
  },
  {
    id: "ord_flipkart",
    product: "Samsung T7 Shield SSD",
    store: "Flipkart",
    orderNumber: "OD431922",
    status: "delayed" as const,
    courier: "Ekart",
    tracking: "FMPC2938123890",
    price: "INR 8,499",
    eta: "Delayed",
    progress: 42,
    lastUpdate: "Delay at sorting center — 1 day ago",
  },
  {
    id: "ord_amazon",
    product: "Kindle Paperwhite",
    store: "Amazon",
    orderNumber: "AMZ-402819",
    status: "delivered" as const,
    courier: "Amazon Logistics",
    tracking: "TBA9876543210",
    price: "INR 12,999",
    eta: "Delivered Jul 12",
    progress: 100,
    lastUpdate: "Delivered to doorstep — 2 days ago",
  },
  {
    id: "ord_myntra",
    product: "Levi's 511 Jeans",
    store: "Myntra",
    orderNumber: "MYN-77321",
    status: "shipped" as const,
    courier: "Delhivery",
    tracking: "DHL1234567890",
    price: "INR 2,499",
    eta: "Jul 15",
    progress: 35,
    lastUpdate: "Picked up from warehouse — 6 hrs ago",
  },
];

const statusIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  out_for_delivery: Truck,
  in_transit: Truck,
  delayed: AlertTriangle,
  delivered: CheckCircle2,
  shipped: Package,
};

export function RecentOrders() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-3.5 w-3.5 mr-1" />
          New
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {orders.map((order) => {
            const Icon = statusIcons[order.status] || Package;
            return (
              <div
                key={order.id}
                className={clsx(
                  "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                  order.status === "delayed"
                    ? "border-red-200 bg-red-50"
                    : "border-[#edf0ec] hover:bg-[#f7f8f6]",
                )}
              >
                <div
                  className={clsx(
                    "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
                    order.status === "out_for_delivery" &&
                      "bg-amber-100 text-amber-600",
                    order.status === "in_transit" &&
                      "bg-green-100 text-green-600",
                    order.status === "delayed" && "bg-red-100 text-red-600",
                    order.status === "delivered" &&
                      "bg-green-100 text-green-600",
                    order.status === "shipped" && "bg-blue-100 text-blue-600",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#111111] truncate">
                    {order.product}
                  </p>
                  <p className="text-sm text-[#8d9890]">
                    {order.store} · {order.courier} ·{" "}
                    {order.status.replace("_", " ")}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-[#edf0ec]">
          <p className="text-sm text-[#8d9890] text-center">
            Showing 5 of 8 orders
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="ghost"
          className="w-full text-green-700 hover:bg-green-50"
        >
          View all orders
        </Button>
      </CardFooter>
    </Card>
  );
}
