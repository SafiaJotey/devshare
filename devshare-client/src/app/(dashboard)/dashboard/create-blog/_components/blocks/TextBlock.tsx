"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  Palette,
  RemoveFormatting,
  ExternalLink,
  Check,
  X,
  Unlink,
} from "lucide-react";

interface TextBlockProps {
  content: string;
  onUpdate: (val: string) => void;
}

const COLOR_PALETTE = [
  { name: "Default", color: "", bg: "bg-foreground/80 border-foreground/30" },
  { name: "Purple", color: "#8b5cf6", bg: "bg-[#8b5cf6]" },
  { name: "Blue", color: "#0284c7", bg: "bg-[#0284c7]" },
  { name: "Emerald", color: "#059669", bg: "bg-[#059669]" },
  { name: "Amber", color: "#d97706", bg: "bg-[#d97706]" },
  { name: "Red", color: "#dc2626", bg: "bg-[#dc2626]" },
  { name: "Pink", color: "#c026d3", bg: "bg-[#c026d3]" },
  { name: "Teal", color: "#0d9488", bg: "bg-[#0d9488]" },
];

export const TextBlock = ({ content, onUpdate }: TextBlockProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    color: "",
  });

  // Floating selection toolbar position
  const [selectionToolbarPos, setSelectionToolbarPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Synchronize content prop into editor when changed externally
  useEffect(() => {
    if (!editorRef.current) return;
    // Only update innerHTML if it's different and user isn't currently editing inside it
    if (editorRef.current.innerHTML !== content && document.activeElement !== editorRef.current) {
      editorRef.current.innerHTML = content || "";
    }
  }, [content]);

  // Clean empty HTML check
  const isContentEmpty = (html: string) => {
    const stripped = html.replace(/<[^>]*>/g, "").trim();
    return stripped.length === 0;
  };

  const triggerUpdate = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    if (isContentEmpty(html)) {
      onUpdate("");
    } else {
      onUpdate(html);
    }
  }, [onUpdate]);

  // Save current text selection range
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // Restore saved text selection range
  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
    }
  };

  // Update selection bubble toolbar position and active format states
  const updateSelectionState = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      setSelectionToolbarPos(null);
      setShowColorPicker(false);
      setShowLinkInput(false);
      return;
    }

    // Check if selection is inside this editor
    if (editorRef.current && editorRef.current.contains(sel.anchorNode)) {
      saveSelection();
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (containerRect) {
        // Calculate position relative to container
        const top = rect.top - containerRect.top - 46;
        const left = Math.max(10, rect.left - containerRect.left + rect.width / 2);
        setSelectionToolbarPos({ top, left });
      }

      // Check active formats
      try {
        setActiveFormats({
          bold: document.queryCommandState("bold"),
          italic: document.queryCommandState("italic"),
          color: document.queryCommandValue("foreColor") || "",
        });
      } catch {
        // queryCommandState might fail on some elements
      }
    } else {
      setSelectionToolbarPos(null);
    }
  }, []);

  // Format actions
  const applyBold = (e: React.MouseEvent) => {
    e.preventDefault();
    restoreSelection();
    document.execCommand("bold", false);
    triggerUpdate();
    updateSelectionState();
  };

  const applyItalic = (e: React.MouseEvent) => {
    e.preventDefault();
    restoreSelection();
    document.execCommand("italic", false);
    triggerUpdate();
    updateSelectionState();
  };

  const applyColor = (color: string, e: React.MouseEvent) => {
    e.preventDefault();
    restoreSelection();
    if (!color) {
      document.execCommand("removeFormat", false);
    } else {
      document.execCommand("styleWithCSS", false, "true");
      document.execCommand("foreColor", false, color);
    }
    triggerUpdate();
    setShowColorPicker(false);
    updateSelectionState();
  };

  const handleOpenLink = (e: React.MouseEvent) => {
    e.preventDefault();
    saveSelection();
    // Pre-fill existing link URL if on a link
    const sel = window.getSelection();
    const node = sel?.anchorNode?.parentElement;
    if (node && node.tagName === "A") {
      setLinkUrl(node.getAttribute("href") || "");
    } else {
      setLinkUrl("");
    }
    setShowLinkInput(true);
    setShowColorPicker(false);
  };

  const applyLink = (e: React.FormEvent) => {
    e.preventDefault();
    restoreSelection();
    let url = linkUrl.trim();
    if (url) {
      if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url) && !url.startsWith("#")) {
        url = `https://${url}`;
      }
      document.execCommand("createLink", false, url);
      // Enhance newly created link with target, rel, and styling classes
      if (editorRef.current) {
        const anchors = editorRef.current.querySelectorAll("a");
        anchors.forEach((a) => {
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
          a.className = "text-accent underline font-medium hover:opacity-80 transition-opacity";
        });
      }
    }
    triggerUpdate();
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const removeLink = (e: React.MouseEvent) => {
    e.preventDefault();
    restoreSelection();
    document.execCommand("unlink", false);
    triggerUpdate();
    setShowLinkInput(false);
  };

  const clearFormatting = (e: React.MouseEvent) => {
    e.preventDefault();
    restoreSelection();
    document.execCommand("removeFormat", false);
    triggerUpdate();
    updateSelectionState();
  };

  // Keyboard shortcuts handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key.toLowerCase() === "b") {
        e.preventDefault();
        document.execCommand("bold", false);
        triggerUpdate();
      } else if (e.key.toLowerCase() === "i") {
        e.preventDefault();
        document.execCommand("italic", false);
        triggerUpdate();
      } else if (e.key.toLowerCase() === "k") {
        e.preventDefault();
        saveSelection();
        setShowLinkInput(true);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Paste plain text to prevent unwanted external styling
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    triggerUpdate();
  };

  const isEmpty = isContentEmpty(content);

  return (
    <div
      ref={containerRef}
      className="relative group/text my-1 rounded-xl transition-all"
    >
      {/* 1. Quick Toolbar (Visible when block is focused or hovered) */}
      <div
        className={`absolute -top-9 right-0 flex items-center gap-1 bg-background/95 dark:bg-[#161b22]/95 backdrop-blur-md px-2 py-1 rounded-xl border border-foreground/10 shadow-lg z-30 transition-all duration-200 ${
          isFocused ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none group-hover/text:opacity-60 group-hover/text:pointer-events-auto"
        }`}
      >
        <button
          type="button"
          onMouseDown={applyBold}
          className={`p-1.5 rounded-lg text-xs hover:bg-foreground/10 transition-colors ${
            activeFormats.bold ? "bg-accent/20 text-accent font-bold" : "text-foreground/70"
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold size={14} />
        </button>

        <button
          type="button"
          onMouseDown={applyItalic}
          className={`p-1.5 rounded-lg text-xs hover:bg-foreground/10 transition-colors ${
            activeFormats.italic ? "bg-accent/20 text-accent" : "text-foreground/70"
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic size={14} />
        </button>

        {/* Link Button */}
        <button
          type="button"
          onMouseDown={handleOpenLink}
          className="p-1.5 rounded-lg text-xs hover:bg-foreground/10 text-foreground/70 transition-colors"
          title="Add Link (Ctrl+K)"
        >
          <LinkIcon size={14} />
        </button>

        {/* Color Palette Toggle */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
              setShowColorPicker(!showColorPicker);
              setShowLinkInput(false);
            }}
            className="p-1.5 rounded-lg text-xs hover:bg-foreground/10 text-foreground/70 transition-colors flex items-center gap-1"
            title="Text Color"
          >
            <Palette size={14} />
          </button>

          {/* Color Palette Dropdown */}
          {showColorPicker && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="absolute top-full mt-2 right-0 bg-background dark:bg-[#1c2129] border border-foreground/15 rounded-xl shadow-2xl p-2.5 z-50 flex flex-col gap-2 min-w-[150px] animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="text-[11px] font-medium text-foreground/50 px-1">
                Text Color
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {COLOR_PALETTE.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onMouseDown={(e) => applyColor(item.color, e)}
                    className="flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-foreground/5 transition-all group/color"
                    title={item.name}
                  >
                    <span
                      className={`w-5 h-5 rounded-full border border-black/10 shadow-sm transition-transform group-hover/color:scale-110 ${item.bg}`}
                    />
                    <span className="text-[9px] text-foreground/60 leading-none">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onMouseDown={clearFormatting}
          className="p-1.5 rounded-lg text-xs hover:bg-foreground/10 text-foreground/50 hover:text-red-500 transition-colors"
          title="Clear formatting"
        >
          <RemoveFormatting size={14} />
        </button>
      </div>

      {/* 2. Floating Selection Toolbar (Pops up directly over highlighted text) */}
      {selectionToolbarPos && (
        <div
          style={{
            top: `${selectionToolbarPos.top}px`,
            left: `${selectionToolbarPos.left}px`,
            transform: "translateX(-50%)",
          }}
          className="absolute z-50 flex items-center gap-1 bg-foreground text-background p-1 rounded-xl shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-150 whitespace-nowrap"
        >
          <button
            type="button"
            onMouseDown={applyBold}
            className={`p-1.5 rounded-lg text-xs hover:bg-background/20 transition-colors ${
              activeFormats.bold ? "bg-background/30 text-primary" : "text-background/80"
            }`}
            title="Bold"
          >
            <Bold size={13} />
          </button>
          <button
            type="button"
            onMouseDown={applyItalic}
            className={`p-1.5 rounded-lg text-xs hover:bg-background/20 transition-colors ${
              activeFormats.italic ? "bg-background/30 text-primary" : "text-background/80"
            }`}
            title="Italic"
          >
            <Italic size={13} />
          </button>
          <button
            type="button"
            onMouseDown={handleOpenLink}
            className="p-1.5 rounded-lg text-xs hover:bg-background/20 text-background/80 transition-colors"
            title="Link"
          >
            <LinkIcon size={13} />
          </button>

          {/* Color Palette in Selection Toolbar */}
          <div className="flex items-center gap-1 px-1 border-l border-white/10">
            {COLOR_PALETTE.slice(1, 6).map((item) => (
              <button
                key={item.name}
                type="button"
                onMouseDown={(e) => applyColor(item.color, e)}
                className="w-4 h-4 rounded-full border border-white/20 transition-transform hover:scale-125"
                style={{ backgroundColor: item.color }}
                title={item.name}
              />
            ))}
          </div>

          <button
            type="button"
            onMouseDown={clearFormatting}
            className="p-1.5 rounded-lg text-xs hover:bg-background/20 text-background/60 hover:text-red-400 transition-colors"
            title="Clear formatting"
          >
            <RemoveFormatting size={13} />
          </button>
        </div>
      )}

      {/* 3. Link Input Popover */}
      {showLinkInput && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute -top-12 left-0 sm:left-auto right-0 bg-background dark:bg-[#161b22] border border-foreground/15 rounded-xl shadow-2xl p-1.5 z-50 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150"
        >
          <LinkIcon size={14} className="text-foreground/40 ml-2 shrink-0" />
          <form onSubmit={applyLink} className="flex items-center gap-1.5">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="bg-foreground/5 text-xs text-foreground px-2.5 py-1 rounded-lg border border-foreground/10 outline-none focus:border-accent w-48 sm:w-64"
              autoFocus
            />
            <button
              type="submit"
              className="bg-accent text-white p-1 rounded-lg hover:bg-accent/90 transition-colors"
              title="Apply link"
            >
              <Check size={14} />
            </button>
            <button
              type="button"
              onMouseDown={removeLink}
              className="p-1 rounded-lg text-foreground/50 hover:text-red-500 hover:bg-foreground/5 transition-colors"
              title="Remove link"
            >
              <Unlink size={14} />
            </button>
            <button
              type="button"
              onClick={() => setShowLinkInput(false)}
              className="p-1 rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
              title="Cancel"
            >
              <X size={14} />
            </button>
          </form>
        </div>
      )}

      {/* 4. Placeholder Overlay */}
      {isEmpty && (
        <div
          onClick={() => editorRef.current?.focus()}
          className="absolute inset-0 pointer-events-none text-lg text-foreground/25 leading-relaxed font-normal select-none py-1"
        >
          Write your thoughts...
        </div>
      )}

      {/* 5. The ContentEditable Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={triggerUpdate}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          // slight timeout so clicking toolbar buttons works
          setTimeout(() => {
            if (document.activeElement !== editorRef.current) {
              setSelectionToolbarPos(null);
            }
          }, 200);
        }}
        onKeyUp={updateSelectionState}
        onMouseUp={updateSelectionState}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="w-full min-h-[44px] text-lg text-foreground/85 bg-transparent border-none outline-none leading-relaxed break-words py-1 focus:outline-none [&_a]:text-accent [&_a]:underline [&_a]:font-medium [&_strong]:font-bold [&_b]:font-bold [&_em]:italic [&_i]:italic"
      />
    </div>
  );
};