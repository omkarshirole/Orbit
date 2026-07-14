import { z } from "zod";

const serverEnvSchema = z.object({
  PUBLIC_APP_URL: z.string().url().optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  GOOGLE_OAUTH_CLIENT_ID: z.string().optional(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().optional(),
  GMAIL_OAUTH_STATE_SECRET: z.string().optional(),
  AFTERSHIP_API_KEY: z.string().optional(),
  AFTERSHIP_WEBHOOK_SECRET: z.string().optional(),
  TOKEN_ENCRYPTION_KEY: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse(process.env);
}

export function requireEnv<K extends keyof ServerEnv>(
  key: K,
): NonNullable<ServerEnv[K]> {
  const value = getServerEnv()[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value as NonNullable<ServerEnv[K]>;
}

export function getPublicAppUrl() {
  return requireEnv("PUBLIC_APP_URL").replace(/\/$/, "");
}
