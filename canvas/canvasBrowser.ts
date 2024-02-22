/// <reference lib="dom" />
import type { Source } from "./util.ts";

const imageCache = new Map<string, Promise<HTMLImageElement>>();
const newImage = (url: string) => {
  const image = new Image();
  image.src = url;
  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = reject;
  });
};

const getSource = async (id: string): Promise<Source<HTMLImageElement>> => {
  if (id && !id.toLowerCase().startsWith("dummy")) {
    id = id.startsWith("http") ? id : `https://i.gyazo.com/${id}`;
    const imagePromise = imageCache.get(id) ?? newImage(id);
    if (!imageCache.has(id)) imageCache.set(id, imagePromise);
    try {
      const image = await imagePromise;
      const [w, h] = [image.naturalWidth, image.naturalHeight];
      return { type: "image", image, w, h };
    } catch (e) {
      console.warn(e);
    }
  }
  return { type: "dummy", w: 100, h: 100 };
};
const createCanvas = (width: number, height: number) => {
  const canvas = new HTMLCanvasElement();
  Object.assign(canvas, { width, height });
  return canvas;
};

export { createCanvas, getSource };
