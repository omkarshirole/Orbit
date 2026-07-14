"use client";

import { type FormEvent, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Package,
  Plus,
  RotateCcw as SyncIcon,
  Sparkles,
  Truck,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { StatCard } from "./StatCard";
import { ShipmentAnalytics } from "./ShipmentAnalytics";
import { DeliveryReminders } from "./DeliveryReminders";
import { RecentOrders } from "./RecentOrders";
import { SyncActivity } from "./SyncActivity";
import { DeliveryProgress } from "./DeliveryProgress";
import { GmailSync } from "./GmailSync";
import { Button } from "./ui/button";

export function DashboardAppClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddOrder, setShowAddOrder] = useState(false);

  const stats = [
    {
      label: "Active Orders",
      value: 8,
      helper: "Updated from Gmail and manual entries",
      trend: "up" as const,
      trendValue: "+2",
      icon: Package,
    },
    {
      label: "In Transit",
      value: 12,
      helper: "Moving with couriers",
      trend: "up" as const,
      trendValue: "+3",
      icon: Truck,
    },
    {
      label: "Delivered",
      value: 24,
      helper: "Delivered this month",
      trend: "up" as const,
      trendValue: "+5",
      icon: CheckCircle2,
    },
    {
      label: "Delayed",
      value: 2,
      helper: "Needs attention",
      trend: "down" as const,
      trendValue: "-1",
      icon: Bell,
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ffffff_0,#f3f4f1_42%,#ebeeea_100%)] p-3 text-[#121713] sm:p-5 lg:p-7">
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[1440px] overflow-hidden rounded-[32px] border border-white/80 bg-white/70 p-3 shadow-[0_24px_80px_rgba(22,34,27,0.12)] backdrop-blur md:p-4">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col rounded-[26px] bg-[#f7f8f6]">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="min-w-0 p-4 md:p-5 xl:p-6">
            <section className="mb-5 flex flex-col gap-4 rounded-[24px] bg-white/60 p-4 md:flex-row md:items-end md:justify-between md:p-5">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#dfe8df] bg-white px-3 py-1 text-xs font-semibold text-[#0f6b42] shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Live order command center
                </div>
                <h1 className="text-4xl font-semibold tracking-[-0.02em] text-[#101411] md:text-5xl">
                  Order Hub
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#78837b] md:text-base">
                  Track every order, shipment, return, and refund in one calm
                  orbit.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="md"
                  className="h-11 rounded-full border-[#0f6b42]/40 bg-white px-5 text-[#0b4f30] shadow-sm hover:bg-[#f2f8f4]"
                  onClick={() => {}}
                >
                  <SyncIcon className="mr-2 h-4 w-4" />
                  Sync Gmail
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="h-11 rounded-full bg-gradient-to-br from-[#168252] to-[#064123] px-5 shadow-[0_14px_28px_rgba(15,107,66,0.22)] hover:from-[#0f6b42] hover:to-[#05351d]"
                  onClick={() => setShowAddOrder(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Order
                </Button>
              </div>
            </section>

            <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  helper={stat.helper}
                  highlighted={index === 0}
                  trend={stat.trend}
                  trendValue={stat.trendValue}
                  icon={stat.icon}
                />
              ))}
            </div>

            <div className="grid gap-5 xl:grid-cols-12">
              <div className="space-y-5 xl:col-span-8">
                <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                  <ShipmentAnalytics />
                  <DeliveryReminders />
                </div>
                <RecentOrders />
                <SyncActivity />
              </div>

              <div className="space-y-5 xl:col-span-4">
                <DeliveryProgress />
                <GmailSync />
              </div>
            </div>
          </main>
        </div>
      </div>
      {showAddOrder && <AddOrderModal onClose={() => setShowAddOrder(false)} />}
    </div>
  );
}

function AddOrderModal({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus(null);

    const form = new FormData(event.currentTarget);
    const deliveryDate = String(form.get("estimatedDeliveryAt") || "");
    const payload = {
      store: String(form.get("store") || ""),
      productName: String(form.get("productName") || ""),
      externalOrderId: String(form.get("externalOrderId") || ""),
      trackingNumber: String(form.get("trackingNumber") || ""),
      courier: String(form.get("courier") || ""),
      price: form.get("price") ? Number(form.get("price")) : undefined,
      currency: String(form.get("currency") || "INR").toUpperCase(),
      estimatedDeliveryAt: deliveryDate
        ? new Date(deliveryDate).toISOString()
        : "",
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          result.error ||
            "Sign in and configure Supabase before saving orders.",
        );
      }
      setStatus("Order saved.");
      setTimeout(onClose, 700);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Order could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#06170d]/45 p-3 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-[28px] bg-white p-5 shadow-[0_28px_90px_rgba(6,23,13,0.28)] md:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[#111111]">
              Add order
            </h2>
            <p className="mt-1 text-sm text-[#8d9890]">
              Add a tracking number manually when Gmail has not found it yet.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#edf0ec] px-4 py-2 text-sm font-semibold text-[#78837b] hover:bg-[#f7f8f6]"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["Store", "store", "text", true],
            ["Product name", "productName", "text", true],
            ["Order number", "externalOrderId", "text", false],
            ["Tracking number", "trackingNumber", "text", true],
            ["Courier", "courier", "text", false],
            ["Order value", "price", "number", false],
            ["Currency", "currency", "text", false],
            ["Expected delivery", "estimatedDeliveryAt", "date", false],
          ].map(([label, name, type, required]) => (
            <label
              key={String(name)}
              className="text-sm font-semibold text-[#111111]"
            >
              {label}
              <input
                name={String(name)}
                type={String(type)}
                required={Boolean(required)}
                defaultValue={name === "currency" ? "INR" : undefined}
                className="mt-2 h-11 w-full rounded-2xl border border-[#edf0ec] bg-[#f7f8f6] px-3 text-sm outline-none focus:border-[#168252]/50 focus:ring-2 focus:ring-green-500/15"
              />
            </label>
          ))}
        </div>

        {status && (
          <p className="mt-4 rounded-2xl bg-[#f7f8f6] p-3 text-sm text-[#78837b]">
            {status}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#dfe8df] px-5 py-2 text-sm font-semibold text-[#0b4f30] hover:bg-[#f7f8f6]"
          >
            Cancel
          </button>
          <button
            disabled={isSaving}
            className="rounded-full bg-gradient-to-br from-[#168252] to-[#064123] px-5 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(15,107,66,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save order"}
          </button>
        </div>
      </form>
    </div>
  );
}
