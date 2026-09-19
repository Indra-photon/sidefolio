import { CategorySection } from "@/components/BlogUI/index/category-section";
import { Text } from "@/components/UINewBlocks/Typography";
import { buildRows } from "@/lib/blog/rows";
import { buildNavTree } from "@/lib/blog/posts";
import { BLOG_DESCRIPTION } from "@/lib/blog/site";

export default function BlogIndexPage() {
  const tree = buildNavTree();
  const rows = buildRows();

  return (
    <article>
      <h1 className="text-card-header font-medium text-foreground">Index</h1>
      <Text variant="body" className="mt-3">
        {BLOG_DESCRIPTION} Short, practical write-ups with live examples where
        it helps.
      </Text>
      <div className="mt-10 flex flex-col gap-10">
        {tree.map((node) => (
          <CategorySection key={node.href} node={node} rows={rows} />
        ))}
      </div>
    </article>
  );
}
