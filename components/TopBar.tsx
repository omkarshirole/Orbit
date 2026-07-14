"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import {
  Bell,
  ChevronDown,
  LogOut,
  Mail,
  Menu,
  Search,
  Settings,
} from "lucide-react";
import { Avatar } from "./ui/avatar";

interface Notification {
  id: number;
  title: string;
  time: string;
  type: "out_for_delivery" | "in_transit" | "delayed";
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: "AirPods Pro arriving today",
    time: "2 hrs ago",
    type: "out_for_delivery",
    read: false,
  },
  {
    id: 2,
    title: "Nike Pegasus departed Gurugram hub",
    time: "4 hrs ago",
    type: "in_transit",
    read: false,
  },
  {
    id: 3,
    title: "Flipkart shipment is delayed",
    time: "1 day ago",
    type: "delayed",
    read: true,
  },
];

const unreadCount = notifications.filter((n) => !n.read).length;

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="z-30 px-3 pt-3 md:px-4 md:pt-4">
      <div className="flex min-h-16 items-center justify-between gap-3 rounded-[22px] bg-white/80 px-3 py-3 shadow-[0_12px_34px_rgba(19,33,24,0.06)] backdrop-blur md:px-4">
        <button
          className="rounded-full p-2 text-[#8d9890] hover:bg-[#f7f8f6] lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d9890]"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search orders, stores, tracking"
              className="h-11 w-full rounded-full border border-transparent bg-[#f7f8f6] pl-10 pr-14 text-sm text-[#111111] shadow-inner placeholder-[#8d9890] focus:border-[#168252]/40 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              aria-label="Search orders"
            />
            <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white px-2 py-1 font-mono text-[10px] text-[#8d9890] shadow-sm sm:block">
              Ctrl F
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="relative grid h-11 w-11 place-items-center rounded-full bg-white text-[#7d8880] shadow-sm transition hover:text-[#0f6b42]"
            aria-label="Gmail"
          >
            <Mail className="h-5 w-5" />
          </button>

          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative grid h-11 w-11 place-items-center rounded-full bg-white text-[#7d8880] shadow-sm transition hover:text-[#0f6b42]"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#168252] text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-[22px] border border-[#edf0ec] bg-white shadow-[0_24px_60px_rgba(19,33,24,0.14)]">
                <div className="flex items-center justify-between border-b border-[#edf0ec] px-4 py-3">
                  <h2 className="font-semibold text-[#111111]">
                    Notifications
                  </h2>
                  <button className="text-xs font-semibold text-[#0f6b42] hover:text-[#064123]">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-96 divide-y divide-[#edf0ec] overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f7f8f6]"
                    >
                      <div
                        className={clsx(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                          notification.type === "out_for_delivery" &&
                            "bg-green-50",
                          notification.type === "in_transit" && "bg-blue-50",
                          notification.type === "delayed" && "bg-red-50",
                        )}
                      >
                        {notification.type === "delayed" ? (
                          <Bell className="h-5 w-5 text-red-600" />
                        ) : (
                          <Mail
                            className={clsx(
                              "h-5 w-5",
                              notification.type === "in_transit"
                                ? "text-blue-600"
                                : "text-[#0f6b42]",
                            )}
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={clsx(
                            "truncate text-sm text-[#111111]",
                            !notification.read && "font-semibold",
                          )}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-[#8d9890]">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div
                          className="h-2 w-2 rounded-full bg-[#168252]"
                          aria-label="Unread"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition-colors hover:bg-[#fbfcfa]"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <Avatar size="sm" fallback="U" alt="User" />
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-[#111111]">
                  User Name
                </p>
                <p className="text-xs text-[#8d9890]">user@example.com</p>
              </div>
              <ChevronDown className="h-4 w-4 text-[#8d9890]" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-[22px] border border-[#edf0ec] bg-white shadow-[0_24px_60px_rgba(19,33,24,0.14)]">
                <div className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar size="md" fallback="U" alt="User" />
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">
                        User Name
                      </p>
                      <p className="text-xs text-[#8d9890]">user@example.com</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-[#edf0ec]">
                  <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-[#8d9890] hover:bg-[#f7f8f6] hover:text-[#111111]">
                    <Mail className="h-4 w-4" />
                    Gmail Access
                  </button>
                  <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-[#8d9890] hover:bg-[#f7f8f6] hover:text-[#111111]">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
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
