import { Context } from "@hono/hono";
import { deleteCookie, getCookie, setCookie } from "@hono/hono/cookie";
import { OAuth2Client } from "@cmd-johnson/oauth2-client";
import * as Iron from "@brc-dd/iron";
import { createMiddleware } from "./factory.ts";

async function encrypt(password: string, payload: object | string) {
  return await Iron.seal(crypto, payload, password, Iron.defaults);
}
async function decrypt(password: string, encrypted: string) {
  return await Iron.unseal(crypto, encrypted, password, Iron.defaults);
}

const tokenCookieName = "__Host-token" as const;
const tokenCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
  maxAge: 60 * 60 * 24 * 45, //45days
} as const;
const tokenCookieSecret = Deno.env.get("COOKIE_SECRET") ?? "cookie_secret";

const setEncryptToken = async (c: Context, rawToken: string) => {
  const tokenCookie = rawToken
    ? await encrypt(tokenCookieSecret, rawToken)
    : "";
  if (tokenCookie) {
    setCookie(c, tokenCookieName, tokenCookie, tokenCookieOptions);
  } else throw new Error("failed");
};
const deleteToken = (c: Context) =>
  deleteCookie(c, tokenCookieName, tokenCookieOptions);

const parseToken = createMiddleware(
  async (c, next) => {
    const tokenCookie = getCookie(c, tokenCookieName);
    if (tokenCookie) {
      const token = await decrypt(tokenCookieSecret, tokenCookie) as string;
      c.set("token", token);
      c.set(
        "setToken",
        () => setCookie(c, tokenCookieName, tokenCookie, tokenCookieOptions),
      );
    }
    await next();
  },
);
let oauth2Client: OAuth2Client | undefined;
const getOauth2Client = (authUrl: string) => {
  return oauth2Client ??= new OAuth2Client({
    clientId: Deno.env.get("GYAZO_CLIENT_ID")!,
    clientSecret: Deno.env.get("GYAZO_CLIENT_SECRET")!,
    authorizationEndpointUri: "https://api.gyazo.com/oauth/authorize",
    tokenUri: "https://api.gyazo.com/oauth/token",
    redirectUri: `${authUrl}/callback`,
  });
};

export { deleteToken, getOauth2Client, parseToken, setEncryptToken };
