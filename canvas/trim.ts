import { CanvasContext2D, int, Rect, Source, vals } from "./util.ts";

const countKoro = <T>(ctx: CanvasContext2D<T>, rect: Rect) => {
  const data = ctx.getImageData(...vals(rect)).data;
  let kuro = 0;
  for (let i = 0; i < data.length; i += 4, kuro++) {
    if (data[i] > 1 || data[i + 1] > 1 || data[i + 2] > 1) break;
  }
  return kuro;
};
const getTrim = <T>(
  ctx: CanvasContext2D<T>,
  source: Source<T>,
  { max = 300 } = {},
) => {
  if (source.type != "image") return { top: 0, left: 0 };
  const { image, w, h } = source;

  const rectH = { w: max, h: 1 };
  const rectV = { w: 1, h: max };

  ctx.drawImage(image, ...vals(rectH, { y: int(h * 0.3) }), ...vals(rectH));
  const left = countKoro(ctx, rectH);
  ctx.drawImage(image, ...vals(rectV, { x: int(w * 0.3) }), ...vals(rectV));
  const top = countKoro(ctx, rectV);
  return { top, left };
};
const setTrim = <T>(
  source: Source<T> & { trim?: Rect },
  { top = 0, left = 0 },
): Source<T> => {
  if (source.type != "image") return source;
  const { w, h } = source.trim ?? source;
  return Object.assign(
    source,
    { x: left, y: top, w: w - left, h: h - top },
    { trim: { top, left, w, h } as Rect },
  );
};
const trimAll = <T>(
  ctx: CanvasContext2D<T>,
  sources: Source<T>[],
  { max = 300, cache = true } = {},
) => {
  const trimCache = new Map<string, ReturnType<typeof getTrim>>();
  for (const source of sources) {
    if (source.type != "image") continue;
    const id = [source.w, source.h].toString();
    const trim = cache && trimCache.get(id) || getTrim(ctx, source, { max });
    if (!trimCache.has(id)) trimCache.set(id, trim);
    setTrim(source, trim);
  }
  return sources;
};
export { getTrim, setTrim, trimAll };
