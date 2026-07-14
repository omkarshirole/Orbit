"use client";

import { AlertTriangle, Clock, Truck } from "lucide-react";
import { clsx } from "clsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const reminders = [
  {
    title: "Nike Pegasus 41",
    detail: "Delhivery · In transit",
    type: "in_transit" as const,
  },
  {
    title: "Samsung T7 Shield SSD",
    detail: "Ekart · Delayed",
    type: "delayed" as const,
  },
];

export function DeliveryReminders() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Delivery Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="rounded-[22px] bg-[#f7f8f6] p-4">
          <p className="text-xl font-semibold leading-tight text-[#0c3f28] md:text-2xl">
            AirPods Pro arriving today
          </p>
          <p className="mt-2 text-sm text-[#8d9890]">
            Blue Dart · Out for delivery
          </p>
          <Button
            variant="primary"
            size="md"
            className="mt-5 w-full bg-gradient-to-br from-[#168252] to-[#064123]"
          >
            <Truck className="mr-2 h-4 w-4" />
            View Shipment
          </Button>
        </div>
        {reminders.map((reminder) => (
          <div
            key={reminder.title}
            className={clsx(
              "flex items-center gap-3 rounded-2xl border p-3 transition-colors",
              reminder.type === "in_transit" && "border-blue-100 bg-blue-50",
              reminder.type === "delayed" && "border-red-100 bg-red-50",
            )}
          >
            <div
              className={clsx(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                reminder.type === "in_transit" && "bg-blue-100 text-blue-600",
                reminder.type === "delayed" && "bg-red-100 text-red-600",
              )}
            >
              {reminder.type === "in_transit" ? (
                <Clock className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-[#111111]">
                {reminder.title}
              </p>
              <p className="text-sm text-[#8d9890]">{reminder.detail}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
