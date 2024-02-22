import type { CanvasContext2D, Rect, Source } from "./util.ts";
import { int, vals } from "./util.ts";

const drawImage = <T>(
  ctx: CanvasContext2D<T>,
  source: Source<T>,
  { x = 0, y = 0, w, h }: Partial<Rect> = {},
) => {
  w ??= h ? int(source.w * h / source.h) : source.w;
  h ??= int(source.h * w / source.w);
  if (source.type === "image") {
    ctx.drawImage(source.image, ...vals(source), x, y, w, h);
  }
  return { x: x + w, y: y + h, w, h };
};
const drawColumn = <T>(
  ctx: CanvasContext2D<T>,
  sources: Source<T>[],
  { x = 0, y = 0, w, h }: Partial<Rect> = {},
) => {
  w ??= h
    ? int(h / sources.reduce((sum, s) => sum + s.h / s.w, 0))
    : sources[0].w;
  console.debug("col", { x, y, w });
  let colH = 0;
  for (const source of sources) {
    const { h } = drawImage(ctx, source, { x, y, w });
    colH += h;
    y += h;
  }
  return { x: x + w, y, w, h: colH };
};

export { drawColumn, drawImage };
