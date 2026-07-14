import { expect, test } from "@playwright/test";

async function waitForAppReady(page: import("@playwright/test").Page) {
  await page.waitForFunction(
    () => document.documentElement.dataset.orbitReady === "true",
  );
}

test("dashboard renders redesigned shell and key order widgets", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await waitForAppReady(page);
  await expect(page.getByRole("heading", { name: "Order Hub" })).toBeVisible();
  await expect(page.getByText("Live order command center")).toBeVisible();
  await expect(page.getByText("Active Orders")).toBeVisible();
  await expect(page.getByText("Shipment Analytics")).toBeVisible();
  await expect(page.getByText("Recent Orders")).toBeVisible();
  await page.getByLabel("Search orders").fill("nike");
  await expect(
    page.getByRole("link", { name: /Nike Pegasus 41/ }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Add Order" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /AirPods Pro USB-C/ }),
  ).toBeVisible();
});

test("order details renders on mobile", async ({ page }) => {
  await page.goto("/orders/ord_apple");
  await waitForAppReady(page);
  await expect(
    page.getByRole("heading", { name: "AirPods Pro USB-C" }),
  ).toBeVisible();
  await expect(page.getByText("Shipment Timeline")).toBeVisible();
});

test("all sidebar pages render", async ({ page }) => {
  const routes = [
    ["/orders", "All Orders"],
    ["/orders/active", "Active Orders"],
    ["/orders/in-transit", "In Transit"],
    ["/orders/delivered", "Delivered"],
    ["/orders/delayed", "Delayed"],
    ["/returns", "Returns & Refunds"],
    ["/gmail-sync", "Gmail Sync"],
    ["/connections", "Connections"],
    ["/settings", "Settings"],
    ["/help", "Help"],
  ] as const;

  for (const [route, heading] of routes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await waitForAppReady(page);
    await expect(
      page.getByRole("heading", { name: heading, level: 1 }),
    ).toBeVisible();
  }
});

test("order category pages highlight only their sidebar item", async ({
  page,
}) => {
  await page.goto("/orders/active", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);

  await expect(page.getByRole("link", { name: /Active/ })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(
    page.getByRole("link", { name: /All Orders/ }),
  ).not.toHaveAttribute("aria-current", "page");
});

test("top bar controls navigate and update smoothly", async ({ page }) => {
  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);

  await page.getByLabel("Search orders").fill("nike");
  await page.getByLabel("Search orders").press("Enter");
  await expect(page).toHaveURL(/\/orders\?search=nike/);
  await expect(
    page.getByRole("link", { name: /Nike Pegasus 41/ }),
  ).toBeVisible();
  await expect(page.getByText("1 matches")).toBeVisible();

  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  await page.getByLabel("Gmail").click();
  await expect(page).toHaveURL(/\/gmail-sync/);
  await expect(page.getByRole("heading", { name: "Gmail Sync" })).toBeVisible();
});

test("dashboard action buttons provide visible feedback", async ({ page }) => {
  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

  await page.getByRole("button", { name: "Notifications" }).click();
  await page.getByRole("button", { name: "Mark all read" }).click();
  await expect(page.getByText("All notifications marked read")).toBeVisible();

  await page.getByRole("button", { name: "Pause" }).click();
  await expect(page.getByText("Gmail auto-sync paused")).toBeVisible();
  await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();

  await page.getByRole("button", { name: "Sync Now" }).click();
  await expect(page.getByText("Gmail sync started")).toBeVisible();
});

test("order detail action buttons respond", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/orders/ord_apple", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);

  await page.getByRole("button", { name: "Copy tracking" }).click();
  await expect(page.getByText("Tracking number copied")).toBeVisible();

  const pagePromise = context.waitForEvent("page");
  await page.getByRole("button", { name: "Open courier" }).click();
  const newPage = await pagePromise;
  await newPage.close();
  await expect(page.getByText("Blue Dart tracking opened")).toBeVisible();

  await page.getByRole("button", { name: "Refresh" }).click();
  await expect(page.getByText("Tracking refresh queued")).toBeVisible();
});
