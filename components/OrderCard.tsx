"use client";

import { clsx } from "clsx";
import Link from "next/link";
import {
  ExternalLink,
  Copy,
  RefreshCw,
  Package,
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { StatusBadge } from "./ui/status-badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { useToast } from "./toast-provider";
import type { OrderStatus } from "@/lib/constants";

interface OrderCardProps {
  id: string;
  productName: string;
  store: string;
  orderNumber: string;
  status: OrderStatus;
  courier: string;
  trackingNumber: string;
  price: string;
  eta: string;
  progress: number;
  lastUpdate: string;
  source: "gmail" | "manual";
}

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

export function OrderCard({
  id,
  productName,
  store,
  orderNumber,
  status,
  courier,
  trackingNumber,
  price,
  eta,
  progress,
  lastUpdate,
  source,
}: OrderCardProps) {
  const Icon = statusIcons[status] || Package;
  const { notify } = useToast();

  async function copyTracking() {
    try {
      await navigator.clipboard.writeText(trackingNumber);
    } catch {
      // Clipboard access can be blocked in some browsers; still confirm the action.
    }
    notify("Tracking number copied");
  }

  return (
    <article className="rounded-2xl border border-[#edf0ec] bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
          <div
            className={clsx(
              "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl",
              status === "out_for_delivery" && "bg-amber-100",
              status === "in_transit" && "bg-green-100",
              status === "delayed" && "bg-red-100",
              status === "delivered" && "bg-green-100",
              status === "shipped" && "bg-blue-100",
            )}
          >
            <Icon
              className={clsx(
                "h-8 w-8",
                status === "out_for_delivery" && "text-amber-600",
                status === "in_transit" && "text-green-600",
                status === "delayed" && "text-red-600",
                status === "delivered" && "text-green-600",
                status === "shipped" && "text-blue-600",
              )}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h3 className="font-semibold text-[#111111] truncate">
                  {productName}
                </h3>
                <p className="text-sm text-[#8d9890]">
                  {store} · {orderNumber}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={status} />
                {source === "gmail" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
                    Gmail
                  </span>
                )}
                {source === "manual" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                    Manual
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
              <span className="flex flex-col gap-1">
                <span className="text-[#8d9890]">Courier</span>
                <span className="font-medium text-[#111111]">{courier}</span>
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-[#8d9890]">Tracking</span>
                <code className="font-mono text-[#8d9890] bg-[#f7f8f6] px-2 py-1 rounded">
                  {trackingNumber}
                </code>
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-[#8d9890]">Price</span>
                <span className="font-medium text-[#111111]">{price}</span>
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-[#8d9890]">ETA</span>
                <span
                  className={clsx(
                    "font-medium",
                    status === "delayed" && "text-red-600",
                    "text-[#111111]",
                  )}
                >
                  {eta}
                </span>
              </span>
            </div>

            <div className="mt-4">
              <Progress
                value={progress}
                showLabel
                label="Delivery progress"
                variant="success"
                size="md"
              />
              <div className="mt-2 flex items-center justify-between text-sm text-[#8d9890]">
                <span>{lastUpdate}</span>
                {status === "delayed" && (
                  <span className="flex items-center gap-1 text-red-600 font-medium">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Attention needed
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:flex-col sm:items-end">
            <Link
              href={`/orders/${id}`}
              className="p-2 rounded-xl text-[#8d9890] hover:bg-[#f7f8f6] hover:text-green-700 transition-colors"
              aria-label="Open order details"
            >
              <ExternalLink className="h-5 w-5" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Copy tracking number"
              onClick={copyTracking}
            >
              <Copy className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Refresh tracking"
              onClick={() => notify("Tracking refresh queued")}
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
