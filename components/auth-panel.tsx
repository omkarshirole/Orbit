"use client";

import { LogIn } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useToast } from "./toast-provider";

export function AuthPanel() {
  const { notify } = useToast();

  async function signIn() {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard`,
        scopes: "openid email profile",
      },
    });
    if (error) notify(error.message, "info");
  }

  return (
    <div className="min-h-screen bg-orbit-wash px-5 py-10 text-orbit-ink">
      <main className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orbit-primary">
            Orbit Order Hub
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight md:text-7xl">
            Every order. One orbit.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-orbit-muted">
            Sign in to track orders across stores, couriers, returns, refunds,
            and delivery updates from one quiet dashboard.
          </p>
        </section>
        <section className="rounded-2xl border border-orbit-line bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-semibold">Sign in to Orbit</h2>
          <p className="mt-3 rounded-xl border border-orbit-line bg-orbit-wash p-4 text-sm leading-6 text-orbit-muted">
            Sign-in only verifies your identity. Gmail read access is requested
            separately and is used only to identify order-related emails.
          </p>
          <button
            onClick={signIn}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orbit-primary px-4 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-orbit-primaryDark active:translate-y-0"
          >
            <LogIn size={18} />
            Continue with Google
          </button>
          <p className="mt-5 text-sm leading-6 text-orbit-muted">
            Orbit reads only the Gmail messages required to identify online
            orders and shipment updates. Orbit does not send, edit or delete
            emails.
          </p>
        </section>
      </main>
    </div>
  );
}
