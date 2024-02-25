import { int, Rect, Source } from "./util.ts";

const crop = <R extends Rect & { crop?: Rect }>(
  source: R,
  ratio = 16 / 9,
): R => {
  const { x = 0, y = 0, w, h } = source.crop ?? source;
  const res: Rect = { x, y, w, h };
  if (w / h > ratio) {
    res.w = int(source.h * ratio);
    res.x = (source.x ?? 0) + int((source.w - res.w) / 2);
  } else {
    res.h = int(source.w / ratio);
    res.y = (source.y ?? 0) + int((source.h - res.h) / 2);
  }
  return Object.assign(source, res, { crop: { ratio, x, y, w, h } as Rect });
};
const cropAll = <T>(sources: Source<T>[], init: number) => {
  if (init < 0) {
    const { w, h } = sources[-init - 1] ?? sources[0];
    init = w / h;
  }
  if (init > 0) {
    for (const source of sources) crop(source, init);
  }
  return sources;
};

const getCanvasOrigin = (
  canvasW: number,
  canvasH: number,
  canvasRatio: number,
) => {
  let x = 0, y = 0, w = canvasW, h = canvasH;
  if (canvasW / canvasH > canvasRatio) {
    h = int(canvasW / canvasRatio);
    y = -int((h - canvasH) / 2);
  } else {
    w = int(canvasH * canvasRatio);
    x = -int((w - canvasW) / 2);
  }
  return { x, y, w, h };
};
export { crop, cropAll, getCanvasOrigin };
