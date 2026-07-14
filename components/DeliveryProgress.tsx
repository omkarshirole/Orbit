"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CircularProgress } from "./ui/progress";

export function DeliveryProgress() {
  const delivered = 41;
  const inTransit = 34;
  const pending = 25;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Delivery Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <CircularProgress
            value={delivered}
            max={100}
            size={160}
            strokeWidth={12}
            variant="success"
            showValue
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-[#111111]">{delivered}%</p>
              <p className="text-xs text-[#8d9890]">Orders delivered</p>
            </div>
          </CircularProgress>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-600" />
              <span className="text-[#111111]">Delivered ({delivered}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="text-[#111111]">In Transit ({inTransit}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#edf0ec]" />
              <span className="text-[#111111]">Pending ({pending}%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
