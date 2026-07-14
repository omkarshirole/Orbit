"use client";

import { clsx } from "clsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const chartData = [
  { day: "S", value: 15, muted: true },
  { day: "M", value: 20 },
  { day: "T", value: 18 },
  { day: "W", value: 23, dark: true },
  { day: "T", value: 22, muted: true },
  { day: "F", value: 16, muted: true },
  { day: "S", value: 19, muted: true },
];

const maxValue = Math.max(...chartData.map((d) => d.value));

export function ShipmentAnalytics() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Shipment Analytics</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex h-[190px] items-end justify-between gap-1.5 sm:gap-3">
          {chartData.map((item, index) => {
            const height = (item.value / maxValue) * 100;
            const isPeak = item.value === maxValue;
            return (
              <div
                key={`${item.day}-${index}`}
                className="relative flex flex-1 flex-col items-center gap-2"
              >
                {isPeak && (
                  <span className="absolute -top-2 rounded-full border border-[#dce9dd] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#168252] shadow-sm">
                    74%
                  </span>
                )}
                <div
                  className={clsx(
                    "w-full max-w-12 rounded-full transition-all duration-500",
                    item.muted &&
                      "bg-[repeating-linear-gradient(135deg,#a9b7ad_0,#a9b7ad_3px,transparent_3px,transparent_7px)] opacity-80",
                    item.dark && "bg-[#064123]",
                    !item.muted && !item.dark && "bg-[#2a8d58]",
                  )}
                  style={{ height: `${height}%`, minHeight: "8px" }}
                />
                <span className="text-xs font-medium text-[#9aa49d]">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3">
          <span className="rounded-full bg-[#eef8f1] px-3 py-1 text-xs font-semibold text-[#0f6b42]">
            +12% vs last week
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
