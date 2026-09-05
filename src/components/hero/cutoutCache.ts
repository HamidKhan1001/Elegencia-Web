import { cutoutStudioBackground } from "./backgroundRemoval";

export interface Cutout {
  url: string;
  aspect: number;
}

// Cutting a background out of a photo is real work — cache the result per
// src so switching back to a product already seen is instant, and so the
// hero can preload all products up front and never block a transition on it.
const cache = new Map<string, Cutout>();
const inflight = new Map<string, Promise<Cutout>>();

export function getCutout(src: string): Promise<Cutout> {
  const cached = cache.get(src);
  if (cached) return Promise.resolve(cached);
  const pending = inflight.get(src);
  if (pending) return pending;

  const promise = new Promise<Cutout>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = cutoutStudioBackground(img);
      const result: Cutout = {
        url: canvas.toDataURL("image/png"),
        aspect: canvas.width / canvas.height,
      };
      cache.set(src, result);
      inflight.delete(src);
      resolve(result);
    };
    img.onerror = () => {
      inflight.delete(src);
      reject(new Error(`Failed to load ${src}`));
    };
    img.src = src;
  });

  inflight.set(src, promise);
  return promise;
}
