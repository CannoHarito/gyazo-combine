import { Hono } from "hono/mod.ts";
import { serveStatic } from "hono/middleware.ts";
import { showRoutes } from "hono/helper.ts";

import renderer from "./routes/_renderer.tsx";
import indexApp from "./routes/index.tsx";
import imagesApp from "./routes/images.ts";
import renderApp from "./routes/render.ts";
import authApp from "./routes/auth.tsx";
import upload from "./routes/upload.tsx";

const app = new Hono();

app.use(renderer);
app.get("favicon.svg", serveStatic({ path: "./static/favicon.min.svg" }));
app.get("favicon.ico", serveStatic({ path: "./static/favicon.ico" }));
app.use("/static/*", serveStatic({ root: "./" }));
app.get("/upload", ...upload);
app.route("/images", imagesApp);
app.route("/render", renderApp);
app.route("/auth", authApp);
app.route("/", indexApp);

export default app;

if (import.meta.main) {
  showRoutes(app);
  Deno.serve(app.fetch);
}
