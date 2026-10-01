"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check, Terminal, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface CodeBlockProps {
  content: string;
  metadata?: string;
  onUpdate: (content: string, metadata: string) => void;
}

const COMMON_EXTENSIONS = [
  { label: "TypeScript", filename: "script.ts" },
  { label: "JavaScript", filename: "index.js" },
  { label: "React TSX", filename: "Component.tsx" },
  { label: "Python", filename: "main.py" },
  { label: "HTML", filename: "index.html" },
  { label: "CSS", filename: "styles.css" },
  { label: "JSON", filename: "data.json" },
  { label: "SQL", filename: "query.sql" },
  { label: "Bash", filename: "deploy.sh" },
  { label: "Go", filename: "main.go" },
  { label: "Rust", filename: "main.rs" },
];

export const CodeBlock = ({ content, metadata = "", onUpdate }: CodeBlockProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(140, textareaRef.current.scrollHeight)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowPresets(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Tab key for code indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (!e.shiftKey) {
        // Insert 2 spaces
        const newContent = content.substring(0, start) + "  " + content.substring(end);
        onUpdate(newContent, metadata);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      } else {
        // Shift + Tab: un-indent current line
        const lineStart = content.lastIndexOf("\n", start - 1) + 1;
        if (content.substring(lineStart, lineStart + 2) === "  ") {
          const newContent = content.substring(0, lineStart) + content.substring(lineStart + 2);
          onUpdate(newContent, metadata);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, start - 2);
          }, 0);
        }
      }
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!content) {
      toast.info("Code block is empty");
      return;
    }
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const lines = (content || "").split("\n");
  const lineCount = lines.length;

  return (
    <div className="my-4 rounded-2xl overflow-hidden border border-foreground/15 bg-[#0d1117] shadow-xl group/code transition-all focus-within:border-accent/40 focus-within:ring-1 focus-within:ring-accent/20">
      {/* Code Header Bar */}
      <div className="bg-[#161b22] px-4 py-2.5 border-b border-white/5 flex justify-between items-center select-none">
        {/* macOS Traffic Dots & Language/Filename Picker */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/50 ring-1 ring-red-500/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50 ring-1 ring-amber-500/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/50 ring-1 ring-green-500/20" />
          </div>

          {/* Filename & Presets Dropdown */}
          <div ref={dropdownRef} className="relative flex items-center">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
              <Terminal size={12} className="text-white/40 shrink-0" />
              <input
                value={metadata}
                onChange={(e) => onUpdate(content, e.target.value)}
                placeholder="filename.ts"
                className="text-xs bg-transparent border-none text-white/80 font-mono focus:outline-none w-28 sm:w-36 focus:text-accent transition-colors placeholder:text-white/30"
              />
              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="text-white/40 hover:text-white/80 transition-colors p-0.5"
                title="Select language template"
              >
                <ChevronDown size={12} />
              </button>
            </div>

            {/* Presets Menu */}
            {showPresets && (
              <div className="absolute top-full mt-1.5 left-0 w-48 bg-[#1c2129] border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-mono text-white/40 px-2 py-1 uppercase tracking-wider">
                  Presets
                </div>
                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {COMMON_EXTENSIONS.map((ext) => (
                    <button
                      key={ext.filename}
                      type="button"
                      onClick={() => {
                        onUpdate(content, ext.filename);
                        setShowPresets(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-mono text-white/70 hover:text-white hover:bg-white/10 rounded-lg text-left transition-colors"
                    >
                      <span>{ext.label}</span>
                      <span className="text-[10px] text-white/40">{ext.filename}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right stats and Copy Code Button */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/30 hidden sm:inline">
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>

          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 border ${
              copied
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10 active:scale-95"
            }`}
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400 animate-in zoom-in-50 duration-150" />
                <span className="font-mono text-[11px]">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span className="font-mono text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body with Gutter */}
      <div className="flex bg-[#0d1117] p-2 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed relative">
        {/* Line Numbers Gutter */}
        <div
          aria-hidden="true"
          className="select-none text-white/20 text-right pr-3.5 pt-2 border-r border-white/5 flex flex-col shrink-0 font-mono text-xs select-none"
        >
          {Array.from({ length: Math.max(1, lineCount) }).map((_, i) => (
            <span key={i} className="leading-relaxed block">
              {i + 1}
            </span>
          ))}
        </div>

        {/* Code Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onUpdate(e.target.value, metadata)}
            onKeyDown={handleKeyDown}
            placeholder="// Write or paste code here... (Tab to indent)"
            spellCheck={false}
            className="w-full font-mono text-xs sm:text-sm bg-transparent border-none text-blue-300 pl-3.5 pt-2 min-h-[140px] focus:outline-none resize-none overflow-hidden leading-relaxed placeholder:text-white/20"
          />
        </div>
      </div>
    </div>
  );
};