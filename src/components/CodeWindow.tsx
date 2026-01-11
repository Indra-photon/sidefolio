
"use client";

import React, { useEffect, useState, useRef } from "react";
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';

interface CodeWindowProps {
  title?: string;
  children: React.ReactNode;
  language?: string;
}

export const CodeWindow = ({ title = "Code", children, language = "javascript" }: CodeWindowProps) => {
  const [isClient, setIsClient] = useState(false);
  const [buttonText, setButtonText] = useState("Copy");
  const codeRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Apply Prism syntax highlighting
  useEffect(() => {
    if (codeRef.current && isClient) {
      Prism.highlightElement(codeRef.current);
    }
  }, [isClient, children]);

  const handleCopy = () => {
    if (codeRef.current) {
      const textToCopy = codeRef.current.innerText;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setButtonText("Copied!");
          setTimeout(() => {
            setButtonText("Copy");
          }, 1500);
        })
        .catch((err) => {
          console.error("Error copying text to clipboard:", err);
        });
    }
  };

  if (!isClient) return null;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden my-6">
      {/* Header with title and copy button */}
      <div className="flex justify-between items-center bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
        <span className="text-emerald-400 text-sm font-medium bg-emerald-600/10 px-3 py-1 rounded">
          {title}
        </span>

        <button
          onClick={handleCopy}
          className="group relative text-xs font-medium text-gray-300 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2 bg-neutral-700/50 hover:bg-neutral-700 px-3 py-1 rounded transition-colors">
            {buttonText === "Copied!" ? (
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
            {buttonText}
          </span>
        </button>
      </div>

      {/* Code content with scroll */}
      <div 
        ref={containerRef}
        className="overflow-x-auto overflow-y-auto max-h-96"
      >
        <pre className="!bg-transparent !border-0 !my-0 !p-4">
          <code 
            ref={codeRef}
            className={`language-${language} !text-sm`}
          >
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};