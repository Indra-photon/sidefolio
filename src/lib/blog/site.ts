// Blog-wide constants. BLOG_BASE is the only place the URL prefix lives:
// flip it to "/blog" at cutover and every link, route handler matcher,
// sitemap entry and llms.txt line follows.

export const BLOG_BASE = "/blog";
export const BLOG_NAME = "Articles";
export const BLOG_DESCRIPTION =
  "Notes on motion, design engineering, AI workflows and full-stack work.";

export const SITE_URL = "https://www.indrabuildswebsites.com";
export const AUTHOR = { name: "Indranil Maiti", url: SITE_URL };

// Content deep links ("view source"). Set once the repo is public.
export const GITHUB_REPO = "Indra-photon/sidefolio";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

export function githubSourceUrl(sourcePath?: string) {
  if (!sourcePath) return GITHUB_URL;
  return `${GITHUB_URL}/blob/main/content/blog/${sourcePath}`;
}
