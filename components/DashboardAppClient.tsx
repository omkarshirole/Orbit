"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Inbox,
  Clock,
  Truck,
  CheckCircle2,
  Bell,
  RotateCcw,
  Mail,
  Link2,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell as BellIcon,
  ChevronRight,
  Shield,
  Plus,
  RotateCcw as SyncIcon,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
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
import { OrderCard } from "./OrderCard";
import { Button } from "./ui/button";
import type { OrderStatus } from "@/lib/constants";

const MENU_ITEMS = [
  { label: "Overview", icon: Package, href: "/dashboard" },
  { label: "All Orders", icon: Inbox, href: "/dashboard" },
  { label: "Active", icon: Clock, href: "/dashboard" },
  { label: "In Transit", icon: Truck, href: "/dashboard" },
  { label: "Delivered", icon: CheckCircle2, href: "/dashboard" },
  { label: "Delayed", icon: Bell, href: "/dashboard" },
  { label: "Returns & Refunds", icon: RotateCcw, href: "/dashboard" },
  { label: "Gmail Sync", icon: Mail, href: "/dashboard" },
];

const GENERAL_ITEMS = [
  { label: "Connections", icon: Link2, href: "/dashboard" },
  { label: "Settings", icon: Settings, href: "/dashboard" },
  { label: "Help", icon: HelpCircle, href: "/dashboard" },
  { label: "Logout", icon: LogOut, href: "/auth" },
];

const orders = [
  {
    id: "ord_apple",
    productName: "AirPods Pro USB-C",
    store: "Apple",
    orderNumber: "APL-928312",
    status: "out_for_delivery" as OrderStatus,
    courier: "Blue Dart",
    trackingNumber: "BD892034781IN",
    price: "INR 24,900",
    eta: "Today",
    progress: 82,
    lastUpdate: "Reached local facility — 2 hrs ago",
    source: "gmail" as const,
  },
  {
    id: "ord_nike",
    productName: "Nike Pegasus 41",
    store: "Nike",
    orderNumber: "NKE-55129",
    status: "in_transit" as OrderStatus,
    courier: "Delhivery",
    trackingNumber: "142536475869",
    price: "INR 11,895",
    eta: "Jul 17",
    progress: 56,
    lastUpdate: "Departed Gurugram hub — 4 hrs ago",
    source: "gmail" as const,
  },
  {
    id: "ord_flipkart",
    productName: "Samsung T7 Shield SSD",
    store: "Flipkart",
    orderNumber: "OD431922",
    status: "delayed" as OrderStatus,
    courier: "Ekart",
    trackingNumber: "FMPC2938123890",
    price: "INR 8,499",
    eta: "Delayed",
    progress: 42,
    lastUpdate: "Delay at sorting center — 1 day ago",
    source: "manual" as const,
  },
  {
    id: "ord_amazon",
    productName: "Kindle Paperwhite",
    store: "Amazon",
    orderNumber: "AMZ-402819",
    status: "delivered" as OrderStatus,
    courier: "Amazon Logistics",
    trackingNumber: "TBA9876543210",
    price: "INR 12,999",
    eta: "Delivered Jul 12",
    progress: 100,
    lastUpdate: "Delivered to doorstep — 2 days ago",
    source: "gmail" as const,
  },
  {
    id: "ord_myntra",
    productName: "Levi's 511 Jeans",
    store: "Myntra",
    orderNumber: "MYN-77321",
    status: "shipped" as OrderStatus,
    courier: "Delhivery",
    trackingNumber: "DHL1234567890",
    price: "INR 2,499",
    eta: "Jul 15",
    progress: 35,
    lastUpdate: "Picked up from warehouse — 6 hrs ago",
    source: "manual" as const,
  },
];

export function DashboardAppClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showAddOrder, setShowAddOrder] = useState(false);

  const stats = [
    { label: "Active Orders", value: 8, helper: "Updated from Gmail and manual entries", highlighted: true, trend: "up" as const, trendValue: "+2", icon: Package },
    { label: "In Transit", value: 12, helper: "Moving with couriers", trend: "up" as const, trendValue: "+3", icon: Truck },
    { label: "Delivered", value: 24, helper: "Delivered this month", trend: "up" as const, trendValue: "+5", icon: CheckCircle2 },
    { label: "Delayed", value: 2, helper: "Needs attention", trend: "down" as const, trendValue: "-1", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#f1f2f1]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8">
          {/* Dashboard Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#111111]">Order Hub</h1>
              <p className="mt-1 text-[#8d9890]">Track every order, shipment, return, and refund in one orbit.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="md" onClick={() => {}}>
                <SyncIcon className="h-4 w-4 mr-2" />
                Sync Gmail
              </Button>
              <Button variant="primary" size="md" onClick={() => setShowAddOrder(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Order
              </Button>
            </div>
          </div>

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