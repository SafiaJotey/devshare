"use client";

import { useEffect, useRef } from "react";
// Import your helper if you want to reuse it, 
// but we'll call the resize logic inside useEffect
import { handleAutoResize } from "../../helper";

interface HeadingBlockProps {
  content: string;
  onUpdate: (content: string, metadata?: string) => void;
}

export const HeadingBlock = ({ content, onUpdate }: HeadingBlockProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to perform the resize logic
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Trigger adjustment on mount and when content changes
  useEffect(() => {
    adjustHeight();
  }, [content]);

  return (
    <textarea
      ref={textareaRef} // 1. Attach the ref
      rows={1}
      className="text-3xl font-bold w-full bg-transparent border-none outline-none placeholder:text-foreground/10 resize-none overflow-hidden leading-tight"
      value={content}
      onChange={(e) => {
        onUpdate(e.target.value);
        // adjustHeight(); // This handles live typing
      }}
      placeholder="Section Heading"
    />
  );
};