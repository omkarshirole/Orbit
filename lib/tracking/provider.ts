import type { OrderStatus } from "@/lib/constants";

export type TrackingRegistration = {
  trackingNumber: string;
  courierSlug?: string | null;
  title?: string | null;
};

export type TrackingProviderEvent = {
  providerEventId: string;
  status: OrderStatus;
  originalStatus: string;
  title: string;
  description?: string;
  location?: string;
  occurredAt: string;
  rawPayload: unknown;
};

export interface TrackingProvider {
  registerTracking(input: TrackingRegistration): Promise<{
    providerTrackingId: string;
    courierSlug?: string;
    trackingUrl?: string;
  }>;
  getTracking(providerTrackingId: string): Promise<unknown>;
  detectCourier(
    trackingNumber: string,
  ): Promise<{ courierSlug?: string; courier?: string }>;
  removeTracking(providerTrackingId: string): Promise<void>;
  verifyWebhook(rawBody: string, signature: string | null): boolean;
}
