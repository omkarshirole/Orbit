"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function OrbitAppShell({
  eyebrow,
  title,
  description,
  children,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ffffff_0,#f3f4f1_42%,#ebeeea_100%)] p-3 text-[#121713] sm:p-5 lg:p-7">
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[1440px] overflow-hidden rounded-[32px] border border-white/80 bg-white/70 p-3 shadow-[0_24px_80px_rgba(22,34,27,0.12)] backdrop-blur md:p-4">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col rounded-[26px] bg-[#f7f8f6]">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="min-w-0 p-4 md:p-5 xl:p-6">
            <section className="mb-5 flex flex-col gap-4 rounded-[24px] bg-white/60 p-4 md:flex-row md:items-end md:justify-between md:p-5">
              <div>
                {eyebrow && (
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#dfe8df] bg-white px-3 py-1 text-xs font-semibold text-[#0f6b42] shadow-sm">
                    {eyebrow}
                  </div>
                )}
                <h1 className="text-4xl font-semibold tracking-[-0.02em] text-[#101411] md:text-5xl">
                  {title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#78837b] md:text-base">
                  {description}
                </p>
              </div>
              {actions && (
                <div className="flex flex-wrap items-center gap-3">
                  {actions}
                </div>
              )}
            </section>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
