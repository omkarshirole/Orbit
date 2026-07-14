"use client";

import { useState, useRef, useEffect, type RefObject } from "react";
import { clsx } from "clsx";
import {
  Search,
  Mail,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Notification {
  id: number;
  title: string;
  time: string;
  type: "out_for_delivery" | "in_transit" | "delayed";
  read: boolean;
}

const notifications: Notification[] = [
  { id: 1, title: "AirPods Pro arriving today", time: "2 hrs ago", type: "out_for_delivery", read: false },
  { id: 2, title: "Nike Pegasus departed Gurugram hub", time: "4 hrs ago", type: "in_transit", read: false },
  { id: 3, title: "Flipkart shipment is delayed", time: "1 day ago", type: "delayed", read: true },
];

const unreadCount = notifications.filter((n) => !n.read).length;

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    // TODO: call API to mark all as read
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#edf0ec] bg-white/95 backdrop-blur px-4 md:px-6">
      <div className="flex h-full items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-xl text-[#8d9890] hover:bg-[#f7f8f6]"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Mail className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="relative w-full max-w-xs sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d9890]" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search orders, stores, tracking..."
              className="w-full rounded-xl border border-[#edf0ec] bg-[#f7f8f6] pl-10 pr-10 py-2 text-sm text-[#111111] placeholder-[#8d9890] focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
              aria-label="Search orders"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:block text-[10px] font-mono text-[#8d9890] bg-[#edf0ec] px-1.5 py-0.5 rounded">⌘F</kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-xl text-[#8d9890] hover:bg-[#f7f8f6] hover:text-green-700" aria-label="Gmail">
            <Mail className="h-5 w-5" />
          </button>

          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-[#8d9890] hover:bg-[#f7f8f6] hover:text-green-700"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#edf0ec] bg-white shadow-lg overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#edf0ec] px-4 py-3">
                  <h2 className="font-semibold text-[#111111]">Notifications</h2>
                  <button onClick={markAllRead} className="text-xs font-medium text-green-700 hover:text-green-800">
                    Mark all read
                  </button>
                </div>
                <div className="divide-y divide-[#edf0ec] max-h-96 overflow-y-auto">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f7f8f6] text-left transition-colors"
                    >
                      <div className={clsx("flex h-10 w-10 items-center justify-center rounded-xl shrink-0", n.type === "out_for_delivery" && "bg-green-50", n.type === "in_transit" && "bg-blue-50", n.type === "delayed" && "bg-red-50")}>
                        {n.type === "out_for_delivery" && <Mail className="h-5 w-5 text-green-700" />}
                        {n.type === "in_transit" && <Mail className="h-5 w-5 text-blue-600" />}
                        {n.type === "delayed" && <Bell className="h-5 w-5 text-red-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={clsx("text-sm font-medium text-[#111111] truncate", !n.read && "font-semibold")}>
                          {n.title}
                        </p>
                        <p className="text-xs text-[#8d9890]">{n.time}</p>
                      </div>
                      {!n.read && (
                        <div className="h-2 w-2 rounded-full bg-green-600" aria-label="Unread" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="px-4 py-3">
                  <button className="w-full text-sm font-medium text-green-700 hover:text-green-800">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-xl border border-[#edf0ec] px-3 py-1.5 hover:bg-[#f7f8f6] transition-colors"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <Avatar size="sm" fallback="U" alt="User" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-[#111111]">User Name</p>
                <p className="text-xs text-[#8d9890]">user@example.com</p>
              </div>
              <ChevronDown className="h-4 w-4 text-[#8d9890]" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-[#edf0ec] bg-white shadow-lg overflow-hidden">
                <div className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar size="md" fallback="U" alt="User" />
                    <div>
                      <p className="text-sm font-medium text-[#111111]">User Name</p>
                      <p className="text-xs text-[#8d9890]">user@example.com</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-[#edf0ec]">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#8d9890] hover:bg-[#f7f8f6] hover:text-[#111111]">
                    <Mail className="h-4 w-4" />
                    Gmail Access
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#8d9890] hover:bg-[#f7f8f6] hover:text-[#111111]">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}