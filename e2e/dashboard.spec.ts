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
  await expect(page.getByText("Shipment timeline")).toBeVisible();
});
