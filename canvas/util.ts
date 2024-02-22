type Rect = { x?: number; y?: number; w: number; h: number };
type Source<T> =
  & Rect
  & (
    | { type: "image"; image: T }
    | { type: "dummy" }
    // | { type: "command"; command: string; list: Source<T>[] }
  );
interface CanvasContext2D<T> {
  drawImage: (image: T, ...args: number[]) => void;
  getImageData: (...args: number[]) => { data: Uint8ClampedArray };
  // deno-lint-ignore no-explicit-any
  fillStyle: string | any;
  fillRect: (...args: number[]) => void;
}
interface CanvasLike<T> {
  getContext(type: "2d"): CanvasContext2D<T>;
}
const int = Math.round;
const vals = (...args: Partial<Rect>[]) => {
  const { x = 0, y = 0, w = 1, h = 1 } = Object.assign({}, ...args);
  return [x, y, w, h] as [number, number, number, number];
};
export { int, vals };
export type { CanvasContext2D, CanvasLike, Rect, Source };
