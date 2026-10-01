"use client";

import React, { useMemo } from "react";

interface RichTextContentProps {
  content: string;
  className?: string;
  as?: "p" | "div" | "span";
}

// Checks if content contains HTML tags
const hasHtmlTags = (str: string): boolean => {
  return /<\/?[a-z][\s\S]*>/i.test(str);
};

// Formats rich text for display: fixes links, handles linebreaks
export const formatRichTextHtml = (htmlContent: string): string => {
  if (!htmlContent) return "";

  if (!hasHtmlTags(htmlContent)) {
    // Plain text: escape basic HTML and replace newlines with <br />
    const escaped = htmlContent
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return escaped.replace(/\n/g, "<br />");
  }

  let formatted = htmlContent;

  // Ensure all anchor tags have target="_blank" and rel="noopener noreferrer" and styling
  formatted = formatted.replace(
    /<a\b([^>]*?)>/gi,
    (match, attrs) => {
      // If href is missing or invalid, leave as is
      let updatedAttrs = attrs;
      if (!/target=/i.test(updatedAttrs)) {
        updatedAttrs += ' target="_blank"';
      }
      if (!/rel=/i.test(updatedAttrs)) {
        updatedAttrs += ' rel="noopener noreferrer"';
      }
      if (!/class=/i.test(updatedAttrs)) {
        updatedAttrs += ' class="text-accent underline font-medium hover:opacity-80 transition-opacity"';
      } else {
        updatedAttrs = updatedAttrs.replace(
          /class=(["'])(.*?)\1/i,
          'class="$2 text-accent underline font-medium hover:opacity-80 transition-opacity"'
        );
      }
      return `<a${updatedAttrs}>`;
    }
  );

  return formatted;
};

export const RichTextContent = ({
  content,
  className = "",
  as = "div",
}: RichTextContentProps) => {
  const formattedHtml = useMemo(() => formatRichTextHtml(content), [content]);

  const Tag = as;

  return (
    <Tag
      className={`break-words leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  );
};
