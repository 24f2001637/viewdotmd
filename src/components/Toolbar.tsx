import React, { useRef, useState } from 'react';
import { Download, Upload, FileText, SplitSquareHorizontal, FileSearch, PenLine, Check } from 'lucide-react';

export type ViewMode = 'edit' | 'split' | 'preview';

interface ToolbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onImport: (content: string, filename: string) => void;
  onExport: (filename: string) => void;
  onExportPdf: () => void;
}

export function Toolbar({ viewMode, setViewMode, onImport, onExport, onExportPdf }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exportName, setExportName] = useState('document.md');
  const [showExportUi, setShowExportUi] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        onImport(content, file.name);
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be imported again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="text/*, .md, .txt, .json, .csv, .log" 
      />
      <header className="flex flex-col md:flex-row items-center justify-between px-3 md:px-6 py-3 md:py-0 md:h-14 bg-white border-b border-gray-200 z-10 shrink-0 gap-3 md:gap-0 select-none">
        
        {/* Top Row for Mobile (Logo + Actions) / Left Col for Desktop */}
        <div className="flex items-center justify-between w-full md:w-auto relative">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-6 h-6 shrink-0">
              <rect width="32" height="32" rx="7" fill="#111827"/>
              <text x="5" y="22" fontFamily="'Courier New', monospace" fontSize="14" fontWeight="800" fill="white">.md</text>
            </svg>
            <span className="font-semibold text-sm tracking-tight text-gray-900 truncate">VIEW.MD</span>
          </div>
          
          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => fileInputRef.current?.click()} className="w-8 h-8 flex items-center justify-center text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100" title="Import">
              <Upload size={14} />
            </button>
            <div className="relative">
              <button onClick={() => setShowExportUi(!showExportUi)} className="w-8 h-8 flex items-center justify-center text-white bg-gray-900 rounded-md hover:bg-gray-800" title="Export">
                <Download size={14} />
              </button>
              {/* Mobile Export Popup - Attached right to the button */}
              {showExportUi && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4 transform origin-top-right transition-all z-50">
                  <ExportMenuContent 
                    exportName={exportName} setExportName={setExportName} 
                    onExport={onExport} onExportPdf={onExportPdf} 
                    setShowExportUi={setShowExportUi} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs (Mobile bottom row, Desktop center) */}
        <nav className="flex items-center p-1 bg-[#F3F4F6] md:bg-transparent rounded-lg w-full md:w-auto justify-center md:space-x-4">
          <button onClick={() => setViewMode('edit')} className={`flex-1 md:flex-none text-center px-4 py-1.5 md:py-1 rounded-[6px] md:rounded-none text-xs font-semibold md:font-medium transition-all ${viewMode === 'edit' ? 'bg-white text-gray-900 shadow-sm md:shadow-none md:bg-transparent md:text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Editor</button>
          <button onClick={() => setViewMode('split')} className={`hidden lg:block px-4 py-1.5 md:py-1 text-center text-xs font-medium transition-all ${viewMode === 'split' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Split View</button>
          <button onClick={() => setViewMode('preview')} className={`flex-1 md:flex-none text-center px-4 py-1.5 md:py-1 rounded-[6px] md:rounded-none text-xs font-semibold md:font-medium transition-all ${viewMode === 'preview' ? 'bg-white text-gray-900 shadow-sm md:shadow-none md:bg-transparent md:text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Preview</button>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-700 rounded hover:bg-gray-50 transition-colors shadow-sm">
            Import
          </button>
          <div className="relative">
            <button onClick={() => setShowExportUi(!showExportUi)} className="px-3 py-1.5 text-xs font-medium bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors shadow-sm">
              Export As...
            </button>
            {showExportUi && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4 transform origin-top-right transition-all z-50">
                <ExportMenuContent 
                  exportName={exportName} setExportName={setExportName} 
                  onExport={onExport} onExportPdf={onExportPdf} 
                  setShowExportUi={setShowExportUi} 
                />
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

// Subcomponent to avoid code duplication
function ExportMenuContent({ exportName, setExportName, onExport, onExportPdf, setShowExportUi }: any) {
  return (
    <>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Filename & Extension
      </label>
      <div className="flex gap-2">
        <input 
          type="text" value={exportName} onChange={(e) => setExportName(e.target.value)} 
          className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500" 
          placeholder="document.md" 
        />
        <button onClick={() => { onExport(exportName || 'untitled.txt'); setShowExportUi(false); }} className="bg-gray-900 text-white p-1.5 rounded-md hover:bg-gray-800 transition-colors flex data-center justify-center items-center" title="Save File">
          <Check size={16} />
        </button>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button onClick={() => { onExportPdf(); setShowExportUi(false); }} className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-center">
          Download as PDF
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">Type any extension (.md, .txt)</p>
    </>
  );
}
