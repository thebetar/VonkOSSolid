import { isNarrowTerminal } from "@/lib/ansi";

/** Marker prefix for lines that should render as inline terminal images. */
export const IMAGE_LINE_PREFIX = "\x1fIMG:";

/** Max pixel width when embedding images (keeps IIP payloads small + readable). */
const MAX_IMAGE_WIDTH = 1040;

/** Desktop display width inside the terminal (percent of viewport). */
const DESKTOP_IMAGE_WIDTH_PERCENT = 40;

/** Mobile: use the full terminal width. */
const MOBILE_IMAGE_WIDTH_PERCENT = 100;

function imageWidthPercent(): number {
  if (isNarrowTerminal()) {
    return MOBILE_IMAGE_WIDTH_PERCENT;
  }

  return DESKTOP_IMAGE_WIDTH_PERCENT;
}

export function imageLine(src: string): string {
  return `${IMAGE_LINE_PREFIX}${src}`;
}

export function isImageLine(line: string): boolean {
  return line.startsWith(IMAGE_LINE_PREFIX);
}

export function imageSrcFromLine(line: string): string {
  return line.slice(IMAGE_LINE_PREFIX.length);
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function loadHtmlImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

function canvasToPngBytes(img: HTMLImageElement): Promise<Uint8Array> {
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (width < 1 || height < 1) {
    return Promise.reject(new Error("Invalid image dimensions"));
  }

  if (width > MAX_IMAGE_WIDTH) {
    height = Math.round((height * MAX_IMAGE_WIDTH) / width);
    width = MAX_IMAGE_WIDTH;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return Promise.reject(new Error("Canvas 2D unavailable"));
  }

  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("PNG encode failed"));
          return;
        }

        void blob.arrayBuffer().then((buffer) => {
          resolve(new Uint8Array(buffer));
        }, reject);
      },
      "image/png",
      0.92,
    );
  });
}

/**
 * Prepare image payload for iTerm IIP (PNG only).
 * Always rasterize/resize via canvas so WebP/GIF/JPEG work and `size` is exact.
 */
export async function imageUrlToPngBase64(
  url: string,
): Promise<{ base64: string; size: number }> {
  const img = await loadHtmlImage(url);
  const bytes = await canvasToPngBytes(img);
  return {
    base64: bytesToBase64(bytes),
    size: bytes.length,
  };
}

/** iTerm2 Inline Image Protocol sequence for xterm ImageAddon. */
export function buildInlineImageSequence(
  base64: string,
  size: number,
  widthPercent = imageWidthPercent(),
): string {
  // `size` MUST be the exact decoded byte length — a wrong estimate makes ImageAddon
  // abort the sequence silently (often only some images in a post appear).
  return `\x1b]1337;File=inline=1;width=${widthPercent}%;preserveAspectRatio=1;size=${size}:${base64}\x07`;
}
