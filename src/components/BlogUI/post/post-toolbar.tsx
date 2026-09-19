"use client";

import { Code2, Link2, TextQuote } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { githubSourceUrl } from "@/lib/blog/site";

import { CopyIcon } from "../mdx/copy-icon";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

function Action({
  label,
  onClick,
  onPrefetch,
  children,
}: {
  label: string;
  onClick: () => void;
  /** Fired on hover/focus so a click can complete without waiting on the network. */
  onPrefetch?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          onClick={onClick}
          onPointerEnter={onPrefetch}
          onFocus={onPrefetch}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function useCopied() {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);
  const flash = () => {
    setCopied(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 1500);
  };
  return { copied, flash };
}

function CopyLinkButton() {
  const { copied, flash } = useCopied();
  return (
    <Action
      label="Copy link"
      onClick={async () => {
        await navigator.clipboard.writeText(window.location.href);
        flash();
      }}
    >
      <CopyIcon copied={copied} icon={<Link2 />} />
    </Action>
  );
}

// Copies the agent-friendly Markdown version of the current post. The text
// is fetched on hover so the clipboard write still happens inside the
// click's user activation, which Safari requires.
function CopyMarkdownButton({ href }: { href: string }) {
  const { copied, flash } = useCopied();
  const markdown = useRef<Promise<string> | undefined>(undefined);

  useEffect(() => {
    markdown.current = undefined;
  }, [href]);

  const load = () => {
    markdown.current ??= fetch(href).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    });
    return markdown.current;
  };

  return (
    <Action
      label="Copy as Markdown"
      onPrefetch={load}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(await load());
        } catch {
          markdown.current = undefined;
          return;
        }
        flash();
      }}
    >
      <CopyIcon copied={copied} icon={<TextQuote />} />
    </Action>
  );
}

function ViewSourceButton({ href }: { href: string }) {
  return (
    <Action label="View source" onClick={() => window.open(href, "_blank", "noopener,noreferrer")}>
      <Code2 />
    </Action>
  );
}

/**
 * Right side of the blog toolbar. Post-only actions appear when the current
 * path is a known post (looked up in the href → source map from the layout).
 */
export function PostToolbar({ sourcePaths }: { sourcePaths: Record<string, string> }) {
  const pathname = usePathname();
  const sourcePath = sourcePaths[pathname];
  const isPost = sourcePath !== undefined;

  // Grouped so moving between adjacent tooltips skips the open delay.
  return (
    <TooltipProvider delayDuration={400} skipDelayDuration={500}>
      <div className="flex items-center gap-1">
        {isPost && <CopyMarkdownButton href={`${pathname}.md`} />}
        <CopyLinkButton />
        {isPost && <ViewSourceButton href={githubSourceUrl(sourcePath)} />}
      </div>
    </TooltipProvider>
  );
}
