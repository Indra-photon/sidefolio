"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Demo } from "../mdx/demo";
import { Button } from "../ui/button";

const PRESETS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToHsl(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function ValueRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-9 shrink-0 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      <output className="min-w-0 flex-1 truncate rounded-md bg-background px-2.5 py-1.5 font-mono text-xs text-foreground shadow-border">
        {value}
      </output>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
        onClick={onCopy}
      >
        {copied ? <Check className="text-emerald-600 dark:text-emerald-400" /> : <Copy />}
      </Button>
    </div>
  );
}

/** Pick a colour and copy it as HEX / RGB / HSL. */
export function ColorPicker({ initialColor = "#3b82f6" }: { initialColor?: string }) {
  const [color, setColor] = useState(initialColor);
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async (label: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Demo className="px-4 sm:px-8">
      <div className="grid w-full max-w-md gap-5 sm:grid-cols-[7rem_1fr]">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            Colour
          </span>
          <span
            className="block h-28 w-full rounded-xl shadow-border transition-colors duration-300"
            style={{ backgroundColor: color }}
          />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            aria-label="Pick a colour"
            className="h-8 w-full cursor-pointer rounded-md bg-background p-1 shadow-border [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
          />
        </label>

        <div className="flex flex-col gap-3">
          <ValueRow label="hex" value={color.toUpperCase()} copied={copied === "hex"} onCopy={() => copy("hex", color)} />
          <ValueRow label="rgb" value={hexToRgb(color)} copied={copied === "rgb"} onCopy={() => copy("rgb", hexToRgb(color))} />
          <ValueRow label="hsl" value={hexToHsl(color)} copied={copied === "hsl"} onCopy={() => copy("hsl", hexToHsl(color))} />
          <div className="mt-1 flex items-center gap-2">
            <span className="w-9 shrink-0 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              Sets
            </span>
            <div className="flex gap-2" role="group" aria-label="Presets">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setColor(preset)}
                  aria-label={preset}
                  aria-pressed={color === preset}
                  className={cn(
                    "size-7 rounded-md shadow-border transition-transform duration-100 ease-out hover:scale-105 active:scale-95",
                    color === preset && "ring-2 ring-ring/50 ring-offset-2 ring-offset-card",
                  )}
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Demo>
  );
}
