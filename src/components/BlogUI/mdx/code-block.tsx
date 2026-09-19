import { codeToHtml, type BundledLanguage } from "shiki";

import { CodeBlockClient } from "./code-block-client";

export type CodeTab = {
  label: string;
  language: BundledLanguage;
  code: string;
  /** Header filename; derived from the language when omitted. */
  filename?: string;
};

/**
 * Server component: highlights every tab with shiki at render time (which,
 * for static pages, means at build) and hands plain HTML to the client.
 */
export async function CodeBlock({
  tabs,
  hideHeader,
}: {
  tabs: CodeTab[];
  hideHeader?: boolean;
}) {
  if (tabs.length === 0) return null;

  const highlightedTabs = await Promise.all(
    tabs.map(async (tab) => ({
      label: tab.label,
      language: tab.language,
      code: tab.code.trim(),
      filename: tab.filename,
      html: await codeToHtml(tab.code.trim(), {
        lang: tab.language,
        themes: { light: "github-light", dark: "vesper" },
        defaultColor: false,
      }),
    })),
  );

  return <CodeBlockClient tabs={highlightedTabs} hideHeader={hideHeader} />;
}
