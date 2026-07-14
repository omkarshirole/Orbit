"use client";

import { clsx } from "clsx";
import { forwardRef, type HTMLAttributes } from "react";

type StatusVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "ordered"
  | "confirmed"
  | "processing"
  | "shipped"
  | "in_transit"
  | "out_for_delivery"
  | "arriving_soon"
  | "delivered"
  | "delayed"
  | "delivery_attempted"
  | "failed"
  | "cancelled"
  | "return_requested"
  | "return_in_transit"
  | "returned"
  | "refund_processing"
  | "refunded";

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status?: StatusVariant;
  children?: React.ReactNode;
  dot?: boolean;
}

const statusVariants = {
  default: "bg-[#edf0ec] text-[#556152]",
  primary: "bg-green-50 text-green-700",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
  neutral: "bg-gray-50 text-gray-700",
  ordered: "bg-gray-50 text-gray-700",
  confirmed: "bg-gray-50 text-gray-700",
  processing: "bg-gray-50 text-gray-700",
  shipped: "bg-blue-50 text-blue-700",
  in_transit: "bg-blue-50 text-blue-700",
  out_for_delivery: "bg-amber-50 text-amber-700",
  arriving_soon: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  delayed: "bg-red-50 text-red-700",
  delivery_attempted: "bg-red-50 text-red-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-gray-50 text-gray-700",
  return_requested: "bg-purple-50 text-purple-700",
  return_in_transit: "bg-purple-50 text-purple-700",
  returned: "bg-purple-50 text-purple-700",
  refund_processing: "bg-purple-50 text-purple-700",
  refunded: "bg-green-50 text-green-700",
};

export const UIStatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status = "default", children, dot = false, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
          statusVariants[status] || statusVariants.default,
          status !== "default" && "ring-transparent",
          className,
        )}
        {...props}
      >
        {dot && (
          <span
            className={clsx(
              "h-1.5 w-1.5 rounded-full",
              status === "delivered" ||
                status === "success" ||
                status === "refunded"
                ? "bg-green-500"
                : status === "out_for_delivery" || status === "warning"
                  ? "bg-amber-500"
                  : status === "delayed" ||
                      status === "danger" ||
                      status === "failed" ||
                      status === "delivery_attempted"
                    ? "bg-red-500"
                    : status === "shipped" ||
                        status === "in_transit" ||
                        status === "info" ||
                        status === "arriving_soon"
                      ? "bg-blue-500"
                      : status === "cancelled" ||
                          status === "default" ||
                          status === "neutral" ||
                          status === "ordered" ||
                          status === "confirmed" ||
                          status === "processing"
                        ? "bg-gray-500"
                        : status === "return_requested" ||
                            status === "return_in_transit" ||
                            status === "returned" ||
                            status === "refund_processing"
                          ? "bg-purple-500"
                          : "bg-gray-500",
            )}
          />
        )}
        {children}
      </span>
    );
  },
);

UIStatusBadge.displayName = "UIStatusBadge";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "outline";
  size?: "sm" | "md" | "lg";
}

const badgeVariants = {
  default: "bg-[#edf0ec] text-[#556152]",
  primary: "bg-green-50 text-green-700",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
  outline: "bg-transparent border border-[#edf0ec] text-[#556152]",
};

const badgeSizes = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = "default", size = "md", children, ...props },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        className={clsx(
          "inline-flex items-center gap-1 rounded-full font-semibold ring-1",
          badgeVariants[variant],
          variant !== "outline" && "ring-transparent",
          variant === "outline" && "ring-[#edf0ec]",
          badgeSizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
