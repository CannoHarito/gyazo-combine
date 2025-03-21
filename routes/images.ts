import { createApp } from "../factory.ts";
import { HTTPException } from "@hono/hono/http-exception";
import { parseToken } from "../token.ts";
import { getImage, getImages } from "../gyazo.ts";

const app = createApp()
  .use(parseToken, async (c, next) => {
    if (!c.var.token) throw new HTTPException(401, { message: "invalid" });
    await next();
  })
  .get("/", async (c) => {
    const accessToken = c.var.token!;
    const res = await getImages({ accessToken });
    if (res.ok) {
      c.var.setToken?.();
      return c.json(res.value.filter((i) => i.image_id));
    }
    throw new HTTPException(400, { message: res.error });
  })
  .get("/:imageId", async (c) => {
    const accessToken = c.var.token!;
    const imageId = c.req.param("imageId");
    const res = await getImage(imageId, { accessToken });
    if (res.ok) {
      c.var.setToken?.();
      return c.json(res.value);
    }
    throw new HTTPException(400, { message: res.error });
  });
export default app;
