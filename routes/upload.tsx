import { HTTPException } from "@hono/hono/http-exception";
import { createApp } from "../factory.ts";
import { parseToken } from "../token.ts";
import { upload } from "../gyazo.ts";

const validFiles = (arg: unknown | unknown[]) =>
  (Array.isArray(arg) ? arg : [arg])
    .filter((f): f is File => f && f instanceof File);

const app = createApp()
  .use(parseToken, async (c, next) => {
    if (!c.var.token) throw new HTTPException(401, { message: "invalid" });
    await next();
  })
  .get("/", (c) => {
    return c.render(
      <form
        method="post"
        action="/upload"
        enctype="multipart/form-data"
      >
        <label role="button">
          まとめてGyazoにアップロード
          <input
            type="file"
            name="imageData[]"
            accept="image/png, image/jpeg"
            multiple
            required
            hidden
            oninput="form.submit()"
          />
        </label>
      </form>,
    );
  })
  .post(async (c) => {
    const accessToken = c.var.token!;
    const body = await c.req.parseBody({ all: true });
    const images = validFiles(body["imageData[]"]);
    if (images.length) {
      images.sort((a, b) => a.name.localeCompare(b.name));
      const uploaded = [];
      for (const image of images) {
        const options = { accessToken, title: image.name, app: "GyazoCombine" };
        const res = await upload(image, options);
        if (!res.ok) {
          throw new HTTPException(400, {
            res: c.json(
              { message: res.error, failed: image.name, uploaded },
              400,
            ),
          });
        }
        uploaded.push(res.value);
      }
      c.var.setToken?.();
      return c.json(uploaded, 201);
    }
    throw new HTTPException(400, { message: "imageDate[]:File[] is required" });
  });
export default app;
