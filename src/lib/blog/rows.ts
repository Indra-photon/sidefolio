import { cache } from "react";
import { allPosts } from "content-collections";

import type { PostRowData } from "@/components/BlogUI/index/post-row";

import { isPostAvailable } from "./posts";

/** Row data for every post, keyed by href. Built once per request. */
export const buildRows = cache(
  (): Map<string, PostRowData> =>
    new Map(
      allPosts.map((post) => [
        post.href,
        {
          title: post.title,
          description: post.description,
          href: post.href,
          publishedAt: post.publishedAt,
          readingTime: post.readingTime,
          available: isPostAvailable(post),
        },
      ]),
    ),
);
