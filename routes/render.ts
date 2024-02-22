import { Hono, HTTPException } from "hono/mod.ts";
import { html } from "hono/helper.ts";
import { parseToken } from "../token.ts";
import { upload } from "../gyazo.ts";
import { getParams, parseIds } from "../param.ts";
import { injectRenderVH } from "../canvas/renderVh.ts";
import { createCanvas, getSource, type Image } from "../canvas/canvasDeno.ts";

const renderVH = injectRenderVH<Image, ReturnType<typeof createCanvas>>(
  getSource,
  createCanvas,
);
const app = new Hono();

app.get("/:filename?", async (c) => {
  const colIds = parseIds(c.req.query("ids") ?? "");
  const params = getParams({
    filename: c.req.param("filename") ?? "",
    ...c.req.query(),
  });
  const { canvas } = await renderVH(colIds, params);
  if (canvas) {
    c.header("Content-Type", "image/png");
    c.header("Content-Disposition", `inline; filename="${params.name}"`);
    return c.body(canvas.toBuffer("image/png"));
  }
  throw new HTTPException(400);
});
app.post("/", parseToken, async (c) => {
  const accessToken = c.var.token;
  if (!accessToken) throw new HTTPException(401, { message: "invalid" });
  const form = await c.req.parseBody() as Record<string, string>; // todo add validate
  const ids = parseIds(form.ids ?? "");
  const params = getParams(form);
  const { canvas } = await renderVH(ids, params);
  if (canvas) {
    const type = "image/png"; // "image/jpeg";
    const u8 = canvas.toBuffer(type);
    const blob = new Blob([u8], { type });
    const desc = JSON.stringify(ids);
    const res = await upload(
      blob,
      { accessToken, app: "GyazoCombine", title: params.name, desc },
    );
    if (res.ok) {
      const { permalink_url } = res.value;
      c.status(201);
      c.header("Content-Location", permalink_url);
      return c.render(
        html`<p>アップロード完了<br/><a href="${permalink_url}">${permalink_url}</a></p>`,
      );
    }
    throw new HTTPException(400, { message: res.error });
  }
  throw new HTTPException(400);
});

export default app;
