import type { CanvasLike, Source } from "./util.ts";
import type { Params } from "../param.ts";
import { int } from "./util.ts";
import { drawColumn } from "./draw.ts";
import { trimAll } from "./trim.ts";
import { cropAll, getCanvasOrigin } from "./crop.ts";

export const injectRenderVH = <T, C extends CanvasLike<T> = CanvasLike<T>>(
  getSource: (id: string) => Promise<Source<T>>,
  createCanvas: (width: number, height: number) => C,
) =>
async (colIds: string[][], init: Params) => {
  const colSources: Awaited<ReturnType<typeof getSource>>[][] = [];
  for (const ids of colIds) {
    const sources = await Promise.all(ids.map((id) => getSource(id)));
    colSources.push(sources);
  }
  if (init.trim) {
    const max = 300;
    const ctx = createCanvas(max, max).getContext("2d");
    const cache = init.trimCache ?? true;
    trimAll(ctx, colSources.flat(), { max, cache });
  }
  if (init.crop) {
    cropAll(colSources.flat(), init.crop);
  }
  const colRatios = colSources.map((sources) =>
    1 / sources.reduce((sum, s) => sum + s.h / s.w, 0)
  );
  const canvasRatio = colRatios.reduce((sum, ratio) => sum + ratio);

  if (colSources.length) {
    if (init.width == 0 && init.height == 0) {
      const colMinWs = colSources.map((sources) =>
        Math.min(...sources.map(({ w }) => w))
      );
      const colHs = colMinWs.map((w, i) => w / colRatios[i]);
      init.height = Math.min(...colHs);
    }
    if (init.height <= 0 && init.width > 0) {
      init.height = init.width / canvasRatio;
    }

    const canvasH = init.height > 0 ? int(init.height) : colSources[0][0].h;
    // console.debug({ colRatios });
    const canvasW = int(init.width > 0 ? init.width : canvasH * canvasRatio);
    // console.debug({ canvasW, canvasH });
    let { x, y, h } = getCanvasOrigin(canvasW, canvasH, canvasRatio);
    // console.debug({ x, y, w, h });

    const canvas = createCanvas(canvasW, canvasH);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = init.color;
    ctx.fillRect(0, 0, canvasW, canvasH);

    for (const sources of colSources) {
      ({ x } = drawColumn(ctx, sources, { x, y, h }));
    }
    return { ok: true, canvas: canvas };
  }
  return { ok: false };
};
