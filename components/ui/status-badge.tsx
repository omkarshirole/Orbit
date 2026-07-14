"use client";

import { UIStatusBadge } from "./badge";
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

const statusVariant: Record<OrderStatus, StatusBadgeProps["status"]> = {
  ordered: "ordered",
  confirmed: "confirmed",
  processing: "processing",
  shipped: "shipped",
  in_transit: "in_transit",
  arriving_soon: "arriving_soon",
  out_for_delivery: "out_for_delivery",
  delivered: "delivered",
  delayed: "delayed",
  delivery_attempted: "delivery_attempted",
  failed: "failed",
  cancelled: "cancelled",
  return_requested: "return_requested",
  return_in_transit: "return_in_transit",
  returned: "returned",
  refund_processing: "refund_processing",
  refunded: "refunded",
  unknown: "neutral",
};

type StatusBadgeProps = {
  status?: "default" | "primary" | "success" | "warning" | "danger" | "info" | "neutral" 
    | "ordered" | "confirmed" | "processing" | "shipped" | "in_transit" | "out_for_delivery" 
    | "arriving_soon" | "delivered" | "delayed" | "delivery_attempted" | "failed" 
    | "cancelled" | "return_requested" | "return_in_transit" | "returned" 
    | "refund_processing" | "refunded";
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <UIStatusBadge status={statusVariant[status] || "neutral"}>{statusLabel[status]}</UIStatusBadge>;
}