import { GMAIL_ORDER_QUERY } from "@/lib/constants";
import { decryptToken, encryptToken } from "@/lib/security";
import { parseOrderEmail } from "@/lib/gmail/parser";
import { refreshGmailAccessToken } from "@/lib/gmail/oauth";
import type { SupabaseClient } from "@supabase/supabase-js";

type SyncStats = {
  emailsScanned: number;
  ordersAdded: number;
  ordersUpdated: number;
  errorCount: number;
};

type GmailHeader = { name?: string; value?: string };
type GmailPayload = {
  mimeType?: string;
  body?: { data?: string };
  parts?: GmailPayload[];
  headers?: GmailHeader[];
};
type GmailMessage = {
  id: string;
  snippet?: string;
  payload?: GmailPayload;
};

async function gmailFetch<T>(accessToken: string, path: string): Promise<T> {
  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/${path}`,
    {
      headers: { authorization: `Bearer ${accessToken}` },
    },
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      text.includes("Access Not Configured") ? "Gmail API disabled." : text,
    );
  }
  return response.json() as Promise<T>;
}

function decodeGmailBody(payload?: GmailPayload): string {
  const parts = [payload, ...(payload?.parts || [])];
  const textPart = parts.find(
    (part) => part?.mimeType === "text/plain" && part.body?.data,
  );
  if (!textPart?.body?.data) return "";
  return Buffer.from(textPart.body.data, "base64url")
    .toString("utf8")
    .slice(0, 20_000);
}

export async function syncGmailOrders(
  supabase: SupabaseClient,
  userId: string,
): Promise<SyncStats> {
  const stats: SyncStats = {
    emailsScanned: 0,
    ordersAdded: 0,
    ordersUpdated: 0,
    errorCount: 0,
  };
  const { data: tokenRow, error: tokenError } = await supabase
    .from("gmail_tokens")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (tokenError || !tokenRow) {
    throw new Error("Gmail is not connected.");
  }

  const { data: syncRun } = await supabase
    .from("gmail_sync_runs")
    .insert({
      user_id: userId,
      status: "running",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  try {
    let accessToken = decryptToken(tokenRow.encrypted_access_token);
    if (new Date(tokenRow.token_expiry).getTime() < Date.now() + 60_000) {
      const refreshed = await refreshGmailAccessToken(
        decryptToken(tokenRow.encrypted_refresh_token),
      );
      accessToken = refreshed.access_token;
      await supabase
        .from("gmail_tokens")
        .update({
          encrypted_access_token: encryptToken(refreshed.access_token),
          token_expiry: new Date(
            Date.now() + refreshed.expires_in * 1000,
          ).toISOString(),
          provider_scope: refreshed.scope || tokenRow.provider_scope,
        })
        .eq("user_id", userId);
    }
    const list = await gmailFetch<{ messages?: { id: string }[] }>(
      accessToken,
      `messages?q=${encodeURIComponent(GMAIL_ORDER_QUERY)}&maxResults=25`,
    );
    const messages = list.messages || [];
    stats.emailsScanned = messages.length;

    for (const message of messages) {
      try {
        const full = await gmailFetch<GmailMessage>(
          accessToken,
          `messages/${message.id}?format=full`,
        );
        const headers = full.payload?.headers || [];
        const getHeader = (name: string) =>
          headers.find((header) => header.name?.toLowerCase() === name)?.value;
        const parsed = parseOrderEmail({
          id: full.id,
          snippet: full.snippet,
          subject: getHeader("subject"),
          from: getHeader("from"),
          date: getHeader("date"),
          text: decodeGmailBody(full.payload),
        });
        if (!parsed) continue;

        const { data: existing } = await supabase
          .from("orders")
          .select("id, shipments!inner(tracking_number)")
          .eq("user_id", userId)
          .or(
            [
              `source_message_id.eq.${parsed.sourceMessageId}`,
              parsed.externalOrderId
                ? `external_order_id.eq.${parsed.externalOrderId}`
                : "",
              parsed.trackingNumber
                ? `shipments.tracking_number.eq.${parsed.trackingNumber}`
                : "",
            ]
              .filter(Boolean)
              .join(","),
          )
          .maybeSingle();

        const orderPayload = {
          user_id: userId,
          external_order_id: parsed.externalOrderId,
          store: parsed.store,
          product_name: parsed.productName,
          product_image_url: parsed.productImageUrl,
          price: parsed.price,
          currency: parsed.currency || "INR",
          status: parsed.status,
          original_status: parsed.originalStatus,
          source: "gmail",
          source_message_id: parsed.sourceMessageId,
          ordered_at: parsed.orderedAt,
          estimated_delivery_at: parsed.estimatedDeliveryAt,
        };

        const orderResult = existing
          ? await supabase
              .from("orders")
              .update(orderPayload)
              .eq("id", existing.id)
              .select("id")
              .single()
          : await supabase
              .from("orders")
              .insert(orderPayload)
              .select("id")
              .single();

        if (orderResult.data?.id && parsed.trackingNumber) {
          await supabase.from("shipments").upsert(
            {
              order_id: orderResult.data.id,
              user_id: userId,
              courier: parsed.courier,
              courier_slug: parsed.courierSlug,
              tracking_number: parsed.trackingNumber,
              tracking_provider: "aftership",
            },
            { onConflict: "user_id,tracking_number" },
          );
        }

        if (existing) {
          stats.ordersUpdated++;
        } else {
          stats.ordersAdded++;
        }
      } catch (error) {
        stats.errorCount++;
        await supabase.from("gmail_sync_logs").insert({
          sync_run_id: syncRun?.id,
          user_id: userId,
          stage: "message",
          level: "error",
          message:
            error instanceof Error
              ? error.message.slice(0, 500)
              : "Unknown Gmail sync error",
        });
      }
    }
  } finally {
    if (syncRun?.id) {
      await supabase
        .from("gmail_sync_runs")
        .update({
          status: stats.errorCount ? "completed_with_errors" : "completed",
          emails_scanned: stats.emailsScanned,
          orders_added: stats.ordersAdded,
          orders_updated: stats.ordersUpdated,
          error_count: stats.errorCount,
          completed_at: new Date().toISOString(),
        })
        .eq("id", syncRun.id);
    }
  }

  return stats;
}
