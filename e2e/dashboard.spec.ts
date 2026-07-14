import { expect, test } from "@playwright/test";

test("dashboard supports search, filters, add order, and details", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Order command center" }),
  ).toBeVisible();
  await page.getByLabel("Search orders").fill("nike");
  await expect(page.getByText("Nike Pegasus 41")).toBeVisible();
  await expect(page.getByText("AirPods Pro USB-C")).toBeHidden();
  await page.getByRole("button", { name: "delayed", exact: true }).click();
  await expect(page.getByText("No orders found")).toBeVisible();
  await page.getByRole("button", { name: "Add Order" }).click();
  await expect(page.getByRole("heading", { name: "Add order" })).toBeVisible();
});

test("order details renders on mobile", async ({ page }) => {
  await page.goto("/orders/ord_apple");
  await expect(
    page.getByRole("heading", { name: "AirPods Pro USB-C" }),
  ).toBeVisible();
  await expect(page.getByText("Shipment timeline")).toBeVisible();
});
