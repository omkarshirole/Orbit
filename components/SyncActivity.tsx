"use client";

import { clsx } from "clsx";
import { Mail, CheckCircle2, Clock, AlertCircle, Truck, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StatusBadge } from "./ui/status-badge";
import { Button } from "./ui/button";

const syncItems = [
  { id: 1, label: "Gmail scan completed", status: "completed" as const, details: "24 emails scanned" },
  { id: 2, label: "Orders added", status: "completed" as const, details: "3 orders added" },
  { id: 3, label: "Orders updated", status: "completed" as const, details: "2 orders updated" },
  { id: 4, label: "AfterShip registration", status: "pending" as const, details: "Pending webhook" },
  { id: 5, label: "Sync in progress", status: "in_progress" as const, details: "Scanning..." },
];

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  in_progress: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
  pending: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
};

export function SyncActivity() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle>Sync Activity</CardTitle>
        <Button variant="outline" size="sm">
          Sync Now
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {syncItems.map((item) => {
            const config = statusConfig[item.status];
            const Icon = config.icon;
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#edf0ec] hover:bg-[#f7f8f6] transition-colors"
              >
                <div className={clsx("flex h-10 w-10 items-center justify-center rounded-lg shrink-0", config.bg)}>
                  <Icon className={clsx("h-5 w-5", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#111111] truncate">{item.label}</p>
                  <p className="text-sm text-[#8d9890]">{item.details}</p>
                </div>
                <StatusBadge status={item.status === "completed" ? "delivered" : item.status === "in_progress" ? "in_transit" : "arriving_soon"} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}