import { readFile } from "node:fs/promises";
import path from "node:path";

// Reads intrinsic dimensions from PNG/JPEG/GIF/WebP headers so images the
// editor saves into public/blog (which carry no size) still render through
// next/image without layout shift. Server-only; runs at build for static
// pages.

function parse(buf: Buffer): { width: number; height: number } | null {
  if (buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf.toString("ascii", 0, 3) === "GIF") {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) return null;
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { width: 1 + (b & 0x3fff), height: 1 + ((b >> 14) & 0x3fff) };
    }
    if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  return null;
}

const cache = new Map<string, Promise<{ width: number; height: number } | null>>();

/** Dimensions of a file under /public, e.g. "/blog/motion/foo/hero.png". */
export function localImageSize(publicPath: string) {
  let pending = cache.get(publicPath);
  if (!pending) {
    pending = readFile(path.join(process.cwd(), "public", publicPath))
      .then(parse)
      .catch(() => null);
    cache.set(publicPath, pending);
  }
  return pending;
}
