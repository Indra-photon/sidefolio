'use client';

import { useState } from 'react';

interface ColorPickerProps {
  initialColor?: string;
}

export function ColorPicker({ initialColor = '#3b82f6' }: ColorPickerProps) {
  const [color, setColor] = useState(initialColor);
  const [copied, setCopied] = useState(false);

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Convert hex to HSL (simplified)
  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

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
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose border border-emerald-600/30 rounded-lg p-6 my-8 bg-neutral-900/50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
        <h3 className="text-emerald-400 font-semibold text-xl m-0">🎨 Interactive Color Picker</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Color Preview Section */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Pick a Color
          </label>
          <div 
            className="w-full h-48 rounded-lg border-2 border-neutral-700 transition-all duration-300 shadow-lg mb-4"
            style={{ backgroundColor: color }}
          />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-14 cursor-pointer rounded-lg border-2 border-neutral-700 bg-neutral-800"
          />
        </div>

        {/* Color Values Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs font-medium mb-1">HEX</label>
            <div className="flex gap-2">
              <input 
                value={color.toUpperCase()} 
                readOnly 
                className="flex-1 bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(color)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors font-medium text-sm"
              >
                {copied ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-medium mb-1">RGB</label>
            <div className="flex gap-2">
              <input 
                value={hexToRgb(color)} 
                readOnly 
                className="flex-1 bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(hexToRgb(color))}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors font-medium text-sm"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-medium mb-1">HSL</label>
            <div className="flex gap-2">
              <input 
                value={hexToHsl(color)} 
                readOnly 
                className="flex-1 bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(hexToHsl(color))}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors font-medium text-sm"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Quick Color Presets */}
          <div>
            <label className="block text-gray-400 text-xs font-medium mb-2">Quick Presets</label>
            <div className="grid grid-cols-5 gap-2">
              {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setColor(preset)}
                  className="w-full h-10 rounded border-2 border-neutral-700 hover:border-emerald-500 transition-colors"
                  style={{ backgroundColor: preset }}
                  title={preset}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-6 pt-4 border-t border-neutral-800">
        <p className="text-xs text-gray-500">
          💡 Click on the color input or select a preset to change colors. Copy any format to your clipboard!
        </p>
      </div>
    </div>
  );
}