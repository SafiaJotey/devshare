"use client";

import { useEffect, useRef } from "react";

interface QuoteBlockProps {
  content: string;
  onUpdate: (content: string, metadata?: string) => void;
}

export const QuoteBlock = ({ content, onUpdate }: QuoteBlockProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);

  return (
    <div className="border-l-4 border-accent pl-8 py-4 my-6 bg-accent/5 rounded-r-2xl">
      <textarea
        ref={textareaRef}
        rows={1}
        value={content}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="Insightful engineering quote..."
        className="w-full italic text-2xl font-serif border-none bg-transparent px-0 focus:outline-none resize-none text-foreground/80 placeholder:text-foreground/10 overflow-hidden leading-relaxed"
      />
    </div>
  );
};