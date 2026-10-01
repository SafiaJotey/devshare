"use client";

import { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CodeViewerProps {
  content: string;
  metadata?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export const CodeViewer = ({
  content,
  metadata = "snippet.ts",
  className = "",
  showLineNumbers = true,
}: CodeViewerProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const lines = content.split("\n");
  const displayLines = lines.length > 1 && showLineNumbers;

  return (
    <div
      className={`my-6 rounded-2xl overflow-hidden border border-foreground/10 bg-[#0d1117] shadow-xl group/code ${className}`}
    >
      {/* Top Window Bar */}
      <div className="bg-[#161b22] px-4 py-2.5 border-b border-white/5 flex justify-between items-center select-none">
        <div className="flex items-center gap-3">
          {/* macOS window control buttons */}
          <div className="flex gap-1.5 items-center">
            <span className="w-3 h-3 rounded-full bg-red-500/60 ring-1 ring-red-500/20" />
            <span className="w-3 h-3 rounded-full bg-amber-500/60 ring-1 ring-amber-500/20" />
            <span className="w-3 h-3 rounded-full bg-green-500/60 ring-1 ring-green-500/20" />
          </div>

          {/* Filename / Language indicator */}
          <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono tracking-wide">
            <Terminal size={12} className="text-white/40" />
            <span>{metadata || "snippet.ts"}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lines.length > 1 && (
            <span className="text-[11px] font-mono text-white/30 hidden sm:inline">
              {lines.length} lines
            </span>
          )}

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 border ${
              copied
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10 active:scale-95"
            }`}
            title="Copy code"
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

      {/* Code Area */}
      <div className="p-4 sm:p-5 text-xs sm:text-sm font-mono overflow-x-auto text-blue-300">
        {displayLines ? (
          <div className="flex min-w-full">
            {/* Line numbers column */}
            <div className="select-none text-white/20 text-right pr-4 border-r border-white/5 flex flex-col shrink-0 font-mono leading-relaxed">
              {lines.map((_, i) => (
                <span key={i} className="text-xs">
                  {i + 1}
                </span>
              ))}
            </div>

            {/* Code content */}
            <pre className="pl-4 overflow-x-auto leading-relaxed whitespace-pre font-mono flex-1 bg-transparent">
              <code>{content}</code>
            </pre>
          </div>
        ) : (
          <pre className="overflow-x-auto leading-relaxed whitespace-pre font-mono bg-transparent">
            <code>{content}</code>
          </pre>
        )}
      </div>
    </div>
  );
};
