#!/usr/bin/env node
// Mirror public/blog/** to the R2 bucket, keeping the folder structure and
// adding a content hash to each key so URLs are immutable. Writes
// content/media-manifest.json (local path → R2 key + size) which the site
// reads at build time to serve those images from R2.
//
//   npm run media:sync            upload new/changed, delete orphans from R2
//   npm run media:sync -- --dry   show what would happen
//   npm run media:sync -- --keep  never delete from R2 (only drop from manifest)
//   npm run media:sync -- --prune also delete every object under blog/ in R2
//                                 that the manifest does not reference
//
// Deleting happens after the manifest is written. A page that is already
// deployed keeps referencing an old key until the next deploy, so push
// promptly after a sync that removed something.
//
// Needs in .env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET

import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { DeleteObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";

config({ quiet: true });

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public", "blog");
const MANIFEST = path.join(ROOT, "content", "media-manifest.json");
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
};
const dry = process.argv.includes("--dry");
const keep = process.argv.includes("--keep");
const prune = process.argv.includes("--prune");

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
  console.error("✗ Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET in .env (docs/media-guide.md §1).");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

// Same header parsing as media-upload.mjs; stored in the manifest so <Img>
// never has to touch the file at build.
function imageSize(buf) {
  if (buf.toString("ascii", 1, 4) === "PNG") return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  if (buf.toString("ascii", 0, 3) === "GIF") return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
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

async function exists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

const manifest = JSON.parse(await readFile(MANIFEST, "utf8").catch(() => "{}"));
const next = {};
const files = await walk(PUBLIC_DIR);
let uploaded = 0;
let skipped = 0;
let failed = 0;
let deleted = 0;
// R2 keys that no local file refers to any more (deleted or replaced).
const orphans = new Set();

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const type = TYPES[ext];
  const rel = "/" + path.relative(path.join(ROOT, "public"), file).split(path.sep).join("/");
  if (!type) {
    console.log(`- ${rel}: unsupported type, left local`);
    continue;
  }

  const buf = await readFile(file);
  const hash = createHash("sha256").update(buf).digest("hex").slice(0, 8);
  const dir = path.posix.dirname(rel.slice(1)); // "blog/hello-mdx"
  const base = path.posix.basename(rel, ext);
  const key = `${dir}/${base}.${hash}${ext}`;
  const size = type.startsWith("image/") ? imageSize(buf) : null;
  const entry = { key, hash, ...(size ?? {}) };

  const previous = manifest[rel];
  if (previous?.hash === hash) {
    next[rel] = { ...previous, ...entry };
    skipped++;
    continue;
  }
  if (previous?.key && previous.key !== key) orphans.add(previous.key);

  if (dry) {
    console.log(`~ ${rel}  →  ${key} (would upload)`);
    next[rel] = entry;
    continue;
  }

  try {
    if (await exists(key)) {
      console.log(`= ${rel}  →  ${key} (already in R2)`);
    } else {
      await s3.send(
        new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: buf, ContentType: type, CacheControl: ONE_YEAR }),
      );
      console.log(`✓ ${rel}  →  ${key}  (${(buf.length / 1024).toFixed(0)} KB)`);
      uploaded++;
    }
    next[rel] = entry;
  } catch (err) {
    console.error(`✗ ${rel}: ${err.message}`);
    failed++;
    if (previous) next[rel] = previous;
  }
}

const removed = Object.keys(manifest).filter((rel) => !(rel in next));
for (const rel of removed) {
  console.log(`x ${rel}: file gone locally, dropped from manifest`);
  if (manifest[rel]?.key) orphans.add(manifest[rel].key);
}

if (!dry) {
  await writeFile(MANIFEST, JSON.stringify(next, null, 2) + "\n");
}

// Never delete a key some other local file still maps to.
const live = new Set(Object.values(next).map((entry) => entry.key));
for (const key of orphans) {
  if (live.has(key)) continue;
  if (dry || keep) {
    console.log(`  ${dry ? "would delete" : "kept"} in R2: ${key}`);
    continue;
  }
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    console.log(`  deleted from R2: ${key}`);
    deleted++;
  } catch (err) {
    console.error(`✗ delete ${key}: ${err.message}`);
    failed++;
  }
}

if (prune && !keep) {
  let token;
  do {
    const page = await s3.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: "blog/", ContinuationToken: token }));
    for (const obj of page.Contents ?? []) {
      if (!obj.Key || live.has(obj.Key)) continue;
      if (dry) {
        console.log(`  would prune: ${obj.Key}`);
        continue;
      }
      try {
        await s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: obj.Key }));
        console.log(`  pruned from R2: ${obj.Key}`);
        deleted++;
      } catch (err) {
        console.error(`✗ prune ${obj.Key}: ${err.message}`);
        failed++;
      }
    }
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);
}

console.log(
  `\n${dry ? "[dry run] " : ""}${uploaded} uploaded, ${skipped} unchanged, ${removed.length} dropped, ${deleted} deleted from R2, ${failed} failed → ${path.relative(ROOT, MANIFEST)}`,
);
if (failed) process.exitCode = 1;
