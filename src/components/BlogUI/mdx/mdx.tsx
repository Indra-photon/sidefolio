import { MDXContent } from "@content-collections/mdx/react";
import type { MDXComponents } from "mdx/types";

import * as demos from "../demos";
import { CodeBlock } from "./code-block";
import { Compare, CompareItem, CompareLabel } from "./compare";
import { Demo } from "./demo";
import { Img, Video } from "./media";
import { proseComponents } from "./prose";
import { LinkList } from "./resources";

// One registry for everything an MDX file can use without importing it:
// prose element overrides, layout helpers, code, media, and every demo.
const components: MDXComponents = {
  ...proseComponents,
  CodeBlock,
  Demo,
  Compare,
  CompareItem,
  CompareLabel,
  Img,
  Video,
  LinkList,
  ...demos,
};

/** Renders a post's compiled MDX (from content-collections) on the server. */
export function Mdx({ code }: { code: string }) {
  return <MDXContent code={code} components={components} />;
}
