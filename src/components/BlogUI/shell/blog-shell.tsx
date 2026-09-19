import {
  HairlineGridHatch as Hatch,
  HairlineGridRoot as Grid,
} from "@/components/UINewBlocks/HairlineGrid";
import type { NavNode } from "@/lib/blog/posts";
import { cn } from "@/lib/utils";

import { MobileNav } from "./mobile-nav";
import { SidebarNav } from "./sidebar-nav";

/**
 * Server component. The blog sits on the same HairlineGrid column as the
 * homepage (rails, hatch bands, edge-to-edge rules). Inside the column the
 * sidebar takes a hairline-divided left cell and stays vertically centred in
 * the viewport while the reading column scrolls - craft's rail, on our grid.
 */
export function BlogShell({
  tree,
  toolbar,
  children,
  className,
}: {
  tree: NavNode[];
  /** Right-aligned actions rendered next to the mobile nav trigger. */
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Grid className={cn("blog-root", className)}>
      <Hatch height="h-16" />

      <div className="mx-auto w-full max-w-4xl lg:grid lg:grid-cols-[13.5rem_1fr]">
        <aside className="hidden hairline-r lg:block">
          {/* Sticky box the height of the viewport under the 56px navbar. The
              list is pinned to the top so its first row sits on the same
              line as the toolbar icons; only the bottom fades. */}
          <div className="sticky top-14 h-[calc(100dvh-3.5rem)] pl-6">
            <SidebarNav tree={tree} className="h-full w-full" />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex h-14 items-center justify-between px-6 hairline-b lg:px-10">
            <MobileNav tree={tree} />
            <div className="ml-auto flex items-center gap-1">{toolbar}</div>
          </div>
          <main className="px-6 py-10 lg:px-10 lg:py-12">{children}</main>
        </div>
      </div>

      <Hatch height="h-16" className="hairline-t hairline-b-none" />
    </Grid>
  );
}
