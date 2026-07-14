import { expect, test } from "@playwright/test";

test("dashboard renders redesigned shell and key order widgets", async ({
  page,
}) => {
  await page.goto("/dashboard");
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
  await expect(
    page.getByRole("heading", { name: "AirPods Pro USB-C" }),
  ).toBeVisible();
<<<<<<< HEAD
  await expect(page.getByText("Shipment timeline")).toBeVisible();
=======
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
    await expect(
      page.getByRole("heading", { name: heading, level: 1 }),
    ).toBeVisible();
  }
>>>>>>> 2870ac1 (Initial commit)
});
