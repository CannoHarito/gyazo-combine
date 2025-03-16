import { createCanvas, Image, loadImage } from "@gfx/canvas-wasm";
import type { Source as _Source } from "./util.ts";

type Source<T = Image> = _Source<T>;
const imageCache = new Map<string, Promise<Image>>();
const getSource = async (id: string): Promise<Source> => {
  if (id && !id.toLowerCase().startsWith("dummy")) {
    id = id.startsWith("http") ? id : `https://i.gyazo.com/${id}`;
    const imagePromise = imageCache.get(id) ?? loadImage(id);
    if (!imageCache.has(id)) imageCache.set(id, imagePromise);
    try {
      const image = await imagePromise;
      const [w, h] = [image.width(), image.height()];
      return { type: "image", image, w, h };
    } catch (e) {
      console.warn(e);
    }
  }
  return { type: "dummy", w: 100, h: 100 };
};

export { createCanvas, getSource };
export type { Image, Source };
