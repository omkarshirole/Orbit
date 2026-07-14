import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";
import { ToastProvider } from "@/components/toast-provider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const RTRVR_ATTRS = [
  "rtrvr-ls",
  "rtrvr-mw-ready",
  "rtrvr-react",
  "rtrvr-gl-click",
  "rtrvr-gl-input",
  "rtrvr-gl-keydown",
  "rtrvr-mw-busy",
];

const stripRtrvrAttrs = `
  (function () {
    var attrs = ${JSON.stringify(RTRVR_ATTRS)};
    function clean() {
      var i, j;
      for (i = 0; i < attrs.length; i++) {
        var nodes = document.querySelectorAll("[" + attrs[i] + "]");
        for (j = 0; j < nodes.length; j++) {
          nodes[j].removeAttribute(attrs[i]);
        }
      }
    }
    clean();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", clean);
    }
    new MutationObserver(clean).observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: attrs });
  })();
`;

export const metadata: Metadata = {
  title: "Orbit Order Hub",
  description: "Every order. One orbit.",
  metadataBase: new URL(process.env.PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: stripRtrvrAttrs }}
          suppressHydrationWarning
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
