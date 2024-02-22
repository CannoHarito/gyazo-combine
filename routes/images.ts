import { Hono, HTTPException } from "hono/mod.ts";
import { parseToken } from "../token.ts";
import { getImages, upload } from "../gyazo.ts";

const isFiles = (arg: unknown[]): arg is File[] =>
  arg.every((f) => f instanceof File);

const app = new Hono();

app.use(parseToken, async (c, next) => {
  if (!c.var.token) throw new HTTPException(401, { message: "invalid" });
  await next();
});

const getList = app.get("/", async (c) => {
  const accessToken = c.var.token;
  const res = await getImages({ accessToken });
  if (res.ok) {
    c.var.setToken?.(c);
    return c.json(res.value.filter((i) => i.image_id));
  }
  throw new HTTPException(400, { message: res.error });
});

app.post("/", async (c) => {
  const accessToken = c.var.token;
  const body = await c.req.parseBody({ all: true });
  let images = body["imageData[]"] ?? [];
  if (!Array.isArray(images)) images = [images];
  if (images.length && isFiles(images)) {
    images.sort((a, b) => a.name.localeCompare(b.name));
    const uploaded = [];
    for (const image of images) {
      const options = { accessToken, title: image.name, app: "GyazoCombine" };
      const res = await upload(image, options);
      if (!res.ok) {
        throw new HTTPException(400, {
          res: c.json({ error: res.error, failed: image.name, uploaded }, 400),
        });
      }
      uploaded.push(res.value);
    }
    c.var.setToken?.(c);
    return c.json(uploaded, 201);
  }
  throw new HTTPException(400, { message: "imageDate[]:File[] is required" });
});
export default app;
export type GetList = typeof getList;
