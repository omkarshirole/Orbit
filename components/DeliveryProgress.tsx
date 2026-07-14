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
      <CardContent className="pt-0">
        <div className="flex flex-col items-center">
          <div className="relative grid h-48 w-full place-items-center overflow-hidden rounded-[22px] bg-[#f7f8f6]">
            <CircularProgress
              value={delivered}
              max={100}
              size={168}
              strokeWidth={15}
              variant="success"
              showValue
            >
              <div className="text-center">
                <p className="text-4xl font-semibold tracking-[-0.04em] text-[#111111]">
                  {delivered}%
                </p>
                <p className="text-xs text-[#8d9890]">Orders delivered</p>
              </div>
            </CircularProgress>
            <div className="absolute right-9 top-11 h-24 w-12 rounded-full bg-[repeating-linear-gradient(135deg,#a9b7ad_0,#a9b7ad_3px,transparent_3px,transparent_7px)] opacity-70" />
          </div>

          <div className="mt-5 grid w-full grid-cols-1 gap-2 text-xs sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f7f8f6] p-3">
              <div className="mb-2 h-2 w-2 rounded-full bg-[#168252]" />
              <p className="font-semibold text-[#111111]">Delivered</p>
              <p className="text-[#8d9890]">{delivered}%</p>
            </div>
            <div className="rounded-2xl bg-[#f7f8f6] p-3">
              <div className="mb-2 h-2 w-2 rounded-full bg-[#064123]" />
              <p className="font-semibold text-[#111111]">Transit</p>
              <p className="text-[#8d9890]">{inTransit}%</p>
            </div>
            <div className="rounded-2xl bg-[#f7f8f6] p-3">
              <div className="mb-2 h-2 w-2 rounded-full bg-[#a9b7ad]" />
              <p className="font-semibold text-[#111111]">Pending</p>
              <p className="text-[#8d9890]">{pending}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
