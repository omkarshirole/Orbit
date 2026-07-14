"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  RotateCcw,
} from "lucide-react";
import { clsx } from "clsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useToast } from "./toast-provider";

const syncItems = [
  {
    id: 1,
    label: "Gmail scan completed",
    status: "completed" as const,
    details: "24 emails scanned",
    icon: Mail,
  },
  {
    id: 2,
    label: "Orders added",
    status: "completed" as const,
    details: "3 orders added",
    icon: CheckCircle2,
  },
  {
    id: 3,
    label: "AfterShip registration",
    status: "pending" as const,
    details: "2 pending tracking numbers",
    icon: AlertCircle,
  },
  {
    id: 4,
    label: "Next scheduled sync",
    status: "in_progress" as const,
    details: "Runs in 28 minutes",
    icon: Clock,
  },
];

const statusConfig = {
  completed: { color: "text-[#168252]", bg: "bg-green-50", badge: "Completed" },
  in_progress: { color: "text-blue-600", bg: "bg-blue-50", badge: "Queued" },
  pending: { color: "text-amber-600", bg: "bg-amber-50", badge: "Pending" },
};

export function SyncActivity() {
  const { notify } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  async function syncActivity() {
    setIsSyncing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setIsSyncing(false);
    notify("Sync activity refreshed");
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle>Sync Activity</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="border-[#0f6b42]/30"
          onClick={syncActivity}
          isLoading={isSyncing}
        >
          <RotateCcw className="mr-1 h-3.5 w-3.5" />
          {isSyncing ? "Syncing" : "Sync"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {syncItems.map((item) => {
          const config = statusConfig[item.status];
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-[#edf0ec] bg-white p-3 transition-colors hover:bg-[#f7f8f6]"
            >
              <div
                className={clsx(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                  config.bg,
                )}
              >
                <Icon className={clsx("h-5 w-5", config.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#111111]">
                  {item.label}
                </p>
                <p className="text-sm text-[#8d9890]">{item.details}</p>
              </div>
              <span className="hidden rounded-full bg-[#f7f8f6] px-2.5 py-1 text-[11px] font-semibold text-[#78837b] sm:inline-flex">
                {config.badge}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
