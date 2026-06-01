import { useState, useEffect } from 'react';
import { X, Sparkles, Download, FileJson, MessageSquare } from 'lucide-react';
import { Toolbar, ViewMode } from './components/Toolbar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { FeedbackModal } from './components/FeedbackModal';

const DEFAULT_CONTENT = `# Welcome to view.md! 🚀

A real-time Markdown editor and viewer. Designed for speed, flexibility, and a distraction-free writing experience.

---

## 🎨 Typography & Formatting

You can use **Bold**, *Italics*, ***Bold Italics***, ~Strikethrough~, and \`inline code\`.
You can also use HTML natively: <kbd>Ctrl</kbd> + <kbd>C</kbd> or <span style="color: red;">inline styles</span>.

## 🧮 KaTeX Math Equations

We fully support LaTeX math via KaTeX. 

**Inline math:** The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.

**Block math:**
$$
f(x) = \\int_{-\\infty}^\\infty \\hat f(\\xi)\\,e^{2 \\pi i \\xi x} \\, d\\xi
$$

**Align environment support:**
$$
\\begin{aligned}
x &= y + z \\\\
a &= b + c
\\end{aligned}
$$

## 💻 Syntax Highlighting

Write code with automatic syntax highlighting.

\`\`\`javascript
// Fetch weather data
async function getWeather(city) {
  try {
    const response = await fetch(\`https://api.weatherapi.com/v1/current.json?q=\${city}\`);
    const data = await response.json();
    return data.current.temp_c;
  } catch (error) {
    console.error("Failed to fetch", error);
  }
}
\`\`\`

## 📊 Tables

Tables are easy to create and style.

| Feature | Support | Description |
| :--- | :---: | :--- |
| **GFM** | ✅ | GitHub Flavored Markdown |
| **Math** | ✅ | LaTeX via KaTeX |
| **HTML** | ✅ | Raw HTML via rehype-raw |

## 📝 Lists

### Unordered List
* Apples
* Oranges
  * Mandarin
  * Clementine

### Ordered List
1. First step
2. Second step
3. Third step

### Task List
- [x] Integrate KaTeX
- [x] Add Syntax Highlighting
- [x] Support raw HTML rendering
- [ ] Write the next great American novel

## 🖼️ Media & Links

You can link to [Markdown Guide](https://www.markdownguide.org) or embed images:

![Mountain view](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop)

You can even embed elements like iframes via HTML:

<iframe width="100%" height="250" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Example YouTube Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 💬 Quotes

> "Markdown allows you to write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid HTML."
>
> - John Gruber
`;

export default function App() {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('viewdotmd-content');
    return saved !== null ? saved : DEFAULT_CONTENT;
  });
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem('viewdotmd-first-visit') !== 'false';
  });
  const [showFeedback, setShowFeedback] = useState(false);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('viewdotmd-first-visit', 'false');
  };

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('viewdotmd-content', content);
  }, [content]);

  // Handle responsive layout based on viewMode
  useEffect(() => {
    const handleResize = () => {
      // Auto switch to edit or preview on small screens if split view is selected
      if (window.innerWidth < 1024 && viewMode === 'split') {
        setViewMode('edit');
      }
    };
    
    // Initial check
    if (window.innerWidth < 1024 && viewMode === 'split') {
      setViewMode('edit');
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const handleImport = (importedContent: string, filename: string) => {
    setContent(importedContent);
    // Could display a toast here based on the filename
  };

  const handleExport = (filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  const handleExportPdf = () => {
    const element = document.getElementById('markdown-preview-content');
    if (!element) return;
    
    // Create an off-screen iframe (display: none causes blank render in html2canvas)
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '800px';
    // Use a large height to prevent html2canvas clipping the content
    iframe.style.height = '10000px';
    iframe.style.top = '-20000px';
    iframe.style.left = '-20000px';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      return;
    }
    
    // We write a clean HTML document to the iframe
    // It includes html2pdf.js and basic CSS styling (no Tailwind to avoid oklch errors with html2canvas)
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" crossorigin="anonymous" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #374151; padding: 20px; line-height: 1.6; }
          h1, h2, h3, h4, h5, h6 { color: #111827; margin-bottom: 1rem; line-height: 1.2; font-weight: 700; }
          h1 { border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; font-size: 2.25em; }
          h2 { font-size: 1.5em; margin-top: 1.5em; border-bottom: 1px solid #f3f4f6; padding-bottom: 0.3em; }
          h3 { font-size: 1.25em; margin-top: 1.25em; }
          p { margin-bottom: 1rem; }
          ul, ol { margin-bottom: 1rem; padding-left: 2rem; }
          li { margin-bottom: 0.25rem; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 0.875em; }
          th, td { border: 1px solid #e5e7eb; padding: 0.5rem 0.75rem; text-align: left; }
          th { background-color: #f9fafb; font-weight: 600; }
          code { font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; background: #f3f4f6; padding: 0.2em 0.4em; border-radius: 3px; font-size: 0.85em; color: #cf222e; }
          pre { background: #1e1e2e; color: #a6accd; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1rem; }
          pre code { background: transparent; padding: 0; color: inherit; font-size: 0.85em; }
          blockquote { border-left: 4px solid #d1d5db; padding-left: 1em; color: #6b7280; font-style: italic; margin-left: 0; margin-bottom: 1rem; }
          img { max-width: 100%; height: auto; border-radius: 0.5rem; }
          a { color: #2563eb; text-decoration: none; }
          hr { border: 0; border-top: 1px solid #e5e7eb; margin: 2rem 0; }
          .katex-display { margin: 1em 0; overflow-x: auto; overflow-y: hidden; }
        </style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
      </head>
      <body>
        <div id="content">${element.innerHTML.replace(/`/g, '\\`').replace(/\$/g, '&#36;')}</div>
        <script>
          // Wait briefly to ensure script download and styles are applied
          setTimeout(function() {
            var content = document.getElementById('content');
            var opt = {
              margin:       15,
              filename:     'document.pdf',
              image:        { type: 'jpeg', quality: 0.98 },
              html2canvas:  { scale: 2, useCORS: true, windowWidth: 800 },
              jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            if (window.html2pdf) {
              window.html2pdf().set(opt).from(content).save().then(function() {
                window.parent.postMessage('pdf-done', '*');
              });
            } else {
              window.parent.postMessage('pdf-done', '*'); // Fallback if failed to load
            }
          }, 1000);
        </script>
      </body>
      </html>
    `);
    doc.close();
    
    // Clean up iframe after done
    const listener = (e: MessageEvent) => {
      if (e.data === 'pdf-done') {
        document.body.removeChild(iframe);
        window.removeEventListener('message', listener);
      }
    };
    window.addEventListener('message', listener);
    
    // Fallback cleanup in case iframe hangs
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
        window.removeEventListener('message', listener);
      }
    }, 10000);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#F9FAFB] text-gray-900 overflow-hidden font-sans">
      <Toolbar 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        onImport={handleImport} 
        onExport={handleExport} 
        onExportPdf={handleExportPdf}
      />
      
      <main className="flex-1 flex overflow-hidden w-full relative">
        {/* Editor Area */}
        <div 
          className={`h-full transition-all duration-300 ease-in-out border-r border-gray-200 ${
            viewMode === 'edit' ? 'w-full' : 
            viewMode === 'split' ? 'w-1/2 hidden lg:block' : 
            'w-0 hidden'
          }`}
        >
          <Editor value={content} onChange={setContent} />
        </div>

        {/* Preview Area */}
        <div 
          className={`h-full transition-all duration-300 ease-in-out bg-white overflow-y-auto ${
            viewMode === 'preview' ? 'w-full' : 
            viewMode === 'split' ? 'w-1/2 hidden lg:block' : 
            'w-0 hidden'
          }`}
        >
          <Preview content={content} />
        </div>
      </main>

      {/* Status Footer */}
      <footer className="flex items-center justify-between px-4 h-8 bg-white border-t border-gray-200 text-[10px] text-gray-500 font-medium shrink-0">
        <div className="flex items-center space-x-6">
          <span>Words: {content.trim() ? content.trim().split(/\s+/).length : 0}</span>
          <span className="hidden sm:inline">Characters: {content.length}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              <span>Auto-save: ON</span>
            </div>
            <span className="px-2 py-0.5 border border-gray-300 rounded">UTF-8</span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">Markdown</span>
          </div>
          <button
            onClick={() => setShowFeedback(true)}
            className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Send feedback"
          >
            <MessageSquare size={10} />
            Feedback
          </button>
        </div>
      </footer>

      {/* Feedback Modal */}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}

      {/* Welcome Modal for First-time Users */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header pattern */}
            <div className="h-24 bg-gray-900 w-full flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg relative z-10 rotate-3 transition-transform hover:rotate-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-8 h-8">
                  <rect width="32" height="32" rx="7" fill="#111827"/>
                  <text x="5" y="22" fontFamily="'Courier New', monospace" fontSize="14" fontWeight="800" fill="white">.md</text>
                </svg>
              </div>
            </div>
            
            <button 
              onClick={handleCloseWelcome}
              className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors z-20"
              aria-label="Close"
            >
              <X size={16} />
            </button>
            
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
                view.md
              </h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Welcome to your new favorite markdown editor. Designed for speed, flexibility, and a distraction-free writing experience.
              </p>
              
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Sparkles size={18} className="text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Seamless Split-View</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Write on the left, see realtime preview on the right.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <FileJson size={18} className="text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Advanced Formatting</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Tables, syntax highlighting, and KaTeX math support.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Download size={18} className="text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">1-Click Export</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Download as original Markdown or perfectly styled PDF.</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleCloseWelcome}
                className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all hover:shadow focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Start Writing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
