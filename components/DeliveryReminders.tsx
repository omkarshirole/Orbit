"use client";

import { clsx } from "clsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Truck, Clock, AlertTriangle } from "lucide-react";

const reminders = [
  {
    title: "AirPods Pro arriving today",
    detail: "Blue Dart · Out for delivery",
    time: "2 hrs ago",
    type: "out_for_delivery" as const,
  },
  {
    title: "Nike Pegasus 41",
    detail: "Delhivery · In transit",
    time: "4 hrs ago",
    type: "in_transit" as const,
  },
  {
    title: "Samsung T7 Shield SSD",
    detail: "Ekart · Delayed",
    time: "1 day ago",
    type: "delayed" as const,
  },
];

export function DeliveryReminders() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Delivery Reminders</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {reminders.map((reminder) => (
          <div
            key={reminder.title}
            className={clsx(
              "flex items-center gap-3 p-3 rounded-xl border transition-colors",
              reminder.type === "out_for_delivery" &&
                "bg-green-50 border-green-200",
              reminder.type === "in_transit" && "bg-blue-50 border-blue-200",
              reminder.type === "delayed" && "bg-red-50 border-red-200",
            )}
          >
            <div
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
                reminder.type === "out_for_delivery" &&
                  "bg-green-100 text-green-600",
                reminder.type === "in_transit" && "bg-blue-100 text-blue-600",
                reminder.type === "delayed" && "bg-red-100 text-red-600",
              )}
            >
              {reminder.type === "out_for_delivery" && (
                <Truck className="h-5 w-5" />
              )}
              {reminder.type === "in_transit" && <Clock className="h-5 w-5" />}
              {reminder.type === "delayed" && (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#111111]">{reminder.title}</p>
              <p className="text-sm text-[#8d9890]">{reminder.detail}</p>
            </div>
            {reminder.type === "out_for_delivery" && (
              <Button variant="primary" size="sm" className="shrink-0">
                View Shipment
              </Button>
            )}
          </div>
        ))}
        <div className="pt-2 text-center">
          <Button
            variant="ghost"
            className="text-green-700 hover:bg-green-50 w-full"
          >
            View all reminders
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
