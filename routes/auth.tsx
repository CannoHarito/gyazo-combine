import { Hono, HTTPException } from "hono/mod.ts";
import { deleteCookie, getCookie, setCookie } from "hono/helper.ts";
import { deleteToken, getOauth2Client, setEncryptToken } from "../token.ts";

const oauthCookieName = "code_verifier" as const;
const oauthCookieOptions = { maxAge: 60 * 60, httpOnly: true } as const;

const app = new Hono();
app.get("/", async (c) => {
  const client = getOauth2Client(new URL(c.req.url).origin + "/auth");
  const { uri, codeVerifier } = await client.code.getAuthorizationUri();
  setCookie(c, oauthCookieName, codeVerifier, oauthCookieOptions);
  return c.redirect(uri.toString(), 302);
});
app.get("/callback", async (c) => {
  const codeVerifier = getCookie(c, oauthCookieName);
  if (!codeVerifier) throw new HTTPException(401);
  const client = getOauth2Client(new URL(c.req.url).origin + "/auth");
  const { accessToken } = await client.code.getToken(c.req.url, {
    codeVerifier,
  });
  deleteCookie(c, oauthCookieName, oauthCookieOptions);
  await setEncryptToken(c, accessToken);
  return c.render(
    <a href="/">
      <h2>Success!</h2>
    </a>,
  );
});
app.all("/logout", (c) => {
  deleteToken(c);
  return c.render(
    <>
      <h2>Token Deleted!</h2>
      <a href="https://gyazo.com/oauth/authorized_applications">
        Gyazoの設定からアプリ連携を"Revoke"してください
      </a>
    </>,
  );
});

export default app;
