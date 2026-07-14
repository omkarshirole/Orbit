"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Mail, RotateCcw, PauseCircle, Shield } from "lucide-react";
import { clsx } from "clsx";

export function GmailSync() {
  return (
    <Card variant="elevated" className="h-full bg-gradient-to-br from-green-900 to-green-800 text-white">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-white">Gmail Sync</CardTitle>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-200" />
          <span className="text-xs text-green-100">Encrypted</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col items-center justify-center h-full text-center">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <Mail className="h-7 w-7" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-green-100">Last sync</p>
            <p className="text-3xl font-bold">01:24:08</p>
            <p className="text-xs text-green-200">ago</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full max-w-xs">
          <Button variant="outline" className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20" size="md">
            <PauseCircle className="h-4 w-4 mr-2" />
            Pause
          </Button>
          <Button variant="primary" className="flex-1 bg-white text-green-900 hover:bg-green-100" size="md">
            <RotateCcw className="h-4 w-4 mr-2" />
            Sync Now
          </Button>
        </div>

        <p className="mt-6 text-xs text-green-200">
          Gmail read-only access · Tokens encrypted · Never shared
        </p>
      </CardContent>
    </Card>
  );
}