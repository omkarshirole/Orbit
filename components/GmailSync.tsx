"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, RotateCcw, PauseCircle, PlayCircle, Shield } from "lucide-react";
import { useToast } from "./toast-provider";

export function GmailSync() {
  const { notify } = useToast();
  const [isPaused, setIsPaused] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  async function syncNow() {
    setIsSyncing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setIsSyncing(false);
    notify("Gmail sync started");
  }

  function togglePause() {
    setIsPaused((current) => {
      const next = !current;
      notify(next ? "Gmail auto-sync paused" : "Gmail auto-sync resumed");
      return next;
    });
  }

  return (
    <Card
      variant="elevated"
      className="relative min-h-[290px] overflow-hidden border-0 bg-[radial-gradient(circle_at_75%_5%,rgba(58,180,114,0.42),transparent_24%),radial-gradient(circle_at_10%_95%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(135deg,#032111,#0d5f39_62%,#02150b)] text-white"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute right-[-70px] top-10 h-60 w-60 rounded-full border border-white/20" />
        <div className="absolute right-[-38px] top-20 h-44 w-44 rounded-full border border-white/20" />
        <div className="absolute right-[-10px] top-32 h-28 w-28 rounded-full border border-white/20" />
      </div>
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-white">Gmail Sync</CardTitle>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-200" />
          <span className="text-xs text-green-100">Encrypted</span>
        </div>
      </CardHeader>
      <CardContent className="relative flex h-full flex-col items-center justify-center pt-0 text-center">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/12">
            <Mail className="h-7 w-7" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-green-100">Last sync</p>
            <p className="text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
              01:24:08
            </p>
            <p className="text-xs text-green-200">ago</p>
          </div>
        </div>

        <div className="flex w-full max-w-xs items-center gap-3">
          <button
            type="button"
            onClick={togglePause}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20 active:translate-y-0"
          >
            {isPaused ? (
              <PlayCircle className="h-4 w-4" />
            ) : (
              <PauseCircle className="h-4 w-4" />
            )}
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            onClick={syncNow}
            disabled={isSyncing}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#064123] transition hover:-translate-y-0.5 hover:bg-green-100 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RotateCcw
              className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Syncing" : "Sync Now"}
          </button>
        </div>

        <p className="mt-6 text-xs text-green-200">
          Gmail read-only access · Tokens encrypted · Never shared
        </p>
      </CardContent>
    </Card>
  );
}
