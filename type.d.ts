import type { Context } from "hono/mod.ts";

type Head = {
  title?: string;
};

declare module "hono/mod.ts" {
  interface Env {
    Variables: { token: string; setToken: (c: Context) => void };
    Bindings: Record<string, string>;
  }
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      head?: Head,
    ): Response | Promise<Response>;
  }
}
