"use client";

import { useEffect, useRef, useState } from 'react';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';


// import 'prismjs/themes/prism-okaidia.css';    // Monokai style - very colorful!
// import 'prismjs/themes/prism-twilight.css';   // Purple/pink theme
// import 'prismjs/themes/prism-dark.css';       // Simple dark
// import 'prismjs/themes/prism-funky.css';      // Fun, vibrant colors
// import 'prismjs/themes/prism-solarizedlight.css';  // Light theme

// Import core languages only
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

interface PrismHighlighterProps {
  content: string;
  className?: string;
}

export default function PrismHighlighter({ content, className }: PrismHighlighterProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (codeText: string, index: number) => {
  try {
    await navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  } catch (error) {
    console.error('Failed to copy:', error);
  }
};

  useEffect(() => {
    console.log('🔍 PrismHighlighter mounted');
    
    if (contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll('pre code');
      console.log('📦 Found code blocks:', codeBlocks.length);
      
      codeBlocks.forEach((block, index) => {
        console.log(`\n--- Code Block ${index + 1} ---`);
        console.log('Original classes:', block.className);
        console.log('Content preview:', (block.textContent || '').substring(0, 50));
        
        const pre = block.parentElement;
        if (pre) {
          // Set language
          pre.className = 'language-javascript';
          block.className = 'language-javascript';
          
          console.log('✅ Added classes:', block.className);
          
          // Try highlighting
          try {
            console.log('🎨 Attempting to highlight...');
            Prism.highlightElement(block as HTMLElement);
            console.log('✅ Highlight successful!');
          } catch (error) {
            console.error('❌ Highlight failed:', error);
          }
        }
      });
    } else {
      console.log('❌ contentRef is null');
    }
  }, [content]);

  return (
    <div 
      ref={contentRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}