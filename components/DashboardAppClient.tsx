"use client";

import { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle2,
  Bell,
  Plus,
  RotateCcw as SyncIcon,
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
  // TODO: wire up to the Add Order form + POST /api/orders once that modal is built.
  const [, setShowAddOrder] = useState(false);

  const stats = [
    {
      label: "Active Orders",
      value: 8,
      helper: "Updated from Gmail and manual entries",
      highlighted: true,
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
    <div className="min-h-screen bg-[#f1f2f1]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8">
          {/* Dashboard header */}
          <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#111111] md:text-4xl">
                Order Hub
              </h1>
              <p className="mt-2 max-w-xl text-[#8d9890]">
                Track every order, shipment, return, and refund in one orbit.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="md"
                className="rounded-full border-[#edf0ec] bg-white"
                onClick={() => {}}
              >
                <SyncIcon className="h-4 w-4 mr-2 text-green-700" />
                Sync Gmail
              </Button>
              <Button
                variant="primary"
                size="md"
                className="rounded-full bg-green-700 shadow-sm hover:bg-green-800"
                onClick={() => setShowAddOrder(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Order
              </Button>
            </div>
          </section>

          {/* Stats Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
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

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column - 8 cols */}
            <div className="lg:col-span-8 space-y-6">
              {/* Top row: Shipment Analytics + Delivery Reminders */}
              <div className="grid gap-4 sm:grid-cols-2">
                <ShipmentAnalytics />
                <DeliveryReminders />
              </div>

              {/* Recent Orders */}
              <RecentOrders />

              {/* Bottom row: Sync Activity + Delivery Progress */}
              <div className="grid gap-4 sm:grid-cols-2">
                <SyncActivity />
                <DeliveryProgress />
              </div>
            </div>

            {/* Right Column - 4 cols */}
            <div className="lg:col-span-4 space-y-6">
              <GmailSync />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
