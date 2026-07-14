"use client";

import { clsx } from "clsx";
import { ArrowDownRight, ArrowUpRight, LucideIcon, Minus } from "lucide-react";
import { Card } from "./ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  helper?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  highlighted?: boolean;
  className?: string;
  icon: LucideIcon;
}

export function StatCard({
  label,
  value,
  helper,
  trend,
  trendValue,
  highlighted = false,
  className,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card
      variant={highlighted ? "elevated" : "default"}
      className={clsx(
        "group relative min-h-[150px] overflow-hidden transition-all duration-200 hover:-translate-y-0.5",
        highlighted &&
          "border-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.28),transparent_26%),linear-gradient(135deg,#168252,#064123)] text-white shadow-[0_18px_44px_rgba(15,107,66,0.24)]",
        className,
      )}
      padding="md"
    >
      {highlighted && (
        <>
          <div className="absolute -bottom-12 -right-8 h-32 w-32 rounded-full border border-white/10" />
          <div className="absolute -left-10 top-10 h-24 w-24 rounded-full border border-white/10" />
        </>
      )}
      <div className="flex items-start justify-between">
        <div
          className={clsx(
            "flex-1 min-w-0",
            highlighted && "text-white",
            "text-[#111111]",
          )}
        >
          <p
            className={clsx(
              "text-sm font-semibold",
              highlighted ? "text-green-100" : "text-[#8d9890]",
            )}
          >
            {label}
          </p>
          <p
            className={clsx(
              "mt-4 text-5xl font-semibold tracking-[-0.04em]",
              highlighted ? "text-white" : "text-[#070b08]",
            )}
          >
            {value}
          </p>
          {helper && (
            <p
              className="mt-3 line-clamp-2 text-xs leading-5"
              style={{
                color: highlighted ? "rgba(255,255,255,0.7)" : "#8d9890",
              }}
            >
              {helper}
            </p>
          )}
        </div>
        <div
          className={clsx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            highlighted
              ? "bg-white text-[#064123]"
              : "border border-[#e6ece6] bg-white text-[#111111]",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {(trend || trendValue) && (
        <div
          className={clsx(
            "mt-5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
            highlighted
              ? "bg-white/12 text-green-50"
              : "bg-[#f7f8f6] text-[#0f6b42]",
          )}
        >
          {trend === "up" && <ArrowUpRight className="h-4 w-4" />}
          {trend === "down" && <ArrowDownRight className="h-4 w-4" />}
          {trend === "neutral" && <Minus className="h-4 w-4" />}
          {trendValue && (
            <span className="text-xs font-medium">{trendValue}</span>
          )}
        </div>
      )}
    </Card>
  );
}
