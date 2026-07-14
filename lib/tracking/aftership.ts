import { normalizeStatus } from "@/lib/gmail/parser";
import { requireEnv } from "@/lib/env";
import { verifyAfterShipSignature } from "@/lib/security";
import type {
  TrackingProvider,
  TrackingRegistration,
  TrackingProviderEvent,
} from "@/lib/tracking/provider";

const AFTERSHIP_BASE = "https://api.aftership.com/tracking/2024-04";

type AfterShipCheckpoint = {
  id?: string;
  checkpoint_id?: string;
  checkpoint_time?: string;
  created_at?: string;
  tag?: string;
  subtag?: string;
  message?: string;
  description?: string;
  subtag_message?: string;
  location?: string;
};

type AfterShipTracking = {
  id?: string;
  tracking_id?: string;
  tracking_number?: string;
  tag?: string;
  subtag?: string;
  delivery_status?: string;
  checkpoint?: AfterShipCheckpoint;
  latest_checkpoint?: AfterShipCheckpoint;
  checkpoints?: AfterShipCheckpoint[];
};

type AfterShipWebhookPayload = {
  msg?: AfterShipTracking;
  data?: { tracking?: AfterShipTracking };
  tracking?: AfterShipTracking;
};

export class AfterShipProvider implements TrackingProvider {
  private headers() {
    return {
      "as-api-key": requireEnv("AFTERSHIP_API_KEY"),
      "content-type": "application/json",
    };
  }

  async registerTracking(input: TrackingRegistration) {
    const response = await fetch(`${AFTERSHIP_BASE}/trackings`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        tracking: {
          tracking_number: input.trackingNumber,
          slug: input.courierSlug || undefined,
          title: input.title || undefined,
        },
      }),
    });
    const payload = await response.json();
    if (!response.ok && response.status !== 409) {
      throw new Error(
        payload.meta?.message || "AfterShip registration failed.",
      );
    }
    const tracking = payload.data?.tracking || payload.tracking || {};
    return {
      providerTrackingId:
        tracking.id || tracking.tracking_id || input.trackingNumber,
      courierSlug: tracking.slug || input.courierSlug || undefined,
      trackingUrl: tracking.tracking_account_number
        ? undefined
        : tracking.tracking_url,
    };
  }

  async getTracking(providerTrackingId: string) {
    const response = await fetch(
      `${AFTERSHIP_BASE}/trackings/${providerTrackingId}`,
      { headers: this.headers() },
    );
    if (!response.ok) throw new Error("AfterShip tracking lookup failed.");
    return response.json();
  }

  async detectCourier(trackingNumber: string) {
    const response = await fetch(`${AFTERSHIP_BASE}/couriers/detect`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ tracking: { tracking_number: trackingNumber } }),
    });
    if (!response.ok) return {};
    const payload = await response.json();
    const courier = payload.data?.couriers?.[0];
    return { courierSlug: courier?.slug, courier: courier?.name };
  }

  async removeTracking(providerTrackingId: string) {
    await fetch(`${AFTERSHIP_BASE}/trackings/${providerTrackingId}`, {
      method: "DELETE",
      headers: this.headers(),
    });
  }

  verifyWebhook(rawBody: string, signature: string | null) {
    return verifyAfterShipSignature(rawBody, signature);
  }
}

export function parseAfterShipWebhook(payload: AfterShipWebhookPayload): {
  trackingNumber?: string;
  providerTrackingId?: string;
  events: TrackingProviderEvent[];
  latestStatus?: ReturnType<typeof normalizeStatus>;
  originalStatus?: string;
  checkpoint?: string;
} {
  const tracking =
    payload?.msg || payload?.data?.tracking || payload?.tracking || {};
  const checkpoints = tracking.checkpoints
    ? [...tracking.checkpoints]
    : tracking.checkpoint
      ? [tracking.checkpoint]
      : [];
  const events = checkpoints
    .filter((checkpoint): checkpoint is AfterShipCheckpoint =>
      Boolean(checkpoint),
    )
    .map((checkpoint, index) => ({
      providerEventId: String(
        checkpoint.id ||
          checkpoint.checkpoint_id ||
          `${tracking.id || tracking.tracking_number}-${checkpoint.checkpoint_time || index}`,
      ),
      status: normalizeStatus(
        checkpoint.tag || checkpoint.subtag || checkpoint.message,
      ),
      originalStatus: String(
        checkpoint.tag || checkpoint.subtag || checkpoint.message || "unknown",
      ),
      title: String(
        checkpoint.message ||
          checkpoint.subtag_message ||
          checkpoint.tag ||
          "Shipment update",
      ),
      description: checkpoint.description || checkpoint.subtag_message,
      location: checkpoint.location,
      occurredAt: new Date(
        checkpoint.checkpoint_time || checkpoint.created_at || Date.now(),
      ).toISOString(),
      rawPayload: checkpoint,
    }));

  return {
    trackingNumber: tracking.tracking_number,
    providerTrackingId: tracking.id || tracking.tracking_id,
    events,
    latestStatus: normalizeStatus(
      tracking.tag || tracking.subtag || tracking.delivery_status,
    ),
    originalStatus: tracking.tag || tracking.subtag || tracking.delivery_status,
    checkpoint:
      tracking.checkpoint?.message || tracking.latest_checkpoint?.message,
  };
}
