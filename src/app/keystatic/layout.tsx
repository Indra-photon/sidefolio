import { notFound } from "next/navigation";

import KeystaticApp from "./keystatic";

// Local-mode editor: writes to the working copy on disk, so it only exists
// in development. In production the route is a 404.
//
// Keystatic lays itself out against the viewport with page-level scrolling,
// so it gets a fixed, scrollable box under the 56px site navbar. No z-index:
// Keystatic's dialogs/popovers portal to the end of <body> with small
// z-indexes and must paint above this layer.
export default function KeystaticLayout() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div className="fixed inset-x-0 top-14 bottom-0 overflow-y-auto bg-background [&>*]:min-h-full">
      <KeystaticApp />
    </div>
  );
}
