"use client";

import { useMemo, useState, useTransition } from "react";

import { createPost, type CreatePostState } from "@/app/admin-panel/new/actions";
import { slugify } from "@/lib/blog/slugify";
import { Text } from "@/components/UINewBlocks/Typography";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

/** Serialisable category tree for the picker (no functions across the boundary). */
export type PickerNode = { slug: string; name: string; path: string; children: PickerNode[] };

const field =
  "h-9 w-full rounded-md bg-background px-3 text-sm text-foreground shadow-border outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50";
const label = "font-mono text-[11px] tracking-wider text-muted-foreground uppercase";

function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  id: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: PickerNode[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cn(field, "appearance-none")}
    >
      <option value="">{placeholder}</option>
      {options.map((node) => (
        <option key={node.path} value={node.path}>
          {node.name}
        </option>
      ))}
    </select>
  );
}

export function NewPostForm({ tree, initialCategory }: { tree: PickerNode[]; initialCategory?: string }) {
  // React 18 types lack useActionState; run the server action in a transition.
  const [state, setState] = useState<CreatePostState>({});
  const [pending, startTransition] = useTransition();
  const action = (form: FormData) =>
    startTransition(async () => {
      setState(await createPost({}, form));
    });
  const [level1, setLevel1] = useState(initialCategory ?? "");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const l1 = useMemo(() => tree.find((n) => n.path === level1), [tree, level1]);
  const l2 = useMemo(() => l1?.children.find((n) => n.path === level2), [l1, level2]);
  const categoryPath = level3 || level2 || level1;
  const effectiveSlug = slugTouched ? slug : slugify(title);

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="categoryPath" value={categoryPath} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cat1" className={label}>Category</label>
          <Select
            id="cat1"
            value={level1}
            onChange={(v) => { setLevel1(v); setLevel2(""); setLevel3(""); }}
            options={tree}
            placeholder="Choose…"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cat2" className={label}>Subcategory</label>
          <Select
            id="cat2"
            value={level2}
            onChange={(v) => { setLevel2(v); setLevel3(""); }}
            options={l1?.children ?? []}
            placeholder={l1 && l1.children.length === 0 ? "None yet" : "Optional"}
            disabled={!l1 || l1.children.length === 0}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cat3" className={label}>Sub-subcategory</label>
          <Select
            id="cat3"
            value={level3}
            onChange={setLevel3}
            options={l2?.children ?? []}
            placeholder={l2 && l2.children.length === 0 ? "None yet" : "Optional"}
            disabled={!l2 || l2.children.length === 0}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className={label}>Title</label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="How to build seamless avatar transitions"
          autoFocus
          required
          className={field}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className={label}>Slug</label>
        <input
          id="slug"
          name="slug"
          value={effectiveSlug}
          onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
          placeholder="auto from title"
          className={cn(field, "font-mono")}
        />
        <Text variant="labelSm" className="normal-case tracking-normal">
          {categoryPath ? `content/blog/${categoryPath}/${effectiveSlug || "…"}.mdx` : "Pick a category to see the file path"}
        </Text>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending || !categoryPath || !title}>
          {pending ? "Creating…" : "Create & open editor"}
        </Button>
        <Text variant="labelSm" className="normal-case tracking-normal">
          Creates a draft, then opens it in the editor.
        </Text>
      </div>
    </form>
  );
}
