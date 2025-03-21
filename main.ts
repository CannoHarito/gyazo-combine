import { createApp } from "./factory.ts";
import { serveStatic } from "@hono/hono/deno";
import { HTTPException } from "@hono/hono/http-exception";

import renderer from "./routes/_renderer.tsx";
import indexApp from "./routes/index.tsx";
import imagesApp from "./routes/images.ts";
import uploadApp from "./routes/upload.tsx";
import renderApp from "./routes/render.ts";
import authApp from "./routes/auth.tsx";

const app = createApp();

app.get("favicon.ico", serveStatic({ path: "./static/favicon.min.svg" }));
app.use("/static/*", serveStatic({ root: "./" }));

app.use(renderer);
app.route("/upload", uploadApp);
app.route("/images", imagesApp);
app.route("/render", renderApp);
app.route("/auth", authApp);
app.route("/", indexApp);
app.onError((e, c) => {
  if (e instanceof HTTPException && e.res) {
    return e.getResponse();
  }
  const { status = 500 } = e as HTTPException;
  return c.json({ message: e.message }, status);
});
export default app;
