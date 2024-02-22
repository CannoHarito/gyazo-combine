import { HTTPException } from "hono/mod.ts";
import { createFactory } from "hono/helper.ts";
import { parseToken } from "../token.ts";

const factory = createFactory();
export default factory.createHandlers(parseToken, (c) => {
  if (!c.var.token) throw new HTTPException(401, { message: "invalid" });
  return c.render(
    <form method="POST" action="/images" enctype="multipart/form-data">
      <input
        type="file"
        name="imageData[]"
        accept="image/png, image/jpeg"
        multiple
        required
      />
      <button>まとめてGyazoにアップロード</button>
    </form>,
  );
});
