"use client";

// Editor-only previews for the MDX component blocks in keystatic.config.tsx.
// Blocks render as a bare "LABEL / Edit" bar unless they provide a
// ContentView. Images in the editor are held as bytes until saved.

import { useEffect, useMemo } from "react";


type EditorImage = { data: Uint8Array; extension: string; filename: string } | null;

function useObjectUrl(image: EditorImage) {
  const url = useMemo(
    () => (image ? URL.createObjectURL(new Blob([image.data])) : null),
    [image],
  );
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  return url;
}

// Previews must not take the pointer or hold a text selection: the block is
// an atom node and ProseMirror needs clicks to land on the node itself.
const inert: React.CSSProperties = {
  pointerEvents: "none",
  userSelect: "none",
};

const previewFrame: React.CSSProperties = {
  borderRadius: 12,
  overflow: "hidden",
  background: "var(--ksv-color-background-surface, #f4f4f5)",
  boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
};
const previewCaption: React.CSSProperties = {
  marginTop: 6,
  fontSize: 12,
  textAlign: "center",
  opacity: 0.7,
};
const previewCode: React.CSSProperties = {
  margin: 0,
  padding: 12,
  fontSize: 12,
  lineHeight: 1.6,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  whiteSpace: "pre",
  overflowX: "auto",
  maxHeight: 240,
};

export function ImgPreview({ value }: { value: { readonly src: EditorImage; readonly alt: string; readonly caption: string } }) {
  const url = useObjectUrl(value.src);
  return (
    <figure style={{ margin: 0, ...inert }} contentEditable={false} aria-hidden="true">
      <div style={previewFrame}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={value.alt} style={{ display: "block", width: "100%", height: "auto" }} />
        ) : (
          <div style={{ padding: 24, textAlign: "center", opacity: 0.6, fontSize: 13 }}>No image selected</div>
        )}
      </div>
      {value.caption && <figcaption style={previewCaption}>{value.caption}</figcaption>}
    </figure>
  );
}

export function VideoPreview({ value }: { value: { readonly src: string; readonly id: string; readonly caption: string; readonly aspect: string } }) {
  return (
    <figure style={{ margin: 0, ...inert }} contentEditable={false} aria-hidden="true">
      <div style={{ ...previewFrame, aspectRatio: value.aspect || "16 / 9", display: "grid", placeItems: "center", fontSize: 13, opacity: 0.7 }}>
        {value.id ? `Cloudflare Stream · ${value.id}` : value.src ? `Video · ${value.src}` : "No video set"}
      </div>
      {value.caption && <figcaption style={previewCaption}>{value.caption}</figcaption>}
    </figure>
  );
}

export function CodeBlockPreview({
  value,
}: {
  value: { readonly tabs: readonly { readonly label: string; readonly code: string }[]; readonly hideHeader: boolean };
}) {
  const first = value.tabs[0];
  return (
    <div style={{ ...previewFrame, ...inert }} contentEditable={false} aria-hidden="true">
      {!value.hideHeader && (
        <div style={{ display: "flex", gap: 12, padding: "6px 12px", fontSize: 11, fontFamily: "ui-monospace, monospace", opacity: 0.7, boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.08)" }}>
          {value.tabs.map((tab, i) => (
            <span key={i} style={{ fontWeight: i === 0 ? 600 : 400 }}>{tab.label || `Tab ${i + 1}`}</span>
          ))}
        </div>
      )}
      <pre style={{ ...previewCode, overflow: "hidden" }}>{first?.code || "// empty"}</pre>
    </div>
  );
}

