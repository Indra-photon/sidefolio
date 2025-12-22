
import { twMerge } from 'tailwind-merge';
import localFont from 'next/font/local';
import ReactMarkdown from 'react-markdown';
import { ColorPicker } from './interactive';
import { AnimatedDeleteButton } from './interactive';

const CalSans = localFont({
  src: [{ path: "../../../../fonts/CalSans-SemiBold.woff2" }],
  display: "swap",
});

interface MDXContentRendererProps {
  content: string;
}

// Component registry - add new components here
const componentMap: Record<string, any> = {
  ColorPicker,
  AnimatedDeleteButton,
};

// Custom parser to extract components from markdown
function parseContentWithComponents(content: string) {
  // Regex to match self-closing components: <ComponentName prop='value' />
  const componentRegex = /<(\w+)([^>]*)\/>/g;
  const segments: Array<{
    type: 'markdown' | 'component';
    content: string;
    componentName?: string;
    props?: Record<string, string>;
  }> = [];
  
  let lastIndex = 0;
  let match;

  while ((match = componentRegex.exec(content)) !== null) {
    // Add markdown content before the component
    if (match.index > lastIndex) {
      segments.push({
        type: 'markdown',
        content: content.slice(lastIndex, match.index)
      });
    }

    // Extract component name and props
    const componentName = match[1];
    const propsString = match[2].trim();
    const props: Record<string, string> = {};
    
    // Parse props (supports both single and double quotes)
    const propRegex = /(\w+)=['"]([^'"]*)['"]/g;
    let propMatch;
    while ((propMatch = propRegex.exec(propsString)) !== null) {
      props[propMatch[1]] = propMatch[2];
    }

    segments.push({
      type: 'component',
      componentName,
      props,
      content: match[0]
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining markdown after last component
  if (lastIndex < content.length) {
    segments.push({
      type: 'markdown',
      content: content.slice(lastIndex)
    });
  }

  return segments;
}

export function MDXContentRenderer({ content }: MDXContentRendererProps) {
  const segments = parseContentWithComponents(content);

  return (
    <div className="relative">
      {/* Left Border Pattern */}
      <div className="absolute left-0 top-0 bottom-0 w-8 border-x border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_rgb(38_38_38)_0,_rgb(38_38_38)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed hidden md:block"></div>
      
      {/* Right Border Pattern */}
      <div className="absolute right-0 top-0 bottom-0 w-8 border-x border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_rgb(38_38_38)_0,_rgb(38_38_38)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed hidden md:block"></div>
      
      <div className={twMerge(
        CalSans.className,
        "max-w-5xl mx-auto md:px-12"
      )}>
        {/* MDX Indicator */}
        <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-600/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-emerald-400 font-semibold text-sm mb-0">
              ⚡ Interactive MDX Content
            </p>
          </div>
          <p className="text-emerald-300/70 text-xs mt-1 mb-0">
            Markdown with interactive React components!
          </p>
        </div>
        
        {/* Render markdown segments and components */}
        <div className="mdx-content">
          {segments.map((segment, index) => {
            if (segment.type === 'markdown') {
              // Render markdown with ReactMarkdown
              return (
                <ReactMarkdown
                  key={index}
                  components={{
                    h1: ({node, ...props}) => (
                      <h1 className="text-3xl font-bold text-white mt-8 mb-4" {...props} />
                    ),
                    h2: ({node, ...props}) => (
                      <h2 className="text-2xl font-bold text-white mt-6 mb-3" {...props} />
                    ),
                    h3: ({node, ...props}) => (
                      <h3 className="text-xl font-bold text-white mt-4 mb-2" {...props} />
                    ),
                    p: ({node, ...props}) => (
                      <p className="text-white leading-relaxed mb-4" {...props} />
                    ),
                    a: ({node, ...props}) => (
                      <a 
                        className="text-emerald-600 no-underline hover:underline" 
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props} 
                      />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="list-disc list-inside text-white mb-4 space-y-2" {...props} />
                    ),
                    ol: ({node, ...props}) => (
                      <ol className="list-decimal list-inside text-white mb-4 space-y-2" {...props} />
                    ),
                    li: ({node, ...props}) => (
                      <li className="text-white" {...props} />
                    ),
                    strong: ({node, ...props}) => (
                      <strong className="text-gray-300 font-semibold" {...props} />
                    ),
                    em: ({node, ...props}) => (
                      <em className="text-gray-300 italic" {...props} />
                    ),
                    blockquote: ({node, ...props}) => (
                      <blockquote 
                        className="border-l-4 border-emerald-500 pl-4 italic text-gray-300 my-4" 
                        {...props} 
                      />
                    ),
                    pre: ({node, ...props}) => (
                      <pre 
                        className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 overflow-x-auto my-4" 
                        {...props} 
                      />
                    ),
                    code: ({node, className, children, ...props}) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code 
                            className="bg-neutral-800 text-emerald-400 px-1.5 py-0.5 rounded text-sm" 
                            {...props} 
                          >
                            {children}
                          </code>
                        );
                      }
                      return <code className="text-gray-300 text-sm" {...props}>{children}</code>;
                    },
                    hr: ({node, ...props}) => (
                      <hr className="border-neutral-800 my-8" {...props} />
                    ),
                    img: ({node, ...props}) => (
                      <img 
                        className="rounded-lg shadow-lg my-4 max-w-full h-auto" 
                        loading="lazy"
                        {...props} 
                      />
                    ),
                  }}
                >
                  {segment.content}
                </ReactMarkdown>
              );
            } else if (segment.type === 'component' && segment.componentName) {
              // Render React component
              const Component = componentMap[segment.componentName];
              
              if (Component) {
                return <Component key={index} {...segment.props} />;
              }
              
              // Component not found - show warning
              return (
                <div key={index} className="border border-yellow-600/30 bg-yellow-900/20 rounded-lg p-4 my-4">
                  <p className="text-yellow-400 text-sm font-semibold mb-1">
                    ⚠️ Component Not Found
                  </p>
                  <p className="text-yellow-300/70 text-xs">
                    Component <code className="bg-yellow-800/30 px-1 rounded">{segment.componentName}</code> is not registered.
                  </p>
                </div>
              );
            }
            
            return null;
          })}
        </div>
      </div>
    </div>
  );
}