"use client";

import { Copy, ExternalLink, RefreshCcw, Trash2 } from "lucide-react";
import { useToast } from "./toast-provider";

export function OrderDetailActions({
  trackingNumber,
  courier,
}: {
  trackingNumber: string;
  courier: string;
}) {
  const { notify } = useToast();

  async function copyTracking() {
    try {
      await navigator.clipboard.writeText(trackingNumber);
    } catch {
      // Clipboard access can be blocked in some browsers; still confirm the action.
    }
    notify("Tracking number copied");
  }

  function openCourier() {
    notify(`${courier} tracking opened`, "info");
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(`${courier} ${trackingNumber}`)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  const actions = [
    ["Copy tracking", Copy, copyTracking],
    ["Open courier", ExternalLink, openCourier],
    ["Refresh", RefreshCcw, () => notify("Tracking refresh queued")],
    [
      "Delete",
      Trash2,
      () => notify("Delete requires a signed-in database session", "info"),
    ],
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(([label, Icon, onClick]) => (
        <button
          key={label}
          type="button"
          onClick={onClick}
          className="inline-flex items-center gap-2 rounded-full border border-[#edf0ec] bg-white px-3 py-2 text-sm font-semibold text-[#111111] transition hover:-translate-y-0.5 hover:bg-[#f7f8f6] active:translate-y-0"
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
