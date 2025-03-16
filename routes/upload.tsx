import { HTTPException } from "@hono/hono/http-exception";
import { createHandlers } from "../factory.ts";
import { parseToken } from "../token.ts";

export default createHandlers(parseToken, (c) => {
  if (!c.var.token) throw new HTTPException(401, { message: "invalid" });
  return c.render(
    <form method="post" action="/images" enctype="multipart/form-data">
      <input
        type="file"
        name="imageData[]"
        accept="image/png, image/jpeg"
        multiple
        required
      />
      <button type="submit">まとめてGyazoにアップロード</button>
    </form>,
  );
});
