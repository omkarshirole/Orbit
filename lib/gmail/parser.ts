import {
  COURIERS,
  ORDER_STATUSES,
  STORES,
  type OrderStatus,
} from "@/lib/constants";

export type ParsedOrderEmail = {
  store: string;
  productName: string;
  productImageUrl?: string;
  externalOrderId?: string;
  trackingNumber?: string;
  courier?: string;
  courierSlug?: string;
  price?: number;
  currency?: string;
  orderedAt?: string;
  shippedAt?: string;
  estimatedDeliveryAt?: string;
  status: OrderStatus;
  originalStatus?: string;
  sourceMessageId: string;
};

type GmailLikeMessage = {
  id: string;
  snippet?: string;
  subject?: string;
  from?: string;
  date?: string;
  text?: string;
};

const trackingPatterns = [
  /(?:tracking|awb|shipment|waybill|consignment)(?:\s*(?:number|no|id|#))?\s*[:#-]?\s*([A-Z0-9-]{7,30})/i,
  /\b([A-Z]{2}\d{9}[A-Z]{2})\b/,
  /\b(\d{10,18})\b/,
];

const orderPatterns = [
  /(?:order|order id|order number|order no)\s*[:#-]?\s*([A-Z0-9-]{5,32})/i,
  /\border\s*#\s*([A-Z0-9-]{5,32})/i,
];

const pricePattern = /(?:rs\.?|inr|₹|\$|usd|eur|gbp)\s*([0-9][0-9,.]*)/i;

export function normalizeStatus(input?: string | null): OrderStatus {
  const value = (input || "").toLowerCase();
  if (/refund(ed)?/.test(value))
    return value.includes("processing") ? "refund_processing" : "refunded";
  if (/return requested|return initiated/.test(value))
    return "return_requested";
  if (/return.*transit|reverse.*pickup/.test(value)) return "return_in_transit";
  if (/returned/.test(value)) return "returned";
  if (/cancel/.test(value)) return "cancelled";
  if (/delivered/.test(value)) return "delivered";
  if (/out for delivery/.test(value)) return "out_for_delivery";
  if (/attempt/.test(value)) return "delivery_attempted";
  if (/fail|exception|undeliverable/.test(value)) return "failed";
  if (/delay|held|stuck/.test(value)) return "delayed";
  if (/arriv|today|tomorrow/.test(value)) return "arriving_soon";
  if (/transit|checkpoint|departed|arrived at|in[-\s]?route/.test(value))
    return "in_transit";
  if (/ship|dispatch|picked up/.test(value)) return "shipped";
  if (/process|packed|preparing/.test(value)) return "processing";
  if (/confirm/.test(value)) return "confirmed";
  if (/order|placed|received/.test(value)) return "ordered";
  return ORDER_STATUSES.includes(value as OrderStatus)
    ? (value as OrderStatus)
    : "unknown";
}

export function detectCourier(text: string) {
  const courier = COURIERS.find((candidate) =>
    candidate.patterns.some((pattern) => pattern.test(text)),
  );
  return courier ? { courier: courier.name, courierSlug: courier.slug } : {};
}

function detectStore(text: string, from?: string) {
  const source = `${from || ""} ${text}`;
  const found = STORES.find((store) =>
    new RegExp(`\\b${store}\\b`, "i").test(source),
  );
  if (found) return found;
  const emailDomain = from?.match(/@([a-z0-9.-]+)/i)?.[1]?.split(".")?.[0];
  return emailDomain
    ? emailDomain[0].toUpperCase() + emailDomain.slice(1)
    : "Unknown store";
}

function firstMatch(patterns: RegExp[], text: string) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].replace(/\s+/g, "").trim();
    }
  }
  return undefined;
}

function extractProductName(subject: string, text: string) {
  const productMatch =
    text.match(/(?:item|product|package)\s*[:#-]\s*([^\n.]{3,120})/i) ||
    subject.match(
      /(?:your|the)\s+(.{3,90}?)\s+(?:order|has shipped|was delivered)/i,
    );
  return (
    productMatch?.[1]?.trim() ||
    subject.replace(/^(re:|fwd:)/i, "").slice(0, 120) ||
    "Online order"
  );
}

function extractDate(text: string, labels: string[]) {
  for (const label of labels) {
    const match = text.match(
      new RegExp(
        `${label}\\s*[:#-]?\\s*([A-Za-z]{3,9}\\s+\\d{1,2},?\\s+\\d{4}|\\d{4}-\\d{2}-\\d{2})`,
        "i",
      ),
    );
    if (match?.[1]) {
      const date = new Date(match[1]);
      if (!Number.isNaN(date.getTime())) return date.toISOString();
    }
  }
  return undefined;
}

export function parseOrderEmail(
  message: GmailLikeMessage,
): ParsedOrderEmail | null {
  const subject = message.subject || "";
  const body = `${message.snippet || ""}\n${message.text || ""}`;
  const haystack = `${subject}\n${body}`;
  const isLikelyOrder =
    /(order|tracking|shipment|delivered|dispatch|refund|return|cancelled|package|awb)/i.test(
      haystack,
    );
  if (!isLikelyOrder) {
    return null;
  }

  const priceMatch = haystack.match(pricePattern);
  const currencySymbol = haystack
    .match(/₹|rs\.?|inr|\$|usd|eur|gbp/i)?.[0]
    ?.toLowerCase();
  const currency =
    currencySymbol?.includes("$") || currencySymbol === "usd"
      ? "USD"
      : currencySymbol === "eur"
        ? "EUR"
        : currencySymbol === "gbp"
          ? "GBP"
          : "INR";
  const status = normalizeStatus(haystack);
  const detectedCourier = detectCourier(haystack);

  return {
    store: detectStore(haystack, message.from),
    productName: extractProductName(subject, haystack),
    externalOrderId: firstMatch(orderPatterns, haystack),
    trackingNumber: firstMatch(trackingPatterns, haystack),
    ...detectedCourier,
    price: priceMatch ? Number(priceMatch[1].replace(/,/g, "")) : undefined,
    currency,
    orderedAt:
      extractDate(haystack, ["order date", "ordered on", "placed on"]) ||
      (message.date ? new Date(message.date).toISOString() : undefined),
    shippedAt: extractDate(haystack, ["shipped on", "dispatched on"]),
    estimatedDeliveryAt: extractDate(haystack, [
      "estimated delivery",
      "arriving",
      "expected delivery",
    ]),
    status,
    originalStatus: status === "unknown" ? undefined : status,
    sourceMessageId: message.id,
  };
}
