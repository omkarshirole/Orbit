"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Inbox,
  Clock,
  Truck,
  CheckCircle2,
  Bell,
  Undo2,
  Mail,
  Link2,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const MENU_ITEMS: NavItem[] = [
  { label: "Overview", icon: Package, href: "/dashboard" },
  { label: "All Orders", icon: Inbox, href: "/orders" },
  { label: "Active", icon: Clock, href: "/orders/active" },
  { label: "In Transit", icon: Truck, href: "/orders/in-transit" },
  { label: "Delivered", icon: CheckCircle2, href: "/orders/delivered" },
  { label: "Delayed", icon: Bell, href: "/orders/delayed" },
  { label: "Returns & Refunds", icon: Undo2, href: "/returns" },
  { label: "Gmail Sync", icon: Mail, href: "/gmail-sync" },
];

const GENERAL_ITEMS: NavItem[] = [
  { label: "Connections", icon: Link2, href: "/connections" },
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Help", icon: HelpCircle, href: "/help" },
  { label: "Logout", icon: LogOut, href: "/auth" },
];

const groups: NavGroup[] = [
  { label: "MENU", items: MENU_ITEMS },
  { label: "GENERAL", items: GENERAL_ITEMS },
];

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-[#fbfcfa] transition-transform duration-200 ease-out lg:static lg:mr-3 lg:translate-x-0 lg:rounded-[24px]",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-6 pb-6 pt-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#168252] to-[#064123] shadow-[0_12px_24px_rgba(15,107,66,0.18)]">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-[-0.01em] text-[#111111]">
                Orbit
              </p>
              <p className="text-xs text-[#8d9890]">Every order. One orbit.</p>
            </div>
          </div>

          <nav className="flex-1 space-y-7 overflow-y-auto px-4 pb-6">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98a39b]">
                  {group.label}
                </p>
                <ul className="space-y-1" role="list">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/dashboard" &&
                        pathname.startsWith(item.href + "/"));
                    const Icon = item.icon;
                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={clsx(
                            "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                            isActive
                              ? "bg-white text-[#0b5d38] shadow-[0_10px_26px_rgba(18,32,24,0.07)]"
                              : "text-[#8d9890] hover:bg-white/80 hover:text-[#111111]",
                          )}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {isActive && (
                            <span className="absolute -left-4 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-r-full bg-[#168252]" />
                          )}
                          <Icon
                            className={clsx(
                              "h-5 w-5 shrink-0",
                              isActive
                                ? "text-[#168252]"
                                : "text-[#a0aaa2] group-hover:text-[#111111]",
                            )}
                          />
                          {item.label}
                          {isActive && (
                            <ChevronRight className="ml-auto h-4 w-4 text-green-600" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="p-4">
            <div className="relative overflow-hidden rounded-[22px] bg-[radial-gradient(circle_at_20%_20%,#1fb872_0,#0f6b42_30%,#031f12_100%)] p-4 text-white shadow-[0_18px_40px_rgba(4,49,29,0.22)]">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-white/10" />
              <div className="absolute -bottom-10 left-8 h-28 w-28 rounded-full border border-white/10" />
              <div className="absolute inset-0 opacity-10">
                <Shield className="h-full w-full" />
              </div>
              <div className="relative">
                <p className="text-base font-semibold">Private by design</p>
                <p className="mt-1 text-xs leading-5 text-green-100">
                  Gmail read-only. No email edits.
                </p>
                <button className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/25">
                  Manage access
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
