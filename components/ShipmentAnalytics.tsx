"use client";

import { clsx } from "clsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const chartData = [
  { day: "S", value: 12 },
  { day: "M", value: 19 },
  { day: "T", value: 8 },
  { day: "W", value: 24 },
  { day: "T", value: 16 },
  { day: "F", value: 22 },
  { day: "S", value: 14 },
];

const maxValue = Math.max(...chartData.map((d) => d.value));

export function ShipmentAnalytics() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Shipment Analytics</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-end justify-between h-[200px] gap-2">
          {chartData.map((item, index) => {
            const height = (item.value / maxValue) * 100;
            const isPeak = item.value === maxValue;
            return (
              <div key={`${item.day}-${index}`} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={clsx(
                    "w-full rounded-t transition-all duration-500",
                    isPeak ? "bg-green-800" : "bg-green-400"
                  )}
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs font-medium text-[#8d9890]">{item.day}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm text-green-700 font-medium bg-green-50 px-3 py-1 rounded-full">
            +12% vs last week
          </span>
        </div>
      </CardContent>
    </Card>
  );
}