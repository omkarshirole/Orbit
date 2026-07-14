"use client";

import { clsx } from "clsx";
import { ArrowUpRight, ArrowDownRight, Minus, LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

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
        "relative overflow-hidden transition-all duration-200 hover:shadow-lg",
        highlighted &&
          "bg-gradient-to-br from-green-800 to-green-900 text-white",
        className,
      )}
      padding="md"
    >
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
              "text-xs font-medium uppercase tracking-wider",
              highlighted ? "text-green-100" : "text-[#8d9890]",
            )}
          >
            {label}
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
          {helper && (
            <p
              className="mt-2 text-sm"
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
            "flex h-10 w-10 items-center justify-center rounded-xl shrink-0",
            highlighted ? "bg-white/10" : "bg-[#f7f8f6]",
          )}
        >
          <Icon
            className={clsx(
              "h-5 w-5",
              highlighted ? "text-green-100" : "text-green-700",
            )}
          />
        </div>
      </div>
      {(trend || trendValue) && (
        <div
          className={clsx(
            "mt-4 flex items-center gap-1.5",
            highlighted ? "text-green-100" : "text-[#8d9890]",
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
