// import { Hono } from "@hono/hono";
import { createApp } from "./factory.ts";
import { serveStatic } from "@hono/hono/deno";

import renderer from "./routes/_renderer.tsx";
import indexApp from "./routes/index.tsx";
import imagesApp from "./routes/images.ts";
import renderApp from "./routes/render.ts";
import authApp from "./routes/auth.tsx";
import upload from "./routes/upload.tsx";

const app = createApp();

app.get("favicon.ico", serveStatic({ path: "./static/favicon.min.svg" }));
app.use("/static/*", serveStatic({ root: "./" }));

app.use(renderer);
app.get("/upload", ...upload);
app.route("/images", imagesApp);
app.route("/render", renderApp);
app.route("/auth", authApp);
app.route("/", indexApp);

export default app;
