import React from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Editor({ value, onChange, className = '' }: EditorProps) {
  return (
    <section className={`flex flex-col h-full bg-white relative w-full ${className}`}>
      <div className="flex items-center justify-between px-4 h-10 bg-[#F3F4F6] border-b border-gray-200 shrink-0">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Editor</span>
        <span className="text-[11px] text-gray-400 font-mono italic underline">markdown.md</span>
      </div>
      <div className="flex-1 bg-white relative overflow-hidden">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-6 font-mono text-sm leading-relaxed text-gray-700 bg-transparent resize-none focus:outline-none placeholder-gray-400 absolute inset-0"
          placeholder="Start writing markdown here..."
          spellCheck="false"
        />
      </div>
    </section>
  );
}
