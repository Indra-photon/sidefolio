"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect, useState } from "react";

import type { NavNode } from "@/lib/blog/posts";

import { Button } from "../ui/button";
import { SidebarNav } from "./sidebar-nav";

/** Below `lg`, the sidebar lives in a left sheet opened from the toolbar. */
export function MobileNav({ tree }: { tree: NavNode[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Open blog navigation" className="lg:hidden">
          <Menu />
        </Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Content className="fixed inset-y-3 left-3 z-50 flex w-64 flex-col rounded-xl bg-background px-6 shadow-border data-open:animate-in data-open:slide-in-from-left-4 data-open:fade-in-0 data-closed:animate-out data-closed:slide-out-to-left-4 data-closed:fade-out-0">
          <DialogPrimitive.Title className="sr-only">Blog navigation</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Categories and posts
          </DialogPrimitive.Description>
          <DialogPrimitive.Close asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Close navigation"
              className="absolute top-3 right-3"
            >
              <X />
            </Button>
          </DialogPrimitive.Close>
          <SidebarNav tree={tree} className="h-full pt-12" />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
