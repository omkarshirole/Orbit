import { z } from "zod";
import { ORDER_STATUSES } from "@/lib/constants";

export const manualOrderSchema = z.object({
  store: z.string().trim().min(1, "Store is required").max(120),
  productName: z.string().trim().min(1, "Product name is required").max(240),
  externalOrderId: z.string().trim().max(160).optional().or(z.literal("")),
  trackingNumber: z
    .string()
    .trim()
    .min(4, "Tracking number is required")
    .max(120),
  courier: z.string().trim().max(120).optional().or(z.literal("")),
  price: z.coerce.number().min(0).max(10_000_000).optional(),
  currency: z.string().trim().length(3).default("INR"),
  estimatedDeliveryAt: z.string().datetime().optional().or(z.literal("")),
});

export const orderStatusSchema = z.enum(ORDER_STATUSES);

export const notificationUpdateSchema = z.object({
  notificationId: z.string().uuid().optional(),
  markAll: z.boolean().optional(),
});

export const orderSearchSchema = z.object({
  q: z.string().optional(),
  filter: z.string().optional(),
});
