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
  { label: "All Orders", icon: Inbox, href: "/dashboard#all" },
  { label: "Active", icon: Clock, href: "/dashboard#active" },
  { label: "In Transit", icon: Truck, href: "/dashboard#transit" },
  { label: "Delivered", icon: CheckCircle2, href: "/dashboard#delivered" },
  { label: "Delayed", icon: Bell, href: "/dashboard#delayed" },
  { label: "Returns & Refunds", icon: Undo2, href: "/dashboard#returns" },
  { label: "Gmail Sync", icon: Mail, href: "/dashboard#gmail" },
];

const GENERAL_ITEMS: NavItem[] = [
  { label: "Connections", icon: Link2, href: "/dashboard#connections" },
  { label: "Settings", icon: Settings, href: "/dashboard#settings" },
  { label: "Help", icon: HelpCircle, href: "/dashboard#help" },
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
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-[#edf0ec] transition-transform duration-200 ease-out lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-[#edf0ec] px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-800">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-[#111111]">Orbit</p>
              <p className="text-xs text-[#8d9890]">Every order. One orbit.</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[#8d9890]">
                  {group.label}
                </p>
                <ul className="space-y-1" role="list">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "#");
                    const Icon = item.icon;
                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={clsx(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                            isActive
                              ? "bg-green-50 text-green-800"
                              : "text-[#8d9890] hover:bg-[#f7f8f6] hover:text-[#111111]",
                          )}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <Icon
                            className={clsx(
                              "h-5 w-5 shrink-0",
                              isActive && "text-green-700",
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

          {/* Bottom privacy card */}
          <div className="border-t border-[#edf0ec] p-4">
            <div className="relative rounded-2xl bg-gradient-to-br from-green-800 to-green-900 p-4 text-white">
              <div className="absolute inset-0 opacity-10">
                <Shield className="h-full w-full" />
              </div>
              <div className="relative">
                <p className="font-semibold">Private by design</p>
                <p className="mt-1 text-sm text-green-100">
                  Gmail read-only. No email edits.
                </p>
                <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20 transition-colors">
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
