import { describe, expect, it } from "vitest";
import { manualOrderSchema } from "@/lib/schemas";

describe("manual order validation", () => {
  it("requires store, product name, and tracking number", () => {
    expect(() =>
      manualOrderSchema.parse({
        store: "",
        productName: "",
        trackingNumber: "",
      }),
    ).toThrow();
  });

  it("accepts valid manual orders", () => {
    expect(
      manualOrderSchema.parse({
        store: "Myntra",
        productName: "Linen shirt",
        trackingNumber: "1234567890",
        currency: "INR",
      }).store,
    ).toBe("Myntra");
  });
});
