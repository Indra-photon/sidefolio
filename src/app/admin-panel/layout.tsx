import { LayoutDashboard, PenLine, Video } from "lucide-react";
import Link from "next/link";

import { Text } from "@/components/UINewBlocks/Typography";

const NAV = [
  { href: "/admin-panel", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin-panel/new", label: "New post", icon: PenLine },
  { href: "/keystatic", label: "Editor", icon: PenLine },
  { href: "/admin-panel/craft-videos", label: "Craft videos", icon: Video },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] bg-background">
      <aside className="flex w-56 shrink-0 flex-col hairline-r">
        <div className="px-6 py-5 hairline-b">
          <Text variant="labelSm">Admin</Text>
        </div>
        <nav className="flex flex-col p-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-6 py-4 hairline-t">
          <Text variant="labelSm">Local only</Text>
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  );
}
