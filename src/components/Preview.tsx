import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Register only the languages you actually need — keeps the bundle lean
import tsx       from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import jsx       from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import python    from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bash      from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css       from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import json      from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import markdown  from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import sql       from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import yaml      from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import rust      from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import go        from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import java      from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import cpp       from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import csharp    from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import php       from 'react-syntax-highlighter/dist/esm/languages/prism/php';
import ruby      from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import swift     from 'react-syntax-highlighter/dist/esm/languages/prism/swift';
import kotlin    from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('sh', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('md', markdown);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('yml', yaml);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('rs', rust);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('c', cpp);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('cs', csharp);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('rb', ruby);
SyntaxHighlighter.registerLanguage('swift', swift);
SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('kt', kotlin);


interface PreviewProps {
  content: string;
  className?: string;
}

export function Preview({ content, className = '' }: PreviewProps) {
  // Pre-process markdown to handle common KaTeX rendering issues
  const processMarkdown = (text: string) => {
    if (!text) return '';
    let processed = text;
    
    // 1. Convert LaTeX-style delimiters \( \) and \[ \] to $ and $$
    processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, '$$1$');
    processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$');
    
    // 2. Fix common KaTeX specific syntax issues inside math blocks
    processed = processed.replace(/(\$\$?)([\s\S]+?)\1/g, (match, delimiters, mathContent) => {
      let fixedMath = mathContent;
      
      // Fix unescaped % inside math (convert % to \%) to prevent KaTeX comment issues
      fixedMath = fixedMath.replace(/(^|[^\\])%/g, '$1\\%');
      
      // Fix \tag in math (replace with \quad) as KaTeX often errors on it in various contexts
      if (fixedMath.includes('\\tag{')) {
        fixedMath = fixedMath.replace(/\\tag\{([^}]+)\}/g, '\\quad ($1)');
      }
      
      return `${delimiters}${fixedMath}${delimiters}`;
    });

    // 3. Fix align environments. KaTeX does not support align/align* environments directly, 
    // it requires aligned environment inside math mode.
    processed = processed.replace(/\\begin\{align\*?\}/g, '\\begin{aligned}');
    processed = processed.replace(/\\end\{align\*?\}/g, '\\end{aligned}');
    
    return processed;
  };

  const processedContent = processMarkdown(content);

  return (
    <section className={`flex flex-col h-full bg-white overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 h-10 bg-[#F3F4F6] border-b border-gray-200 shrink-0">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Real-time Preview</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-[11px] text-gray-400 uppercase">Synced</span>
        </div>
      </div>
      <div className="flex-1 p-6 md:p-10 overflow-y-auto" id="preview-scroll-container">
        <div className="max-w-3xl mx-auto w-full" id="markdown-preview-content">
          {processedContent ? (
            <div className="markdown-body">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeRaw, [rehypeKatex, { strict: false, throwOnError: false }]]}
                components={{
                  img({ node, ...props }: any) {
                    return <img {...props} src={props.src || undefined} />;
                  },
                  iframe({ node, ...props }: any) {
                    return <iframe {...props} src={props.src || undefined} />;
                  },
                  code({node, inline, className, children, ...props}: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        {...props}
                        children={String(children).replace(/\n$/, '')}
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                      />
                    ) : (
                      <code {...props} className={className}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {processedContent}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>Preview will appear here...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
