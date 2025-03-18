import { Hono } from "@hono/hono";
import { HTTPException } from "@hono/hono/http-exception";
import { parseToken } from "../token.ts";
import { getImages } from "../gyazo.ts";
import Form from "../components/form.tsx";
import Picker, { ImagePanels } from "../components/picker.tsx";

const app = new Hono();
app.get(parseToken, (c) => {
  const accessToken = c.var.token;
  return c.render(
    <>
      <Form />
      {accessToken ? <Picker /> : (
        <div>
          <a href="/auth">Gyazo Api のアクセストークンを取得する</a>
        </div>
      )}
    </>,
  );
});
app.get("/picker", parseToken, async (c) => {
  const accessToken = c.var.token;
  if (!accessToken) throw new HTTPException(401, { message: "invalid" });
  const res = await getImages({ accessToken });
  // const res = await Promise.resolve({ ok: true, value: [], error: "" });
  if (res.ok) {
    c.var.setToken?.();
    return c.html(<ImagePanels images={res.value.filter((i) => i.image_id)} />);
  }
  throw new HTTPException(400, { message: res.error });
});

export default app;
