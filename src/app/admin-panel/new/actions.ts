"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { redirect } from "next/navigation";

import { isCategoryPath } from "@/lib/blog/categories";
import { slugify } from "@/lib/blog/slugify";

// Creates a draft .mdx in the chosen category folder and sends the author to
// the Keystatic editor for it. Local development only: the deployed site has
// no editor and a read-only filesystem.

export type CreatePostState = { error?: string };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function yamlString(value: string) {
  return JSON.stringify(value);
}

export async function createPost(_prev: CreatePostState, form: FormData): Promise<CreatePostState> {
  if (process.env.NODE_ENV === "production") return { error: "The editor only runs locally." };

  const title = String(form.get("title") ?? "").trim();
  const slug = String(form.get("slug") ?? "").trim() || slugify(title);
  const categoryPath = String(form.get("categoryPath") ?? "")
    .split("/")
    .filter(Boolean);

  if (!title) return { error: "Give the post a title." };
  if (!SLUG.test(slug)) return { error: "Slug must be kebab-case (letters, digits, hyphens)." };
  if (categoryPath.length === 0 || !isCategoryPath(categoryPath)) {
    return { error: "Pick a category." };
  }

  // Flat file under the top-level category; deeper levels go in frontmatter
  // (matches what the editor's Subcategory dropdown writes).
  const [collection, ...subcategory] = categoryPath;
  const dir = path.join(process.cwd(), "content", "blog", collection);
  const file = path.join(dir, `${slug}.mdx`);
  await mkdir(dir, { recursive: true });

  const today = new Date().toISOString().slice(0, 10);
  const frontmatter = [
    "---",
    `title: ${yamlString(title)}`,
    `description: ${yamlString("")}`,
    "published: false",
    `subcategory: ${yamlString(subcategory.join("/"))}`,
    `publishedAt: ${today}`,
    "order: 0",
    "featured: false",
    "tags: []",
    "resources: []",
    "---",
    "",
    "",
  ].join("\n");

  try {
    await writeFile(file, frontmatter, { flag: "wx" });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "EEXIST") {
      return { error: `A post with the path "${categoryPath.join("/")}/${slug}" already exists.` };
    }
    throw err;
  }

  redirect(`/keystatic/collection/${collection}/item/${slug}`);
}
