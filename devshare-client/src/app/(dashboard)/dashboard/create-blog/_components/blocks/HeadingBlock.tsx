"use client";

import { useEffect, useRef } from "react";

export type HeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingBlockProps {
  type: HeadingLevel;
  content: string;
  onUpdate: (content: string, metadata?: string) => void;
  onTypeChange?: (type: HeadingLevel) => void;
}

const headingStyles: Record<HeadingLevel, string> = {
  h2: "text-3xl font-bold",
  h3: "text-2xl font-bold",
  h4: "text-xl font-bold",
  h5: "text-lg font-bold",
  h6: "text-base font-semibold uppercase tracking-wider text-foreground/75",
};

export const HeadingBlock = ({
  type = "h2",
  content,
  onUpdate,
  onTypeChange,
}: HeadingBlockProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content, type]);

  return (
    <div className="space-y-1.5">
     

      <textarea
        ref={textareaRef}
        rows={1}
        className={`w-full bg-transparent border-none outline-none placeholder:text-foreground/15 resize-none overflow-hidden leading-tight ${
          headingStyles[type] || headingStyles.h2
        }`}
        value={content}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder={`Heading (${type.toUpperCase()})`}
      />
    </div>
  );
};