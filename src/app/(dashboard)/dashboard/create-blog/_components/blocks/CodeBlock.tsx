"use client";

import { useEffect, useRef } from "react";

interface CodeBlockProps {
  content: string;
  metadata?: string;
  onUpdate: (content: string, metadata: string) => void;
}

export const CodeBlock = ({ content, metadata = "", onUpdate }: CodeBlockProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Trigger resize on mount and when content changes
  useEffect(() => {
    adjustHeight();
  }, [content]);

  return (
    <div className="my-4 rounded-2xl overflow-hidden border border-foreground/10 bg-[#0d1117] shadow-xl group/code">
      <div className="bg-[#161b22] px-4 py-2 border-b border-white/5 flex justify-between items-center">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
        </div>
        <input 
          value={metadata} 
          onChange={(e) => onUpdate(content, e.target.value)}
          placeholder="filename.ts" 
          className="text-[10px] bg-transparent border-none text-white/40 font-mono focus:outline-none text-right focus:text-accent transition-colors"
        />
      </div>
      <textarea 
        ref={textareaRef}
        value={content} 
        onChange={(e) => onUpdate(e.target.value, metadata)}
        placeholder="// Write or paste code here..."
        className="w-full font-mono text-sm bg-transparent border-none text-blue-300 p-6 min-h-[150px] focus:outline-none resize-none overflow-hidden"
      />
    </div>
  );
};