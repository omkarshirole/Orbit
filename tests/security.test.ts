import crypto from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import {
  createOAuthState,
  verifyAfterShipSignature,
  verifyOAuthState,
} from "@/lib/security";

beforeEach(() => {
  process.env.GMAIL_OAUTH_STATE_SECRET = "state-test-secret";
  process.env.AFTERSHIP_WEBHOOK_SECRET = "webhook-test-secret";
});

describe("OAuth state", () => {
  it("signs and verifies state with expiry", () => {
    const state = createOAuthState("user-1", "/dashboard", 1_000);
    expect(verifyOAuthState(state, "user-1", 1_500).returnTo).toBe(
      "/dashboard",
    );
  });

  it("rejects expired state", () => {
    const state = createOAuthState("user-1", "/dashboard", 1_000);
    expect(() =>
      verifyOAuthState(state, "user-1", 1_000 + 11 * 60 * 1000),
    ).toThrow(/expired/i);
  });

  it("rejects tampered state", () => {
    const state = createOAuthState("user-1");
    expect(() => verifyOAuthState(`${state}x`, "user-1")).toThrow(/signature/i);
  });
});

describe("AfterShip webhook signatures", () => {
  it("accepts valid base64 hmac signatures", () => {
    const raw = JSON.stringify({ msg: { tracking_number: "ABC123" } });
    const sig = crypto
      .createHmac("sha256", "webhook-test-secret")
      .update(raw)
      .digest("base64");
    expect(verifyAfterShipSignature(raw, sig)).toBe(true);
  });

  it("rejects invalid signatures", () => {
    expect(verifyAfterShipSignature("{}", "invalid")).toBe(false);
  });
});
