/** https://github.com/takker99/deno-gyazo
MIT License

Copyright (c) 2022 takker

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

type Result<T> =
  & { status: number }
  & ({ ok: false; error: string } | { ok: true; value: T });
interface GyazoImage {
  image_id: string;
  url: string;
  permalink_url: string;
  type: string;
  created_at: string;
  metadata: {
    app: string | null;
    title: string | null;
    desc: string | null;
  };
}
interface OAuthOptions {
  accessToken: string;
  fetch?: (input: string, init?: RequestInit) => Promise<Response>;
}
const getImages = async (init: OAuthOptions): Promise<Result<GyazoImage[]>> => {
  const { accessToken, fetch = globalThis.fetch } = init;
  const res = await fetch(`https://api.gyazo.com/api/images`, {
    headers: { "Authorization": `Bearer ${accessToken}` },
  });
  const { ok, status } = res;
  if (!ok) {
    return { ok, status, error: await res.text() };
  }
  const value: GyazoImage[] = await res.json();
  return { ok, status, value };
};

const getImage = async (
  imageId: string,
  init: OAuthOptions,
): Promise<Result<GyazoImage>> => {
  const { accessToken, fetch = globalThis.fetch } = init;
  const res = await fetch(`https://api.gyazo.com/api/images/${imageId}`, {
    headers: { "Authorization": `Bearer ${accessToken}` },
  });
  const { ok, status } = res;
  if (!ok) {
    return { ok, status, error: await res.text() };
  }
  const value: GyazoImage = await res.json();
  return { ok, status, value };
};
type UploadOptions = Partial<GyazoImage["metadata"] & { created_at: number }>;
const upload = async (
  imageData: Blob,
  init: UploadOptions & OAuthOptions,
): Promise<Result<GyazoImage>> => {
  const { accessToken, fetch = globalThis.fetch } = init;
  let { app, title, desc, created_at } = init;
  if (imageData instanceof File) {
    title ??= imageData.name;
  }
  const formData = new FormData();
  formData.append("access_token", accessToken);
  if (app) formData.append("app", app);
  if (title) formData.append("title", title);
  if (desc) formData.append("desc", desc);
  if (created_at) formData.append("created_at", `${created_at}`);
  formData.append("imagedata", imageData);
  const res = await fetch(`https://upload.gyazo.com/api/upload`, {
    method: "POST",
    body: formData,
  });
  const { ok, status } = res;
  if (!ok) {
    return { ok, status, error: await res.text() };
  }
  const value: GyazoImage = await res.json();
  return { ok, status, value };
};
export { getImage, getImages, upload };
export type { GyazoImage, OAuthOptions, Result, UploadOptions };
