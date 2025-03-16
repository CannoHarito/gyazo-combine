import { Child } from "@hono/hono/jsx";
import { createFactory } from "@hono/hono/factory";

declare module "@hono/hono" {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      props?: { title?: string; heads?: Child },
    ): Response | Promise<Response>;
  }
}

type Env = {
  Variables: {
    token?: string;
    setToken?: () => void;
  };
};

const factory = createFactory<Env>();
export const { createApp, createHandlers, createMiddleware } = factory;
