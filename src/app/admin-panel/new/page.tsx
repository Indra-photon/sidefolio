import Link from "next/link";
import { notFound } from "next/navigation";

import { NewPostForm, type PickerNode } from "@/components/BlogUI/admin/new-post-form";
import { Text } from "@/components/UINewBlocks/Typography";
import { CATEGORY_TREE, type CategoryNode } from "@/lib/blog/categories";

function toPicker(node: CategoryNode): PickerNode {
  return {
    slug: node.slug,
    name: node.name,
    path: node.path.join("/"),
    children: node.children.map(toPicker),
  };
}

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { category } = await searchParams;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <header>
        <h1 className="text-card-header font-medium text-foreground">New post</h1>
        <Text variant="body" className="mt-1">
          Choose where it lives, give it a title, and you&apos;ll land in the editor. Need a
          category that isn&apos;t here?{" "}
          <Link href="/keystatic/singleton/categories" className="text-foreground underline underline-offset-4">
            Manage categories
          </Link>
          .
        </Text>
      </header>
      <NewPostForm tree={CATEGORY_TREE.map(toPicker)} initialCategory={category} />
    </div>
  );
}
