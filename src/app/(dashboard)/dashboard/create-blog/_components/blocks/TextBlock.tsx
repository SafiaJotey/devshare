"use client";

import React, { useRef, useEffect } from "react";

interface TextBlockProps {
  content: string;
  onUpdate: (val: string) => void;
}

export const TextBlock = ({ content, onUpdate }: TextBlockProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
    
      textarea.style.height = "auto";
   
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };


  useEffect(() => {
    adjustHeight();
  }, [content]);

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      value={content}
      onChange={(e) => onUpdate(e.target.value)}
      placeholder="Write your thoughts..."
      className="w-full text-lg text-foreground/70 bg-transparent border-none outline-none resize-none overflow-hidden leading-relaxed placeholder:text-foreground/10"
    />
  );
};