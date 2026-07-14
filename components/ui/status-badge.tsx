import { clsx } from "clsx";
import type { OrderStatus } from "@/lib/constants";

const statusLabel: Record<OrderStatus, string> = {
  ordered: "Ordered",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  in_transit: "In transit",
  arriving_soon: "Arriving soon",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  delayed: "Delayed",
  delivery_attempted: "Attempted",
  failed: "Failed",
  cancelled: "Cancelled",
  return_requested: "Return requested",
  return_in_transit: "Return in transit",
  returned: "Returned",
  refund_processing: "Refund processing",
  refunded: "Refunded",
  unknown: "Unknown",
};

const tone: Partial<Record<OrderStatus, string>> = {
  delivered: "bg-green-50 text-orbit-green ring-green-200",
  out_for_delivery: "bg-amber-50 text-orbit-orange ring-amber-200",
  delayed: "bg-red-50 text-orbit-red ring-red-200",
  failed: "bg-red-50 text-orbit-red ring-red-200",
  shipped: "bg-indigo-50 text-orbit-primary ring-indigo-200",
  in_transit: "bg-blue-50 text-orbit-blue ring-blue-200",
  arriving_soon: "bg-indigo-50 text-orbit-primary ring-indigo-200",
  cancelled: "bg-gray-50 text-orbit-muted ring-gray-200",
  return_requested: "bg-purple-50 text-purple-700 ring-purple-200",
  return_in_transit: "bg-purple-50 text-purple-700 ring-purple-200",
  returned: "bg-purple-50 text-purple-700 ring-purple-200",
  refund_processing: "bg-purple-50 text-purple-700 ring-purple-200",
  refunded: "bg-green-50 text-orbit-green ring-green-200",
  ordered: "bg-gray-50 text-orbit-muted ring-gray-200",
  confirmed: "bg-gray-50 text-orbit-muted ring-gray-200",
  processing: "bg-gray-50 text-orbit-muted ring-gray-200",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        tone[status] || "bg-white text-orbit-muted ring-orbit-line",
      )}
    >
      {statusLabel[status]}
    </span>
  );
}
