import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const APP_ENV = ["production", "staging", "demo", "development"] as const;

// @ref: https://env.t3.gg/docs/nextjs
export const env = createEnv({
  /**
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    APP_ENV: z.enum(APP_ENV),
    DATABASE_URL: z.string().url(),
  },
  /**
   * Environment variables available on the client (and server).
   * You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  },
  /**
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    APP_ENV:
      APP_ENV.find((env) => env === process.env.APP_ENV) ?? "development",
  },
});

export const siteMeta = {
  title: "NextJS Fullstack Starter",
  description: "Build your fullstack nextjs.",
  baseUrl: env.NEXT_PUBLIC_SITE_URL,
};
