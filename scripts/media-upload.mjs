#!/usr/bin/env node
// Upload images / short videos to the blog's R2 bucket and print the MDX
// snippet to paste. Object keys carry a content hash so they are immutable
// and can be cached for a year everywhere (browser, CDN, next/image).
//
//   npm run media:upload -- ./shot.png
//   npm run media:upload -- ./shot.png --alt "Sidebar dot mid-flight"
//   npm run media:upload -- ./a.png ./b.jpg ./clip.mp4      (batch)
//
// Needs in .env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
//                R2_BUCKET, NEXT_PUBLIC_MEDIA_URL   (see docs/media-guide.md)

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";

import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";

config({ quiet: true });

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  NEXT_PUBLIC_MEDIA_URL,
} = process.env;

const PREFIX = "blog";
const ONE_YEAR = "public, max-age=31536000, immutable";
const TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
  fail("Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET in .env (docs/media-guide.md §1).");
}

const args = process.argv.slice(2);
const files = [];
let alt = "";
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--alt") alt = args[++i] ?? "";
  else files.push(args[i]);
}
if (files.length === 0) fail("Pass at least one file.");

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

// Reads PNG/JPEG/GIF/WebP dimensions from the header so the snippet carries
// the width/height <Img> requires.
function imageSize(buf) {
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

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function exists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function upload(file) {
  const ext = extname(file).toLowerCase();
  const type = TYPES[ext];
  if (!type) throw new Error(`unsupported extension ${ext}`);

  const buf = await readFile(file);
  const hash = createHash("sha256").update(buf).digest("hex").slice(0, 8);
  const key = `${PREFIX}/${slugify(basename(file, ext))}.${hash}${ext}`;

  if (await exists(key)) {
    console.log(`\n= ${basename(file)} already uploaded (same content)`);
  } else {
    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buf,
        ContentType: type,
        CacheControl: ONE_YEAR,
      }),
    );
    console.log(`\n✓ ${basename(file)}  →  ${key}  (${(buf.length / 1024).toFixed(0)} KB)`);
  }

  const url = NEXT_PUBLIC_MEDIA_URL ? `${NEXT_PUBLIC_MEDIA_URL.replace(/\/$/, "")}/${key}` : "(set NEXT_PUBLIC_MEDIA_URL)";
  console.log(`  url: ${url}`);
  if (type.startsWith("image/")) {
    const size = imageSize(buf);
    console.log(`  <Img src="${key}" alt="${alt}" width={${size?.width ?? "?"}} height={${size?.height ?? "?"}} />`);
    console.log(`  thumbnail: ${key}`);
  } else {
    console.log(`  <Video src="${key}" aspect="16 / 9" />`);
  }
}

for (const file of files) {
  try {
    await upload(file);
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
    process.exitCode = 1;
  }
}
