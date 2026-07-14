import { describe, expect, it } from "vitest";
import {
  detectCourier,
  normalizeStatus,
  parseOrderEmail,
} from "@/lib/gmail/parser";

describe("Gmail parser", () => {
  it("extracts deterministic order fields", () => {
    const parsed = parseOrderEmail({
      id: "msg-1",
      from: "ship@amazon.in",
      subject: "Your Amazon order has shipped",
      text: "Order # OD12345 Tracking number BD892034781IN Blue Dart Product: AirPods Pro Estimated delivery: Jul 18, 2026 ₹24,900",
    });
    expect(parsed).toMatchObject({
      store: "Amazon",
      productName: "AirPods Pro Estimated delivery: Jul 18, 2026 ₹24,900",
      externalOrderId: "OD12345",
      trackingNumber: "BD892034781IN",
      courier: "Blue Dart",
      status: "shipped",
    });
  });

  it("normalizes provider statuses", () => {
    expect(normalizeStatus("Out for Delivery")).toBe("out_for_delivery");
    expect(normalizeStatus("delivery exception failed")).toBe("failed");
    expect(normalizeStatus("refund processing")).toBe("refund_processing");
  });

  it("detects Indian and international couriers", () => {
    expect(detectCourier("sent by Delhivery")).toEqual({
      courier: "Delhivery",
      courierSlug: "delhivery",
    });
    expect(detectCourier("DHL Express update")).toEqual({
      courier: "DHL",
      courierSlug: "dhl",
    });
  });
});
