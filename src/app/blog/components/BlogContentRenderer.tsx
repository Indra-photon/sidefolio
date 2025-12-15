// 'use client';

// import PrismHighlighter from '@/components/PrismHighlighter';
// import { twMerge } from 'tailwind-merge';
// import localFont from 'next/font/local';

// const CalSans = localFont({
//   src: [{ path: "../../../../fonts/CalSans-SemiBold.woff2" }],
//   display: "swap",
// });

// interface BlogContentRendererProps {
//   content: string;
//   contentType: 'html' | 'mdx';
// }

// export function BlogContentRenderer({ content, contentType }: BlogContentRendererProps) {
//   if (contentType === 'html') {
//     // Use existing PrismHighlighter for HTML content from TinyMCE
//     return (
//       <div className="relative">
//         {/* Left Border Pattern - matching your existing design */}
//         <div className="absolute left-0 top-0 bottom-0 w-8 border-x border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_rgb(38_38_38)_0,_rgb(38_38_38)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed hidden md:block"></div>
        
//         {/* Right Border Pattern */}
//         <div className="absolute right-0 top-0 bottom-0 w-8 border-x border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_rgb(38_38_38)_0,_rgb(38_38_38)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed hidden md:block"></div>
        
//         <PrismHighlighter
//           content={content}
//           className={twMerge(
//             CalSans.className,
//             `prose prose-lg prose-gray max-w-5xl mx-auto md:px-12
//             prose-headings:font-bold prose-headings:text-white
//             prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
//             prose-p:text-white prose-p:leading-relaxed
//             prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
//             prose-strong:text-gray-300 prose-strong:font-semibold
//             prose-img:rounded-lg prose-img:shadow-lg
//             prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:pl-4 prose-blockquote:italic
//             prose-ul:list-disc prose-ol:list-decimal
//             prose-li:text-white
//             [&_pre]:w-full [&_pre]:md:h-auto [&_pre]:md:max-h-96 [&_pre]:overflow-x-auto [&_pre]:text-[1px]
//             [&_pre_code]:!text-sm [&_pre_code]:!leading-relaxed`
//           )}
//         />
//       </div>
//     );
//   }
  
//   // For MDX content - styled to match your existing design
//   return (
//     <div className="relative">
//       {/* Left Border Pattern */}
//       <div className="absolute left-0 top-0 bottom-0 w-8 border-x border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_rgb(38_38_38)_0,_rgb(38_38_38)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed hidden md:block"></div>
      
//       {/* Right Border Pattern */}
//       <div className="absolute right-0 top-0 bottom-0 w-8 border-x border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_rgb(38_38_38)_0,_rgb(38_38_38)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed hidden md:block"></div>
      
//       <div className={twMerge(
//         CalSans.className,
//         "prose prose-lg prose-gray max-w-5xl mx-auto md:px-12"
//       )}>
//         {/* MDX Preview Indicator */}
//         <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-600/30 rounded-lg">
//           <div className="flex items-center gap-3">
//             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
//             <p className="text-emerald-400 font-semibold text-sm mb-0">
//               ⚡ Interactive MDX Content
//             </p>
//           </div>
//           <p className="text-emerald-300/70 text-xs mt-1 mb-0">
//             Full interactive components will render here (coming in next steps)
//           </p>
//         </div>
        
//         {/* MDX Preview - styled as code for now */}
//         <pre className="whitespace-pre-wrap bg-neutral-900 border border-neutral-800 p-6 rounded-lg text-sm text-gray-300 overflow-x-auto">
//           {content}
//         </pre>
//       </div>
//     </div>
//   );
// }

'use client';

import PrismHighlighter from '@/components/PrismHighlighter';
import { twMerge } from 'tailwind-merge';
import localFont from 'next/font/local';
import { MDXContentRenderer } from './MDXContentRenderer';

const CalSans = localFont({
  src: [{ path: "../../../../fonts/CalSans-SemiBold.woff2" }],
  display: "swap",
});

interface BlogContentRendererProps {
  content: string;
  contentType: 'html' | 'mdx';
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
  // Only handles HTML content from TinyMCE
  return (
    <div className="relative">
      {/* Left Border Pattern - matching your existing design */}
      <div className="absolute left-0 top-0 bottom-0 w-8 border-x border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_rgb(38_38_38)_0,_rgb(38_38_38)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed hidden md:block"></div>
      
      {/* Right Border Pattern */}
      <div className="absolute right-0 top-0 bottom-0 w-8 border-x border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_rgb(38_38_38)_0,_rgb(38_38_38)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed hidden md:block"></div>
      
      <PrismHighlighter
        content={content}
        className={twMerge(
          CalSans.className,
          `prose prose-lg prose-gray max-w-5xl mx-auto md:px-12
          prose-headings:font-bold prose-headings:text-white
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-white prose-p:leading-relaxed
          prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-300 prose-strong:font-semibold
          prose-img:rounded-lg prose-img:shadow-lg
          prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:pl-4 prose-blockquote:italic
          prose-ul:list-disc prose-ol:list-decimal
          prose-li:text-white
          [&_pre]:w-full [&_pre]:md:h-auto [&_pre]:md:max-h-96 [&_pre]:overflow-x-auto [&_pre]:text-[1px]
          [&_pre_code]:!text-sm [&_pre_code]:!leading-relaxed`
        )}
      />
    </div>
  );
}