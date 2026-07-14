"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, Info, X } from "lucide-react";

type ToastTone = "success" | "info";

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  notify: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, tone: ToastTone = "success") => {
      const id = Date.now() + Math.random();
      setToasts((items) => [...items, { id, message, tone }].slice(-3));
      window.setTimeout(() => removeToast(id), 3200);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ notify }), [notify]);

  useEffect(() => {
    document.documentElement.dataset.orbitReady = "true";
    return () => {
      delete document.documentElement.dataset.orbitReady;
    };
  }, []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[120] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => {
          const Icon = toast.tone === "success" ? CheckCircle2 : Info;
          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 text-sm font-semibold text-[#111111] shadow-[0_22px_60px_rgba(18,32,24,0.18)] backdrop-blur animate-in"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eef8f1] text-[#0f6b42]">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">{toast.message}</span>
              <button
                type="button"
                className="rounded-full p-1 text-[#8d9890] transition hover:bg-[#f7f8f6] hover:text-[#111111]"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return value;
}
