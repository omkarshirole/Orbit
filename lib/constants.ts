export const ORDER_STATUSES = [
  "ordered",
  "confirmed",
  "processing",
  "shipped",
  "in_transit",
  "arriving_soon",
  "out_for_delivery",
  "delivered",
  "delayed",
  "delivery_attempted",
  "failed",
  "cancelled",
  "return_requested",
  "return_in_transit",
  "returned",
  "refund_processing",
  "refunded",
  "unknown",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const COURIERS = [
  { name: "Delhivery", slug: "delhivery", patterns: [/delhivery/i] },
  {
    name: "Blue Dart",
    slug: "bluedart",
    patterns: [/blue\s*dart/i, /\bbluedart\b/i],
  },
  { name: "Ekart", slug: "ekart", patterns: [/ekart/i] },
  { name: "Ecom Express", slug: "ecom-express", patterns: [/ecom\s*express/i] },
  { name: "DTDC", slug: "dtdc", patterns: [/\bdtdc\b/i] },
  {
    name: "India Post",
    slug: "india-post",
    patterns: [/india\s*post/i, /\bspeed\s*post\b/i],
  },
  { name: "DHL", slug: "dhl", patterns: [/\bdhl\b/i] },
  { name: "FedEx", slug: "fedex", patterns: [/\bfedex\b/i] },
  { name: "UPS", slug: "ups", patterns: [/\bups\b/i] },
] as const;

export const STORES = [
  "Amazon",
  "Flipkart",
  "Myntra",
  "Meesho",
  "Ajio",
  "Nike",
  "Apple",
] as const;

export const GMAIL_ORDER_QUERY =
  "(category:purchases OR subject:(order shipped delivery tracking dispatched confirmed refund return cancelled)) newer_than:180d";
