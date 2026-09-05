interface CutoutOptions {
  /** sum-of-channel delta tolerance for the background flood fill to keep growing */
  threshold?: number;
  /** pixels above this saturation (max-min channel) are treated as product, not background */
  saturationCap?: number;
  /** how many pixels to grow the removed region inward, to eat anti-aliased edge halos */
  dilate?: number;
  /** transparent margin (px, in the cropped output) kept around the detected bottle */
  padding?: number;
}

/**
 * Removes a plain studio grey/white background from a product photo via a
 * border-seeded flood fill, then crops the result to the bottle's actual
 * content bounding box. Cropping matters as much as the cutout itself: a
 * photo with more headroom/footroom padding than another would otherwise
 * scale to the wrong apparent size and aspect ratio when placed on a plane.
 *
 * This is a heuristic (not ML segmentation) — it works well for photos with
 * a distinct backdrop and a lit/saturated product silhouette, which is what
 * real studio bottle photography looks like.
 */
export function cutoutStudioBackground(
  image: HTMLImageElement,
  { threshold = 20, saturationCap = 36, dilate = 2, padding = 6 }: CutoutOptions = {}
): HTMLCanvasElement {
  const w = image.naturalWidth;
  const h = image.naturalHeight;
  const source = document.createElement("canvas");
  source.width = w;
  source.height = h;
  const sctx = source.getContext("2d")!;
  sctx.drawImage(image, 0, 0);

  const imageData = sctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const n = w * h;

  const removed = new Uint8Array(n);
  const visited = new Uint8Array(n);
  const stack: number[] = [];

  const seed = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x;
    if (!visited[i]) stack.push(i);
  };

  for (let x = 0; x < w; x++) {
    seed(x, 0);
    seed(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    seed(0, y);
    seed(w - 1, y);
  }

  while (stack.length) {
    const i = stack.pop()!;
    if (visited[i]) continue;
    visited[i] = 1;

    const o = i * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (sat > saturationCap) continue; // hit a saturated (label/cap) edge — stop growing here

    removed[i] = 1;

    const x = i % w;
    const y = (i / w) | 0;
    const neighbors: [number, number][] = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const ni = ny * w + nx;
      if (visited[ni]) continue;
      const no = ni * 4;
      const delta =
        Math.abs(data[no] - r) + Math.abs(data[no + 1] - g) + Math.abs(data[no + 2] - b);
      if (delta < threshold) stack.push(ni);
    }
  }

  let mask = removed;
  for (let pass = 0; pass < dilate; pass++) {
    const next = new Uint8Array(mask);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (mask[i]) continue;
        if (
          (x > 0 && mask[i - 1]) ||
          (x < w - 1 && mask[i + 1]) ||
          (y > 0 && mask[i - w]) ||
          (y < h - 1 && mask[i + w])
        ) {
          next[i] = 1;
        }
      }
    }
    mask = next;
  }

  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (mask[i]) {
        data[i * 4 + 3] = 0;
      } else {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  sctx.putImageData(imageData, 0, 0);

  if (maxX < minX || maxY < minY) {
    // Nothing survived the cutout (shouldn't happen for real product photos) —
    // fall back to the full frame rather than producing a zero-size canvas.
    return source;
  }

  const cropX = Math.max(0, minX - padding);
  const cropY = Math.max(0, minY - padding);
  const cropW = Math.min(w, maxX + padding) - cropX;
  const cropH = Math.min(h, maxY + padding) - cropY;

  const cropped = document.createElement("canvas");
  cropped.width = cropW;
  cropped.height = cropH;
  cropped.getContext("2d")!.drawImage(source, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
  return cropped;
}
